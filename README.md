# VIBE CARD - Video Birthday Cards

## Setup Instructions

### 1. Get Your FAL API Key

1. Go to [fal.ai](https://fal.ai) and create an account
2. Navigate to your API Keys section
3. Create a new API key
4. Copy the key (it should start with something like `fal_...`)

### 2. Set Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site: **celadon-pothos-87dd95**
3. Go to **Site settings** → **Environment variables**
4. Add a new environment variable:
   - **Key**: `FAL_KEY`
   - **Value**: Your FAL API key from step 1
5. Click **Save**
6. **IMPORTANT**: Redeploy your site after adding the environment variable

### 3. Alternative: Set via Netlify CLI (if you have it)

```bash
netlify env:set FAL_KEY your_fal_api_key_here
```

### 4. Quick Setup Link

**Direct link to your site's environment variables:**
https://app.netlify.com/sites/celadon-pothos-87dd95/settings/env

### 5. Test the Setup

After setting the environment variable and redeploying:

1. Go to your site
2. Fill out the form and click "Generate Card"
3. The video generation should now work

## Troubleshooting

If you're still getting "Server misconfiguration":

1. **Double-check the environment variable name**: It must be exactly `FAL_API_KEY`
2. **Verify the API key**: Make sure it's valid and not expired
3. **Redeploy**: After adding environment variables, you need to redeploy
4. **Check the logs**: Go to Netlify Functions logs to see detailed error messages

## Environment Variables Needed

- `FAL_KEY` - Your FAL.ai API key for video generation ✅ CONFIGURED
- `SENDGRID_API_KEY` - Your SendGrid API key for email notifications
- `ADMIN_EMAIL` - Email address to receive order notifications (default: darin@yougenius.co)

## Development

For local development, create a `.env` file in the root directory:

```
FAL_KEY=your_fal_api_key_here
SENDGRID_API_KEY=your_sendgrid_api_key_here
ADMIN_EMAIL=darin@yougenius.co
```

Note: The `.env` file is already in `.gitignore` so your API key won't be committed to the repository.

## Email Notifications

The system automatically sends email notifications for:

### ✅ Payment Success + Generation Pending
- Customer email, name, age
- Theme selected
- Payment confirmation
- Generation status: PENDING

### ❌ Payment Success + Generation Failed
- **URGENT**: Manual processing required
- All order details
- Error message
- Action required notification

### 💳 Payment Failed
- Failed payment attempt details
- No generation attempted
- Customer contact info for follow-up

### 🎬 Generation Success (Future)
- Video URL included
- Complete order summary
- Ready for customer delivery

### Setup Email Service

1. **Get SendGrid API Key**:
   - Sign up at [SendGrid](https://sendgrid.com)
   - Create an API key with "Mail Send" permissions
   - Add to Netlify environment variables as `SENDGRID_API_KEY`

2. **Set Admin Email**:
   - Add `ADMIN_EMAIL=darin@yougenius.co` to environment variables
   - This email will receive all order notifications

3. **Alternative Email Services**:
   - The system can be easily modified to use other services
   - EmailJS, Mailgun, or AWS SES are good alternatives
   - Update the `send-email.ts` function accordingly