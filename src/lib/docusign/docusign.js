import docusign from 'docusign-esign';
import { readFileSync } from 'fs';
import path from 'path';
import prisma from '$lib/prisma';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import axios from 'axios';
import { authenticate } from '$lib/docusign/selfAppAuth';
import Doc from '$lib/documents/doc.svelte';
import TransferDoc from '$lib/documents/transferDoc.svelte';
import { render } from 'svelte/server';
import fs from 'fs';
import puppeteer from 'puppeteer';

const domain = publicEnv.PUBLIC_DOMAIN;
const DOCUSIGN_BASE_PATH = env.DOCUSIGN_BASE_PATH;
const DOCUSIGN_ACCOUNT_ID = env.DOCUSIGN_ACCOUNT_ID;
const WORKFLOW_ID = env.WORKFLOW_ID;

async function encodeImageFromUrl(imageUrl) {
    let combinedUrl = domain + imageUrl;

    try {
        const response = await axios.get(combinedUrl, { responseType: 'arraybuffer' });
        const mimeType = response.headers['content-type'];
        const base64Image = Buffer.from(response.data).toString('base64');
        return `data:${mimeType};base64,${base64Image}`;
    } catch (error) {
        console.error(`Error fetching image from URL: ${combinedUrl}`, error);
        return '';
    }
}

export class DocuSignService {
    constructor() {
        this.apiClient = new docusign.ApiClient({
            basePath: DOCUSIGN_BASE_PATH
        });
    }

    async initializeWithUser(userEmail) {

        if (userEmail) {
            this.user = await prisma.user.findUnique({
                where: { email: userEmail },
            });
        }

        this.adminUser = await prisma.user.findFirst({
            where: { isSuperUser: true },
        });

        // if (!user?.docusignAccessToken || !user?.docusignAccountId) {
        //     throw new Error('User does not have DocuSign access');
        // }
        const authData = await authenticate();

        this.accessToken = authData.accessToken;
        this.apiClient.addDefaultHeader('Authorization', `Bearer ${authData.accessToken}`);
        this.envelopesApi = new docusign.EnvelopesApi(this.apiClient);
    }

    // Previous generateDroneDocument method remains the same

