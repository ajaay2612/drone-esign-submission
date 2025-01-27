
import Doc from '$lib/documents/transferDoc.svelte';
import { render } from 'svelte/server';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';



export async function load({ request, locals, url }) {


    const {body, head} = render(Doc,{ props: { message: 'hello' }});

    const htmlContent = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content=
                "width=device-width, initial-scale=1.0">
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

                        body{
                        width: 100%;
                        height: 100%;
                        }
                </style>
                ${head.replace(/<!--.*?-->/g, '').trim()}
            </head>
        <body>
            ${body.replace(/<!--\[-->|<!--]\-->/g, '').replace(/<!--\[!-->/g, '').trim()}
        </body>
        </html>
    `;  
    // console.log(htmlContent)
    // console.log()
    // let buffer = Buffer.from(htmlContent).toString('base64');

   
    async function generatePDFfromHTML(htmlContent) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        
        // Create a temporary file path
        const tempPdfPath = path.join(process.cwd(),`./temp.pdf`);
        
        // Save PDF to temporary file
        await page.pdf({ 
            path: tempPdfPath, 
            format: 'A4' ,
            scale: 1.32,
            printBackground: true,  // Critical for preserving background and text colors
            preferCSSPageSize: true,
            displayHeaderFooter: false,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });
        
        await browser.close();
    
        // Read the file and convert to Base64
        const pdfBuffer = fs.readFileSync(tempPdfPath);
        const pdfBase64 = pdfBuffer.toString('base64');
    
        // Optional: Remove the temporary file
        // fs.unlinkSync(tempPdfPath);
    
        return pdfBase64;
    }
    
    let pdfFile 
    // Usage
    generatePDFfromHTML(htmlContent)
        .then(base64PDF => {
            // console.log('PDF Base64:', base64PDF);
            pdfFile = base64PDF
        })
        .catch(error => {
            console.error('PDF generation error:', error);
        });

    return {
        html:htmlContent,
        // pdfFile
    };

}
