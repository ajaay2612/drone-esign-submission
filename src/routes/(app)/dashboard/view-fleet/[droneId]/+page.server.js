import prisma from '$lib/prisma.js';
import { docuSignService } from '$lib/docusign/docusign.js';
import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

let PUBLIC_DOMAIN = env.PUBLIC_DOMAIN;

export const load = async ({ params, url , parent}) => {
    const event = url.searchParams.get('event');
    const { droneId } = params;
    const {user} = await parent();
    const adminUser = await prisma.user.findFirst({
        where: { isSuperUser: true }
    });

    let currenUser = await prisma.user.findUnique({
        where: { email: user.email }
    });

    // Get the envelope status
    let drone = await prisma.drone.findUnique({
        where: { id: droneId },
        include: { user: true, Agreement: true }
    });

    if(drone.user.email !== user.email){ 
        if(drone.futureOwnerId !== currenUser.id){ 

            const transfered = await prisma.previousOwnership.findFirst({
                where: {
                    userId: currenUser.id,
                    droneId: drone.id
                }
            });
            
            if(transfered === null){ 
                throw error(403, 'You are not authorized to view this page');
            }
        }
    }
    
    if (!drone) {
        throw error(404, 'Drone not found');
    }
    
    if (!drone.Agreement.length > 0) {
        throw error(404, 'Drone has no registered agreements');
    }


    try {
        
        // Update drone status based on envelope status -- webhook se kar lenge
        // await prisma.drone.update({ 
        //     where: { id: droneId },
        //     data: { 
        //         signatureStatus: envelopeStatus.status,
        //     }
        // });
        
        const envelopeStatuses = await Promise.all(
            drone.Agreement.map(async (agreement) => {
                const status = await docuSignService.getEnvelopeStatus(
                    agreement.docusignEnvelopeId,
                    currenUser.email
                );

                // Check if there's any transfer agreement present
                const hasTransferAgreement = drone.Agreement.some(
                    agr => agr.agreementType === 'drone-transfer'
                );

                if (agreement.agreementType === 'drone-registration' && !hasTransferAgreement) {
                    if (status.status === 'completed') {
                        await prisma.drone.update({ 
                            where: { id: droneId },
                            data: { 
                                signatureStatus: status.status === 'completed' ? 'registered' : status.status === 'declined' ? 'declined' : 'pending',
                            }
                        });
                    }

                    if(status.status === "declined"){
                        await prisma.drone.update({ 
                            where: { id: droneId },
                            data: { 
                                droneId: null,
                            },
                            include: { user: true }
                        });
                    }
                }

                if (agreement.agreementType === 'drone-transfer') {
                    await prisma.drone.update({ 
                        where: { id: droneId },
                        data: { 
                            signatureStatus: status.status === 'completed' ? 'transfered' : status.status === 'declined' ? 'declined' : 'transfering',
                        }
                    });
                    if(status.status === "completed"){
                        // Transfer Completion

                        if (drone.futureOwnerId) {
                            await prisma.drone.update({
                                where: { id: droneId },
                                data: {
                                    userId: drone.futureOwnerId,
                                    futureOwnerId: null,
                                    signatureStatus: 'transferred',
                                    previousOwners: {
                                        create: {
                                            userId: drone.user.id,
                                            ownedAt: new Date()
                                        }
                                    }
                                }
                            });
                        }else{
                            await prisma.drone.update({
                                where: { id: droneId },
                                data: {
                                    signatureStatus: 'transferred'
                                }
                            });
                        }
                    }
                    if(status.status === "declined"){
                        await prisma.drone.update({ 
                            where: { id: droneId },
                            data: { 
                                futureOwnerId: null,
                            },
                            include: { user: true }
                        });
                    }
                }

                let envelopeDocumentDownloadUrl = null;
                if (status.status === 'completed') {
                    try {
                        envelopeDocumentDownloadUrl = await docuSignService.getEnvelopeDocumentDownloadUrl(agreement.docusignEnvelopeId,currenUser.email);
                    } catch (error) {
                        console.error('Error fetching envelope document url:', error);
                    }   
                }

                const qrCodeUrl = PUBLIC_DOMAIN+"/view?droneId="+droneId;

                drone = await prisma.drone.findUnique({
                    where: { id: droneId },
                    include: { user: true, Agreement: true }
                });

                return {
                    agreementId: agreement.id,
                    agreementData: {
                        status: status.status,
                        recipients: status.recipients,
                        currentRecipient: status.recipients?.signers?.find(
                            signer => signer.status !== 'completed'
                        ),
                        completedRecipients: status.recipients?.signers?.filter(
                            signer => signer.status === 'completed'
                        ),
                        expireDateTime: status.expireDateTime,
                        signed : status.recipients?.signers?.some(
                            signer => signer.email === user.email && signer.status === 'completed'
                        ),
                        canSign : status.recipients?.signers?.some(
                            signer => signer.email === user.email && signer.status !== 'completed'
                        ),
                        declined: {
                            status : status.recipients?.signers?.some(
                                signer => signer.status === 'declined'
                            ),
                            message: (() => {
                                const signers = status.recipients?.signers || [];
                                const declinedSigners = signers.filter(signer => signer.status === 'declined');
                                
                                if (declinedSigners.length === 0) return null;
                                
                                const userDeclined = declinedSigners.some(signer => signer.email === drone.user.email);
                                const adminDeclined = declinedSigners.some(signer => signer.email === adminUser.email);
                                
                                if (userDeclined && adminDeclined) return 'Both user and admin have declined';
                                if (userDeclined) return 'You have declined to sign';
                                if (adminDeclined) return 'Admin has declined to sign';
                                return null;
                            })()
                        },
                        envelopeDocumentDownloadUrl,
                        qrCodeUrl,
                        droneId: droneId,
                    }
                };
            })
        );
    
        // console.log('envelopeStatuses:', envelopeStatuses);
        drone = await prisma.drone.findUnique({
            where: { id: droneId },
            include: { user: true, Agreement: true }
        });

        return {
            envelopeStatuses,
            "drone":{
                nickname : drone.nickname,
                registrationId : drone.registrationId,
                droneId : drone.droneId,
                modelNumber : drone.modelNumber,
                createdAt : drone.createdAt,
                userName: drone.user.firstName + " " + drone.user.lastName,
                userEmail: drone.user.email,
                images: drone.images,
                active: drone.active,
            },
        };
    } catch (e) {
        console.error('Error fetching envelope status:', e);
        throw error(500, 'Failed to fetch signature status');
    }
    
 
};



