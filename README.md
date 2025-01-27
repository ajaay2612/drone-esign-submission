# DroNova

Drones have revolutionized various industries, from photography to delivery services. However, the rapid increase in drone usage has also brought challenges, especially in terms of registration, ownership tracking, and airspace safety. The need for a secure and efficient way to manage drones is urgent, and that's where technology can make a real difference. We realized that by using DocuSign’s technologies, we could help make drone registration and ownership management smoother, more accessible, and entirely online. This project started as a way to fix a real-world issue using technology, and that’s what drives us.

This application helps drone owners manage their registrations, transfer ownership, and handle all required documentation digitally.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- DocuSign Developer Account
- SMTP Server Access (for email notifications)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/ajaay2612/drone-esign-submission.git
cd drone-esign-submission
```

2. Install dependencies:
```bash
npm install
```

3. Create and configure environment variables:

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Start the development server:
```bash
npm run dev
```

Your app should now be running at `http://localhost:5173`

## Environment Configuration

Create a `.env` file in the root directory with the following structure:

```env
# Application
PUBLIC_DOMAIN="http://localhost:5173"

# Database
DATABASE_URL="postgresql://[username]:[password]@localhost:5432/[database_name]?schema=public"

# Authentication
AUTH_SECRET="[generate-a-secure-random-string]"

# Google OAuth
GOOGLE_CLIENT_ID="[your-google-client-id]"
GOOGLE_CLIENT_SECRET="[your-google-client-secret]"

# SMTP Configuration
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-smtp-password"
SMTP_FROM="your-email@example.com"

# DocuSign Configuration
DOCUSIGN_ACCOUNT_ID="[your-docusign-account-id]"
DOCUSIGN_BASE="https://demo.docusign.net"
DOCUSIGN_BASE_PATH="https://demo.docusign.net/restapi"
DOCUSIGN_CLICK_API_BASE_PATH="https://demo.docusign.net/clickapi"
DOCUSIGN_AUTH_URL="https://account-d.docusign.com/oauth/auth"
DOCUSIGN_TOKEN_URL="https://account-d.docusign.com/oauth/token"
DOCUSIGN_CLIENT_ID="[your-docusign-client-id]"
DOCUSIGN_IMPERSONATED_USER_ID="[your-docusign-user-id]"
DOCUSIGN_REDIRECT_URI="http://localhost:5173/api/docusign/callback"
DOCUSIGN_REVOKE_URL="https://account-d.docusign.com/oauth/token/revoke"
DOCUSIGN_USER_INFO_URL="https://account-d.docusign.com"
CONNECT_KEY="[docusign-connect-key]"
WORKFLOW_ID="[your-docusign-Id-verification-workflow-id]"
DOCUSIGN_CLICKWRAP_ID="[your-docusign-clickwrap-id]"
BRAND_ID="[your-docusign-brand-id]"
DOCUSIGN_PRIVATE_KEY_PATH="./private.key"
```

### Environment Variables Guide

1. **Application Settings**
   - `PUBLIC_DOMAIN`: Your application's public URL

2. **Database Configuration**
   - `DATABASE_URL`: PostgreSQL connection string
   
3. **Authentication**
   - `AUTH_SECRET`: Random string for session encryption
   
4. **Google OAuth**
   - Create credentials at Google Cloud Console
   - Configure OAuth consent screen
   - Add authorized redirect URIs

5. **SMTP Configuration**
   - Configure with your email service provider details
   - For Gmail, use App Password instead of account password

6. **DocuSign Configuration**
   - Create a DocuSign Developer Account
   - Set up an application in DocuSign
   - Configure OAuth and generate integration keys
   - Create clickwrap agreements and workflows
   - Generate RSA key pair and save private key
   - Configure DocuSign Connect to point to `[YOUR_DOMAIN]/webhook`
     - This endpoint receives DocuSign status updates
    
7. **Admin Setup**
   - After creating your first user, access the database
   - Update the user's `isSuperUser` field to `true`.
   - This grants administrative privileges required for app management

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm run start
```

## Additional Notes

- Ensure your DocuSign account has the required permissions
- Keep your private key secure and never commit it to version control
- For development, use DocuSign's demo environment
- Update `PUBLIC_DOMAIN` when deploying to production
