import { fail, redirect, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { docuSignService } from '$lib/docusign/docusign.js';
import { env } from '$env/dynamic/private';
import { authenticate } from '$lib/docusign/selfAppAuth';

let NODE_ENV = env.NODE_ENV;
let DOCUSIGN_CLICK_API_BASE_PATH= env.DOCUSIGN_CLICK_API_BASE_PATH;
let DOCUSIGN_ACCOUNT_ID= env.DOCUSIGN_ACCOUNT_ID;
let DOCUSIGN_CLICKWRAP_ID= env.DOCUSIGN_CLICKWRAP_ID;
let DOCUSIGN_BASE = env.DOCUSIGN_BASE;

export async function GET({ request, locals }) {
    const session = await locals.getSession();
    if (!session) {
        throw redirect(303, '/login');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        const authData = await authenticate();
        
        const accountId = DOCUSIGN_ACCOUNT_ID;
        const accessToken = authData.accessToken
        let clickwrapId = DOCUSIGN_CLICKWRAP_ID;

        // // one time to get the clickwrap id from admin account
        // const clickwrapConfig = {
        //     name: "Drone Registration Terms",
        //     requireReacceptance: true,
        //     status: "active",
        //     documents: [{
        //         documentBase64: Buffer.from(`
        //             DRONE REGISTRATION TERMS AND CONDITIONS
        
        //             1. Registration Requirements
        //             - All drones weighing more than 250g must be registered
        //             - Operators must be 13 years or older
        //             - Registration is valid for 3 years
        
        //             2. Operating Rules
        //             - Maintain visual line of sight
        //             - Fly below 400 feet
        //             - Never fly near other aircraft or airports
        //             - Respect privacy and property rights
        
        //             3. Safety Requirements
        //             - Conduct pre-flight inspection
        //             - Check weather conditions
        //             - Maintain safe distance from people and property
        //             - Report any accidents
        
        //             4. Data Collection
        //             - Flight logs may be recorded
        //             - Registration information will be stored securely
        //             - Information may be shared with regulatory authorities
        
        //             5. Liability
        //             - Operators are responsible for any damages
        //             - Insurance is recommended
        //             - Violations may result in penalties
        
        //             By accepting these terms, you agree to comply with all applicable drone regulations and guidelines.
        //         `).toString('base64'),
        //         documentName: "Drone-Registration-Terms.txt",
        //         fileExtension: "txt",
        //         order: 1
        //     }],
        //     displaySettings: {
        //         displayName: "Drone Registration Terms",
        //         mustRead: true,
        //         requireAccept: true,
        //         format: "inline",
        //         documentDisplay: "document"
        //     }
        // };
            
        // const clickwrapResponse = await fetch(`${DOCUSIGN_CLICK_API_BASE_PATH}/v1/accounts/${accountId}/clickwraps`, {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${accessToken}`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(clickwrapConfig)
        // });
        // console.log(clickwrapResponse);

        // const clickwrapData = await clickwrapResponse.json();
        // clickwrapId = clickwrapData.clickwrapId;


        // Activate the clickwrap (if not already active)
        const activateResponse = await fetch(
            `${DOCUSIGN_CLICK_API_BASE_PATH}/v1/accounts/${accountId}/clickwraps/${clickwrapId}/versions/1`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: "active"
                })
            }
        );

        if (!activateResponse.ok) {
            throw new Error('Failed to activate clickwrap');
        }

        // Get agreement URL for the static clickwrap 
        const agreementResponse = await fetch(
            `${DOCUSIGN_CLICK_API_BASE_PATH}/v1/accounts/${accountId}/clickwraps/${clickwrapId}/agreements`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clientUserId: user.id.toString(),
                    agreementFields: {
                        emailAddress: user.email,
                        fullName: user.name || user.email
                    }
                })
            }
        );


        if (!agreementResponse.ok) {
            throw new Error('Failed to get agreement URL');
        }

        const {clientUserId}  = await agreementResponse.json();

        return json({ environment: DOCUSIGN_BASE, accountId, clickwrapId, clientUserId });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}

       
   


 // one time to create the clickwrap id from admin account
        // const clickwrapConfig = {
        //     name: "Drone Registration Terms",
        //     requireReacceptance: true,
        //     status: "active",
        //     documents: [{
        //         documentBase64: Buffer.from(`
        //             DRONE REGISTRATION TERMS AND CONDITIONS
        
        //             1. Registration Requirements
        //             - All drones weighing more than 250g must be registered
        //             - Operators must be 13 years or older
        //             - Registration is valid for 3 years
        
        //             2. Operating Rules
        //             - Maintain visual line of sight
        //             - Fly below 400 feet
        //             - Never fly near other aircraft or airports
        //             - Respect privacy and property rights
        
        //             3. Safety Requirements
        //             - Conduct pre-flight inspection
        //             - Check weather conditions
        //             - Maintain safe distance from people and property
        //             - Report any accidents
        
        //             4. Data Collection
        //             - Flight logs may be recorded
        //             - Registration information will be stored securely
        //             - Information may be shared with regulatory authorities
        
        //             5. Liability
        //             - Operators are responsible for any damages
        //             - Insurance is recommended
        //             - Violations may result in penalties
        
        //             By accepting these terms, you agree to comply with all applicable drone regulations and guidelines.
        //         `).toString('base64'),
        //         documentName: "drone-registration-terms.txt",
        //         fileExtension: "txt",
        //         order: 1
        //     }],
        //     displaySettings: {
        //         displayName: "Drone Registration Terms",
        //         mustRead: true,
        //         requireAccept: true,
        //         format: "inline",
        //         documentDisplay: "link"
        //     }
        // };
        
        // const response = await fetch(`${DOCUSIGN_CLICK_API_BASE_PATH}/v1/accounts/${accountId}/clickwraps`, {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${accessToken}`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(clickwrapConfig)
        // });
        // const responsedata = await response.json();
        // console.log(responsedata);
       
   

        
        // // Save this clickwrapId
        // const clickwrapId = await clickwrapResponse.json();
        // console.log('Use this ID in your code:', clickwrapId);
        // const clickwrapData = await clickwrapResponse.json();
        // const clickwrapId = clickwrapData.clickwrapId;

       // Activate the clickwrap (if not already active)
        // const activateResponse = await fetch(
        //     `${DOCUSIGN_CLICK_API_BASE_PATH}/v1/accounts/${accountId}/clickwraps/${clickwrapId}/versions/1`,
        //     {
        //         method: 'PUT',
        //         headers: {
        //             'Authorization': `Bearer ${accessToken}`,
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             status: "active"
        //         })
        //     }
        // );

        // if (!activateResponse.ok) {
        //     throw new Error('Failed to activate clickwrap');
        // }

        // // Verify the status
        // const statusResponse = await fetch(
        //     `${DOCUSIGN_CLICK_API_BASE_PATH}/v1/accounts/${accountId}/clickwraps/${clickwrapId}`,
        //     {
        //         headers: {
        //             'Authorization': `Bearer ${accessToken}`
        //         }
        //     }
        // );

        // const statusData = await statusResponse.json();
        // if (statusData.status !== 'active') {
        //     // console.log('statusData:', statusData);
        //     throw new Error('Clickwrap is not active');
        // }

        // console.log('Clickwrap is active and ready to use. ID:', clickwrapId);