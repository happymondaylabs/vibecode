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
- `MAILGUN_API_KEY` - Your Mailgun API key for email notifications
- `MAILGUN_DOMAIN` - Your Mailgun domain for sending emails
- `ADMIN_EMAIL` - Email address to receive order notifications (default: darin@yougenius.co)

## Development

For local development, create a `.env` file in the root directory:

```
FAL_KEY=your_fal_api_key_here
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=your_mailgun_domain_here
ADMIN_EMAIL=darin@yougenius.co
```

Note: The `.env` file is already in `.gitignore` so your API key won't be committed to the repository.

## Developer Bypass (Testing Only)

For testing purposes, you can bypass Stripe payments using a magic name/age combination:

### Setup
Add these environment variables to your Netlify dashboard or local `.env` file:
```
VITE_DEV_BYPASS_NAME=monday
VITE_DEV_BYPASS_AGE=32
```

### Usage
1. Enter the magic name: `monday`
2. Enter the magic age: `32`
3. The system will automatically skip payment and use the theme image as a mock video

### Security Notes
- ⚠️ **NEVER** set these variables in production
- The bypass only works when both name AND age match exactly
- A visual indicator shows when bypass is active (development mode only)
- The bypass is completely disabled in production builds

### How It Works
- Detects the magic combo in `PaymentOptions.tsx`
- Skips Stripe payment flow entirely
- Uses theme image as mock video URL
- Logs bypass activity for debugging

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

### Setup Mailgun Email Service

#### Step 1: Create Mailgun Account
1. Go to [mailgun.com](https://mailgun.com) and sign up
2. Verify your email address
3. Complete the account setup

#### Step 2: Get Your API Key
1. Go to **Settings** → **API Keys**
2. Copy your **Private API Key** (starts with `key-...`)
3. Save this for the environment variables

#### Step 3: Set Up Domain
1. Go to **Sending** → **Domains**
2. Use the sandbox domain for testing: `sandboxXXXXX.mailgun.org`
3. Or add your own domain for production
4. Copy the domain name for environment variables

#### Step 4: Add Environment Variables to Netlify
1. Go to your Netlify dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add these variables:
   - `MAILGUN_API_KEY` = your private API key
   - `MAILGUN_DOMAIN` = your domain (e.g., `sandboxXXXXX.mailgun.org`)
   - `ADMIN_EMAIL` = `darin@yougenius.co`
4. **Important**: Redeploy your site after adding variables

#### Step 5: Verify Setup
- Test by making a purchase on your site
- Check your email for order notifications
- Monitor Mailgun dashboard for delivery stats

3. **Set Admin Email**:
   - Add `ADMIN_EMAIL=darin@yougenius.co` to environment variables
   - This email will receive all order notifications

3. **Alternative Email Services**:
   - The system can be easily modified to use other services
   - EmailJS, Mailgun, or AWS SES are good alternatives
   - Update the `send-email.ts` function accordingly