export const actions = {
    default: async ({ request, locals }) => {
        const session = await locals.getSession();
        if (!session) {
            throw redirect(303, '/login');
        }

        // Verify user status
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            }
        });

        const formData = await request.formData();
        const agreementId = formData.get('agreementId');

        let signingUrl = null;
        try {
            // Get the drone with its agreements
            const agreement = await prisma.agreement.findUnique({
                where: { id: agreementId },
                include: { drone: true }
            });

            const aggrementDrone = await prisma.drone.findUnique({
                where: { id: agreement.drone.id },
                include: { user: true }
            });

            if (!agreement) {
                return fail(404, {
                    error: 'Agreement not found'
                });
            }
            
            // Get the return URL for after signing
            const returnUrl = `${request.headers.get('origin')}/dashboard/view-fleet/${agreement.drone.id}`;

            // console.log('agreement:', aggrementDrone.user.email);
            if (agreement.agreementType === 'drone-transfer')  {
                if (aggrementDrone.user.email === user.email) {
                    signingUrl = await docuSignService.getEmbeddedSigningUrl(
                        "user",
                        agreement.docusignEnvelopeId,
                        user.email,
                        returnUrl,
                        1
                    );
                }else{

                    // let secUser = {
                    //     id: aggrementDrone.user.id,
                    //     email: aggrementDrone.user.email,
                    //     name: aggrementDrone.user.firstName + " " + aggrementDrone.user.lastName
                    // }

                    signingUrl = await docuSignService.getEmbeddedSigningUrl(
                        "secUser",
                        agreement.docusignEnvelopeId,
                        user.email,
                        returnUrl,
                        2,
                        // secUser

                    );
                }
            }else{
                signingUrl = await docuSignService.getEmbeddedSigningUrl(
                    "user",
                    agreement.docusignEnvelopeId,
                    user.email,
                    returnUrl,
                    1
                );
        
            }

        } catch (error) {
            console.error('user signing error:', error);
            return fail(500, {
                error: 'Failed to process user signing request'
            });
        }

        throw redirect(303, signingUrl);

    }
};