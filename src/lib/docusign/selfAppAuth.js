import docusign from 'docusign-esign';
import fs from 'fs';
import { env } from '$env/dynamic/private';

const SCOPES = ['signature', 'impersonation','click.manage', 'click.send'];

export async function authenticate() {
    const jwtLifeSec = 10 * 60; // 10 minutes
    const dsApi = new docusign.ApiClient();
    
    // Set OAuth base path from environment variable
    dsApi.setOAuthBasePath(env.DOCUSIGN_USER_INFO_URL.replace('https://', ''));
    
    // Read private key
    const rsaKey = fs.readFileSync(env.DOCUSIGN_PRIVATE_KEY_PATH);


    // async function getConsentUrl() {
    //     console.log("DOCUSIGN_REDIRECT_URI-------------------------------------------------",env.DOCUSIGN_REDIRECT_URI);
    //     const redirectUri = encodeURIComponent(env.DOCUSIGN_REDIRECT_URI);
    //     const clientId = env.DOCUSIGN_CLIENT_ID;
    //     const scopes = SCOPES.join('%20');

    //     const consentUrl = `https://account-d.docusign.com/oauth/auth?response_type=code&scope=${scopes}&client_id=${clientId}&redirect_uri=${redirectUri}`;

    //     console.log("consentUrl",consentUrl);
    //     return consentUrl;
    // }
    // getConsentUrl()

    try {
        // Request JWT token
        const results = await dsApi.requestJWTUserToken(
            env.DOCUSIGN_CLIENT_ID,
            env.DOCUSIGN_IMPERSONATED_USER_ID,
            SCOPES,
            rsaKey,
            jwtLifeSec
        );

        const accessToken = results.body.access_token;

        // Get user info
        const userInfoResults = await dsApi.getUserInfo(accessToken);

        // Find default account
        const userInfo = userInfoResults.accounts.find(account =>
            account.isDefault === 'true'
        );

        if (!userInfo) {
            throw new Error('No default DocuSign account found');
        }

        return {
            accessToken: accessToken,
            apiAccountId: userInfo.accountId,
            basePath: `${userInfo.baseUri}/restapi`
        };
    } catch (error) {
        console.error('DocuSign Authentication Error:', error);
        
        // Check if consent is required
        if (error.response?.body?.error === 'consent_required') {
            throw new Error('DocuSign consent required. Please visit the admin console.');
        }
        
        throw new Error('Failed to authenticate with DocuSign');
    }
}