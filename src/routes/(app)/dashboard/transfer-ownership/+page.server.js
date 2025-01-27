import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { docuSignService } from '$lib/docusign/docusign.js';


export async function load({ parent }) {
    let {user} = await parent();

    const userData = await prisma.user.findUnique({
        where: {
            email: user.email
        },
        include: {
            Drone: true
        } 
    });

    console.log('userData:', userData);

    const drones = userData.Drone

    let activeDrones = [drones.filter(drone => drone.signatureStatus === 'registered' ||  drone.signatureStatus === 'transferred'), drones.filter(drone => drone.signatureStatus === 'registered'  ||  drone.signatureStatus === 'transferred').length];

    return {
        activeDrones
    }
}

export const actions = {

    default: async ({ request, locals }) => {
        const session = await locals.getSession();
        if (!session) {
            throw redirect(303, '/login');
        }

        // First get the user from database using email
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });

        const formData = await request.formData();

        const droneId = formData.get('droneId');
        const newOwnerEmail = formData.get('email');
        
        const newOwner = await prisma.user.findUnique({
            where: {
                email: newOwnerEmail
            }
        });

        if (!newOwner) {
            return fail(400, {
                error: 'User doesnt exist with this email, please ask them to register first'
            });
        }

        if(newOwner.id === user.id){
            return fail(400, {
                error: 'You cannot transfer ownership to yourself'
            });
        }

        const drone = await prisma.drone.findUnique({
            where: {
                id: droneId
            },
            include: {
                user: true
            }
        });

       

        let redirectUrl;
        try {
            // Create envelope for embedded signing
            const returnUrl = `${request.headers.get('origin')}/dashboard/view-fleet/${droneId}`;

            // console.log('returnUrl:', returnUrl);

            // Create envelope for embedded signing
            const envelope = await docuSignService.createEnvelopeForEmbeddedSigningForTransferOwnership(
                drone,
                user.email,
                returnUrl,
                newOwner
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
                    agreementType: 'drone-transfer',
                    docusignEnvelopeId: envelope.envelopeId,
                    drone: {
                        connect: {
                            id: droneId
                        }
                    }
                }
            });

            await prisma.drone.update({ 
                where: { id: droneId }, 
                data: { 
                    signatureStatus: 'transferring', 
                    futureOwnerId: newOwner.id 
                } 
            });
          
            

            redirectUrl = signingUrl;

        } catch (error) {
            console.error('Drone Transfer error:', error);
            return fail(500, {
                error: 'Failed to process drone Transfer'
            });
        }
        

        throw redirect(303,redirectUrl);

    }
};