import { error } from '@sveltejs/kit';
import crypto from 'crypto';
import { env } from '$env/dynamic/private';
import prisma from '$lib/prisma';
import { docuSignService } from '$lib/docusign/docusign.js';


export const POST = async ({ request, platform }) => {
    try {
        console.log('Webhook received: Starting processing');

        // Retrieve the raw body
        const rawBody = await request.text();
        // Get the first signature header
        const signatureHeader = request.headers.get('x-docusign-signature-1');
        // Your DocuSign webhook secret key from environment
        const webhookSecretKey = env.CONNECT_KEY;


        // Verify the webhook signature
        if (!verifyDocuSignSignature(rawBody, signatureHeader, webhookSecretKey)) {
            console.error('Signature verification failed');
            throw error(403, 'Unauthorized: Invalid signature');
        }

        // Parse the webhook payload
        const payload = JSON.parse(rawBody);
        console.log('Parsed payload:', payload);

        // Handle different DocuSign event types
        switch (payload.event) {
            case 'recipient-declined':
                await RDdeclined(payload);
                break;
            case 'recipient-completed':
                await RCompleted(payload);
                break;
            case 'recipient-sent':
                await RSent(payload);
                break;
            case 'envelope-completed':
                await EvCompleted(payload);
                break;
            default:
            console.log('Unhandled DocuSign event:', payload.event);
        }

        return new Response('Webhook received successfully', { status: 200 });
    } catch (err) {
        console.error('Webhook processing error:', err);
        throw error(500, 'Internal server error processing webhook');
    }
};

// Signature verification function
function verifyDocuSignSignature(rawBody, signatureHeader, secretKey) {

    if (!signatureHeader || !secretKey) {
        console.error('Missing signature header or secret key');
        return false;
    }

    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(rawBody);
    const computedSignature = hmac.digest('base64');

    return crypto.timingSafeEqual(
        Buffer.from(signatureHeader),
        Buffer.from(computedSignature)
    );
}

async function RDdeclined(payload) {
    let { recipientId, envelopeId } = payload.data
    let envelopeStatus = await docuSignService.getEnvelopeStatus(envelopeId) 
 
    let signers = envelopeStatus.recipients.signers

    let users = await Promise.all(signers.map(async signer => {
        return await prisma.user.findUnique({ where: { email: signer.email } });
    }));


    let signer = signers.find(signer => signer.recipientId === recipientId)
    let userSigned = await prisma.user.findUnique({ where: { email: signer.email } })
 

    let drone = await prisma.agreement.findFirst({ where: { docusignEnvelopeId: envelopeId } })


    if(userSigned.isSuperUser){

        const notification = {
            user:"Drone Management Authority has declined the document." ,
            admin:"You have declined the document."
        }
        

        await Promise.all(users.map(async user => {

            let newNotification = {
                event: 'document declined',
                message: user.isSuperUser ? notification.admin : notification.user,
                read: false,
                droneId: drone.droneId
            }


            return await prisma.user.update({
                where: { id: user.id },
                data: {
                    notifications: [...user.notifications || [], newNotification]
                }
            });
        }));
    }else{
        const notification = {
            user:"You have declined the document." ,
            admin:"User has declined the document."
        }
        

        await Promise.all(users.map(async user => {

            let newNotification = {
                event: 'document declined',
                message: user.isSuperUser ? notification.admin : notification.user,
                read: false,
                droneId: drone.droneId
            }


            return await prisma.user.update({
                where: { id: user.id },
                data: {
                    notifications: [...user.notifications || [], newNotification]
                }
            });
        }));
    }
}

async function RCompleted(payload) {
    let { recipientId, envelopeId } = payload.data
    let envelopeStatus = await docuSignService.getEnvelopeStatus(envelopeId) 
 
    let signer = envelopeStatus.recipients.signers.find(signer => signer.recipientId === recipientId)
    let user = await prisma.user.findUnique({ where: { email: signer.email } })
 

    let drone = await prisma.agreement.findFirst({ where: { docusignEnvelopeId: envelopeId } })

    const notification = user.isSuperUser 
        ? "Document signed successfully" 
        : "You have completed. Please wait for drone management authority.";
    

    let newNotification = {
        event: 'document signed',
        message: notification,
        read: false,
        droneId: drone.droneId
    }

    let prevNotification = user.notifications || [];


    await prisma.user.update({
        where: { id: user.id },
        data: {
            notifications: [...prevNotification, newNotification]
        }
    });
}

async function RSent(payload) {
    let { recipientId, envelopeId } = payload.data
    let envelopeStatus = await docuSignService.getEnvelopeStatus(envelopeId) 
 
    let signer = envelopeStatus.recipients.signers.find(signer => signer.recipientId === recipientId)
    
    if (recipientId != 1) {
        let user = await prisma.user.findUnique({ where: { email: signer.email } })
     
    
        let drone = await prisma.agreement.findFirst({ where: { docusignEnvelopeId: envelopeId } })
    
        let newNotification = {
            event: 'document received',
            message: "New document received. Please sign the document.",
            read: false,
            droneId: drone.droneId
        }
    
        await prisma.user.update({
            where: { id: user.id },
            data: {
                notifications: [...user.notifications || [], newNotification]
            }
        });
    }
}

async function EvCompleted(payload) {
    let { recipientId, envelopeId } = payload.data
    let envelopeStatus = await docuSignService.getEnvelopeStatus(envelopeId) 
 
    let signers = envelopeStatus.recipients.signers

    // let user = await prisma.user.findUnique({ where: { email: signer.email } })
    let users = await Promise.all(signers.map(async signer => {
        return await prisma.user.findUnique({ where: { email: signer.email } });
    }));

    let drone = await prisma.agreement.findFirst({ where: { docusignEnvelopeId: envelopeId } })

    const notification = "Drone registration completed successfully";
    

    let newNotification = {
        event: 'document completed',
        message: notification,
        read: false,
        droneId: drone.droneId
    }

    await Promise.all(users.map(async user => {
        return await prisma.user.update({
            where: { id: user.id },
            data: {
                notifications: [...user.notifications || [], newNotification]
            }
        });
    }));
    
}