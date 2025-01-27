import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { docuSignService } from '$lib/docusign/docusign.js';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { env } from '$env/dynamic/private';
import { authenticate } from '$lib/docusign/selfAppAuth';


let NODE_ENV = env.NODE_ENV
let DOCUSIGN_ACCOUNT_ID = env.DOCUSIGN_ACCOUNT_ID
// console.log('NODE_ENV:', NODE_ENV);

async function uploadFiles(files) {
    if (!files || files.length === 0) return [];

    const BASE_UPLOAD_DIR = NODE_ENV === 'development' 
        ? path.join(process.cwd(), './static', 'uploads-local') 
        : path.join(process.cwd(), '..', 'uploads');

    
    const mediaDir = path.join(BASE_UPLOAD_DIR, 'media', 'drones');

    // Create media directory if it doesn't exist
    await mkdir(mediaDir, { recursive: true });
    
    const uploadPromises = Array.from(files.entries()).map(async ([name, file])  => {
        // Check if it's an image
        if (!file.type.startsWith('image/')) {
            throw new Error('Only image files are allowed');
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('File size should be less than 5MB');
        }
        
        // Allowed extensions
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Only JPG, PNG and WebP files are allowed');
        }
        
        // Create unique filename
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.name)}`;
        const filePath = path.join(mediaDir, fileName);
        
        // Convert file to buffer and save
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);
        
        // Return the public URL path
        const uploadUrl = NODE_ENV === 'development' 
            ? `/uploads-local/media/drones/${fileName}` 
            : `/uploads/media/drones/${fileName}`;
            
        return { [name]: uploadUrl };
    });

    try {
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Error uploading files:', error);
        throw error;
    }
}


export const actions = {

    default: async ({ request, locals }) => {
        const session = await locals.getSession();
        if (!session) {
            throw redirect(303, '/login');
        }

        async function generateUniqueRegistrationId(prisma, maxAttempts = 10) {
            for (let i = 0; i < maxAttempts; i++) {
                const randomNum = Math.floor(1000 + Math.random() * 9000);
                const regId = `RG-${randomNum}`;
                
                const existing = await prisma.drone.findUnique({
                    where: { registrationId: regId }
                });
                
                if (!existing) {
                    return regId;
                }
            }
            throw new Error('Failed to generate unique registration ID');
        }

        

        // First get the user from database using email
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });

        const formData = await request.formData();

        const imageFields = ['image_top', 'image_bottom', 'image_front', 'image_back'];
        const files = new FormData();

        imageFields.forEach(field => {
            const image = formData.get(field);
            if (image){ 
                files.append(field, image)
            }
            else{
                return fail(500, {
                    error: 'Add all images'
                });
            };
        });


        let redirectUrl;
        try {

            const authData = await authenticate();

            let clickWrapData = JSON.parse(formData.get('clickWrapData'))

            if (!clickWrapData || !clickWrapData.clickwrapId || !clickWrapData.agreementId) {
                throw new Error('Invalid clickwrap data');
            }

            async function getClickwrapAgreement(clickwrapId, agreementId, accessToken) {
                try {
                    const accountId = DOCUSIGN_ACCOUNT_ID;
                    const response = await fetch(
                        `https://demo.docusign.net/clickapi/v1/accounts/${accountId}/clickwraps/${clickwrapId}/agreements/${agreementId}`,
                        {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
            
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
            
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error('Error fetching clickwrap agreement:', error);
                    throw error;
                }
            }

            let agreementData = await getClickwrapAgreement(clickWrapData.clickwrapId, clickWrapData.agreementId, authData.accessToken)


            if(!agreementData || agreementData.status !== 'agreed') {

                throw new Error('Clickwrap agreement not signed');
            }


            // Upload images
            const imageUrls = await uploadFiles(files);
            
            // Create drone record - using connect instead of direct userId assignment
            const regId = await generateUniqueRegistrationId(prisma);
            
            async function generateUniqueDroneId(prisma, maxAttempts = 10) {
                for (let i = 0; i < maxAttempts; i++) {
                    const state = user.stateCode
                    const serialNumber = formData.get('serialNumber')
                    const createdYear = new Date().getFullYear().toString().slice(-2);
                    const droneId = `DRN-${state.toUpperCase()}-${serialNumber.toUpperCase()}-${createdYear}`
    
    
                    const existing = await prisma.drone.findFirst({
                        where: { droneId: droneId }
                    });
                    
                    if (!existing) {
                        return droneId;
                    }
                }
                throw new Error('Failed to generate unique unique ID');
            }
            const droneUnId = await generateUniqueDroneId(prisma);
            
            const drone = await prisma.drone.create({
                data: {
                    nickname: formData.get('nickname'),
                    registrationId: regId,
                    droneId: droneUnId,
                    modelNumber: formData.get('modelNumber'),
                    serialNumber: formData.get('serialNumber'),
                    manufacturer: formData.get('manufacturer'),
                    registrationType: formData.get('registrationType'),
                    images: imageUrls,
                    user: {
                        connect: {
                            id: user.id
                        }
                    }
                },
                include: {
                    user: true
                }

            });

            const droneId = drone.id; // The newly created drone ID


            // Create envelope for embedded signing
            const returnUrl = `${request.headers.get('origin')}/dashboard/view-fleet/${droneId}`;

            // Generate and send DocuSign envelope
            const envelope = await docuSignService.createEnvelopeForEmbeddedSigning(
                drone,
                user.email,
                returnUrl
            );

            const signingUrl = await docuSignService.getEmbeddedSigningUrl(
                "user",
                envelope.envelopeId,
                user.email,
                returnUrl,
                1
            );

            const agreement = await prisma.agreement.create({
                data: {
                    clickWrapData: agreementData,
                    agreementType: 'drone-registration',
                    docusignEnvelopeId: envelope.envelopeId,
                    drone: {
                        connect: {
                            id: droneId
                        }
                    }
                }
            });

            redirectUrl = signingUrl;

        } catch (error) {
            console.error('Drone registration error:', error);
            return fail(500, {
                error: 'Failed to process drone registration'
            });
        }
        

        throw redirect(303,redirectUrl);

    }
};