    async generateDroneDocument(Doc,drone, page=0, newOwner) {
        // Convert images to base64 (assuming `drone.images` contains URLs or paths)
        const imageTags = await Promise.all(
            drone.images.map(async (imageObj, index) => {
                // Extract the image URL based on the key of each object
                const imageUrl = Object.values(imageObj)[0];
                const base64Image = await encodeImageFromUrl(imageUrl);
              
                // Extract the image type (key) to include in the alt text
                const imageType = Object.keys(imageObj)[0];
                return {src: `${base64Image}`, name: `${imageType.replace('_', ' ').toUpperCase()} Image ${index + 1}:`}
   
            })
        )


        let body, head

        if (newOwner) {
            let htmlData = render(Doc,{ props: { drone, page, "droneImages":imageTags, newOwner } });
            
            body = htmlData.body;
            head = htmlData.head;
        }else{
            let htmlData = render(Doc,{ props: { drone, page, "droneImages":imageTags } });
            body = htmlData.body;
            head = htmlData.head;
        }
        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                <meta charset="UTF-8">
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">
                    <style>
                                        
                        *,
                        ::after,
                        ::before,
                        ::backdrop,
                        ::file-selector-button,
                        body {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        border: 0 solid;
                        }
                    </style>
                    ${head}
                </head>
            <body>
                ${body}
            </body>
            </html>
        `;  

        // console.log(htmlContent);
        async function generatePDFfromHTML(htmlContent) {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(htmlContent);
            
            // Create a temporary file path
            const tempPdfPath = path.join(process.cwd(),`./temp_${Date.now()}.pdf`);
            
            // Save PDF to temporary file
            await page.pdf({ 
                path: tempPdfPath, 
                format: 'A4',
                scale: 1.32,
                printBackground: true, 
                preferCSSPageSize: true,
                displayHeaderFooter: false,
                margin: { top: 0, right: 0, bottom: 0, left: 0 }
            });
            
            await browser.close();
        
            // Read the file and convert to Base64
            const pdfBuffer = fs.readFileSync(tempPdfPath);
            const pdfBase64 = pdfBuffer.toString('base64');
        
            // Optional: Remove the temporary file
            fs.unlinkSync(tempPdfPath);
        
            return pdfBase64;
        }
            
        let pdfFile = await generatePDFfromHTML(htmlContent)
            

        return pdfFile;
    }

    async createEnvelopeForEmbeddedSigning(drone, signerEmail, returnUrl) {
        const documentBase64 = await this.generateDroneDocument(Doc, drone);
        const documentBase64_1 = await this.generateDroneDocument(Doc, drone, 1);
        const documentBase64_2 = await this.generateDroneDocument(Doc, drone, 2);
        await this.initializeWithUser(signerEmail);


        const workflowId = WORKFLOW_ID;
        const phoneNumber = drone.user.phoneNumber; // Ensure this is extracted
        const countryAreaCode = drone.user.countryCode // Default to US if not specified

        const identityVerification = new docusign.RecipientIdentityVerification();
        identityVerification.workflowId = workflowId;
        identityVerification.inputOptions = [
            {
                name: 'phone_number_list',
                valueType: 'PhoneNumberList',
                phoneNumberList: [
                    {
                        number: phoneNumber,
                        countryCode: countryAreaCode
                    }
                ]
            }
        ];

        // Create envelope definition
        const envelopeDefinition = new docusign.EnvelopeDefinition();
        envelopeDefinition.emailSubject = `Drone Registration - ${drone.nickname}`;
        envelopeDefinition.brandId = env.BRAND_ID; // If you have a custom brand set up

        // Create document
        const document = new docusign.Document();
        document.documentBase64 = documentBase64;
        document.fileExtension = 'html';
        document.documentId = '1';
        document.name = 'Drone Registration Form';

        const document2 = new docusign.Document();
        document2.documentBase64 = documentBase64_1;
        document2.fileExtension = 'html';
        document2.documentId = '2';
        document2.name = 'Drone Images';

        const document3 = new docusign.Document();
        document3.documentBase64 = documentBase64_2;
        document3.fileExtension = 'html';
        document3.documentId = '3';
        document3.name = 'Signatures';



        // Create signer with clientUserId for embedded signing
        const signer = new docusign.Signer();
        signer.email = this.user.email;
        signer.name = this.user.firstName + ' ' + this.user.lastName;
        signer.recipientId = '1';
        signer.routingOrder = '1';
        signer.clientUserId = this.user.id.toString();        
        signer.identityVerification = identityVerification;

        
        // Create admin signer
        const adminSigner = new docusign.Signer();
        adminSigner.email = this.adminUser.email;
        adminSigner.name = `${this.adminUser.firstName} ${this.adminUser.lastName}`;
        adminSigner.recipientId = '2';
        adminSigner.routingOrder = '2';
        adminSigner.clientUserId = this.adminUser.id.toString();

        // Create tabs (same as before)
        const signHere = new docusign.SignHere();
        signHere.anchorString = 'signer1sig';
        signHere.anchorUnits = 'pixels';
        signHere.anchorXOffset = '0';
        signHere.anchorYOffset = '0';

        const dateSign = new docusign.DateSigned();
        dateSign.anchorString = 'signer1date';
        dateSign.anchorUnits = 'pixels';
        dateSign.anchorXOffset = '0';
        dateSign.anchorYOffset = '0';

        const signHere2 = new docusign.SignHere();
        signHere2.anchorString = 'signer2sig';
        signHere2.anchorUnits = 'pixels';
        signHere2.anchorXOffset = '0';
        signHere2.anchorYOffset = '0';

        const dateSign2 = new docusign.DateSigned();
        dateSign2.anchorString = 'signer2date';
        dateSign2.anchorUnits = 'pixels';
        dateSign2.anchorXOffset = '0';
        dateSign2.anchorYOffset = '0';

        // Add tabs to signers
        const signerTabs = new docusign.Tabs();
        signerTabs.signHereTabs = [signHere];
        signerTabs.dateSignedTabs = [dateSign];
        signer.tabs = signerTabs;

        const adminTabs = new docusign.Tabs();
        adminTabs.signHereTabs = [signHere2];
        adminTabs.dateSignedTabs = [dateSign2];
        adminSigner.tabs = adminTabs;

        // Add documents and recipients to envelope
        envelopeDefinition.documents = [document,document2,document3];
        envelopeDefinition.recipients = new docusign.Recipients();
        envelopeDefinition.recipients.signers = [signer, adminSigner];
        envelopeDefinition.status = 'sent';

        try {
            const envelope = await this.envelopesApi.createEnvelope(DOCUSIGN_ACCOUNT_ID, {
                envelopeDefinition
            });
            return envelope;
        } catch (error) {
            console.error('DocuSign createEnvelope error:', error);
            throw error;
        }
    }

    // transfer Ownership docs
    async createEnvelopeForEmbeddedSigningForTransferOwnership(drone, signerEmail, returnUrl, newOwner) {
        const documentBase64 = await this.generateDroneDocument(TransferDoc, drone, 0, newOwner);
        const documentBase64_1 = await this.generateDroneDocument(TransferDoc, drone, 1, newOwner);
        const documentBase64_2 = await this.generateDroneDocument(TransferDoc, drone, 2, newOwner);
        const documentBase64_3 = await this.generateDroneDocument(TransferDoc, drone, 3, newOwner);
        await this.initializeWithUser(signerEmail);


        const workflowId = WORKFLOW_ID;
        const phoneNumber = drone.user.phoneNumber; // Ensure this is extracted
        const countryAreaCode = drone.user.countryCode // Default to US if not specified

        const identityVerification = new docusign.RecipientIdentityVerification();
        identityVerification.workflowId = workflowId;
        identityVerification.inputOptions = [
            {
                name: 'phone_number_list',
                valueType: 'PhoneNumberList',
                phoneNumberList: [
                    {
                        number: phoneNumber,
                        countryCode: countryAreaCode
                    }
                ]
            }
        ];

        // newowner
        const identityVerification3 = new docusign.RecipientIdentityVerification();
        identityVerification3.workflowId = workflowId;
        identityVerification3.inputOptions = [
            {
                name: 'phone_number_list',
                valueType: 'PhoneNumberList',
                phoneNumberList: [
                    {
                        number: newOwner.phoneNumber,
                        countryCode: newOwner.countryCode
                    }
                ]
            }
        ];
        
        // Create envelope definition
        const envelopeDefinition = new docusign.EnvelopeDefinition();
        envelopeDefinition.emailSubject = `Drone Registration - ${drone.nickname}`;
        envelopeDefinition.brandId = env.BRAND_ID; // If you have a custom brand set up

        // Create document
        const document = new docusign.Document();
        document.documentBase64 = documentBase64;
        document.fileExtension = 'html';
        document.documentId = '1';
        document.name = 'Drone Registration Form';

        const document2 = new docusign.Document();
        document2.documentBase64 = documentBase64_1;
        document2.fileExtension = 'html';
        document2.documentId = '2';
        document2.name = 'Drone Images';

        const document3 = new docusign.Document();
        document3.documentBase64 = documentBase64_2;
        document3.fileExtension = 'html';
        document3.documentId = '3';
        document3.name = 'details';
        
        const document4 = new docusign.Document();
        document4.documentBase64 = documentBase64_3;
        document4.fileExtension = 'html';
        document4.documentId = '4';
        document4.name = 'Signatures';


        // Create signer with clientUserId for embedded signing
        const signer = new docusign.Signer();
        signer.email = this.user.email;
        signer.name = this.user.firstName + ' ' + this.user.lastName;
        signer.recipientId = '1';
        signer.routingOrder = '1';
        signer.clientUserId = this.user.id.toString();        
        signer.identityVerification = identityVerification;
        
        // Create newOwner signer with clientUserId for embedded signing
        const signer3 = new docusign.Signer();
        signer3.email = newOwner.email;
        signer3.name = newOwner.firstName + ' ' + newOwner.lastName;
        signer3.recipientId = '2';
        signer3.routingOrder = '2';
        signer3.clientUserId = newOwner.id.toString();        
        signer3.identityVerification = identityVerification3;
        
        // Create admin signer
        const adminSigner = new docusign.Signer();
        adminSigner.email = this.adminUser.email;
        adminSigner.name = `${this.adminUser.firstName} ${this.adminUser.lastName}`;
        adminSigner.recipientId = '3';
        adminSigner.routingOrder = '3';
        adminSigner.clientUserId = this.adminUser.id.toString();

        // Create tabs (same as before)
        const signHere = new docusign.SignHere();
        signHere.anchorString = 'signer1sig';
        signHere.anchorUnits = 'pixels';
        signHere.anchorXOffset = '0';
        signHere.anchorYOffset = '0';

        const dateSign = new docusign.DateSigned();
        dateSign.anchorString = 'signer1date';
        dateSign.anchorUnits = 'pixels';
        dateSign.anchorXOffset = '0';
        dateSign.anchorYOffset = '0';


        // new owner
        const signHere3 = new docusign.SignHere();
        signHere3.anchorString = 'signer3sig';
        signHere3.anchorUnits = 'pixels';
        signHere3.anchorXOffset = '0';
        signHere3.anchorYOffset = '0';

        const dateSign3 = new docusign.DateSigned();
        dateSign3.anchorString = 'signer3date';
        dateSign3.anchorUnits = 'pixels';
        dateSign3.anchorXOffset = '0';
        dateSign3.anchorYOffset = '0';


        const signHere2 = new docusign.SignHere();
        signHere2.anchorString = 'signer2sig';
        signHere2.anchorUnits = 'pixels';
        signHere2.anchorXOffset = '0';
        signHere2.anchorYOffset = '0';

        const dateSign2 = new docusign.DateSigned();
        dateSign2.anchorString = 'signer2date';
        dateSign2.anchorUnits = 'pixels';
        dateSign2.anchorXOffset = '0';
        dateSign2.anchorYOffset = '0';

        // Add tabs to signers
        const signerTabs = new docusign.Tabs();
        signerTabs.signHereTabs = [signHere];
        signerTabs.dateSignedTabs = [dateSign];
        signer.tabs = signerTabs;

        const signerTabs3 = new docusign.Tabs();
        signerTabs3.signHereTabs = [signHere3];
        signerTabs3.dateSignedTabs = [dateSign3];
        signer3.tabs = signerTabs3;

        const adminTabs = new docusign.Tabs();
        adminTabs.signHereTabs = [signHere2];
        adminTabs.dateSignedTabs = [dateSign2];
        adminSigner.tabs = adminTabs;

        // Add documents and recipients to envelope
        envelopeDefinition.documents = [document,document2,document3,document4];
        envelopeDefinition.recipients = new docusign.Recipients();
        envelopeDefinition.recipients.signers = [signer,signer3, adminSigner];
        envelopeDefinition.status = 'sent';

        try {
            const envelope = await this.envelopesApi.createEnvelope(DOCUSIGN_ACCOUNT_ID, {
                envelopeDefinition
            });
            return envelope;
        } catch (error) {
            console.error('DocuSign createEnvelope error:', error);
            throw error;
        }
    }

    async getEmbeddedSigningUrl(type, envelopeId, signerEmail,returnUrl,recipientId, secUser) {
        await this.initializeWithUser(signerEmail);

        // Create recipient view request
        const recipientView = new docusign.RecipientViewRequest();
        recipientView.authenticationMethod = 'none';
        recipientView.recipientId = recipientId;

        
        if (type=="admin") {
            recipientView.clientUserId = this.adminUser.id.toString();
            recipientView.returnUrl = returnUrl;
            recipientView.userName = `${this.adminUser.firstName} ${this.adminUser.lastName}`;
            recipientView.email = this.adminUser.email;
        }else{
            recipientView.clientUserId = this.user.id.toString();
            recipientView.returnUrl = returnUrl;
            recipientView.userName = `${this.user.firstName} ${this.user.lastName}`;
            recipientView.email = this.user.email;
        }

        try {
            const viewResult = await this.envelopesApi.createRecipientView(DOCUSIGN_ACCOUNT_ID, envelopeId, {
                recipientViewRequest: recipientView
            });
            return viewResult.url;
        } catch (error) {
            console.error('DocuSign createRecipientView error:', error);
            throw error;
        }
    }

    async getEnvelopeStatus(envelopeId, userEmail) {
        try {
            await this.initializeWithUser(userEmail);
            
            const envelope = await this.envelopesApi.getEnvelope(DOCUSIGN_ACCOUNT_ID, envelopeId);
            const recipients = await this.envelopesApi.listRecipients(DOCUSIGN_ACCOUNT_ID, envelopeId);
            return {
                status: envelope.status,
                envelopeId: envelope.envelopeId,
                createdDateTime: envelope.createdDateTime,
                lastModifiedDateTime: envelope.lastModifiedDateTime,
                sentDateTime: envelope.sentDateTime,
                completedDateTime: envelope.completedDateTime,
                expireDateTime: envelope.expireDateTime, // Added this line
                recipients: {
                    signers: recipients.signers.map(signer => ({
                        email: signer.email,
                        name: signer.name,
                        status: signer.status,
                        recipientId: signer.recipientId,
                        routingOrder: signer.routingOrder,
                        signedDateTime: signer.signedDateTime
                    }))
                }
            };
        } catch (error) {
            console.error('DocuSign getEnvelopeStatus error:', error);
            throw error;
        }
    }

    async getEnvelopeDocumentDownloadUrl(envelopeId, userEmail) {
        try {
            await this.initializeWithUser(userEmail);

            const documentInfo = await this.envelopesApi.getDocument(
                DOCUSIGN_ACCOUNT_ID,
                envelopeId,
                'combined'
            );
          
            const base64Pdf = documentInfo.toString('base64');
            const downloadLink = `data:application/pdf;base64,${base64Pdf}`;

            return downloadLink;

        } catch (error) {
            console.error('DocuSign document download error:', error);
            throw new Error('Unable to retrieve document download URL');
        }
    }
}

export const docuSignService = new DocuSignService();