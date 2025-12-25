# Shopify App Setup Guide

This guide will walk you through creating a Shopify app and configuring it for your e-commerce enablement platform.

## Step 1: Access Shopify Partners Dashboard

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Sign in with your Shopify Partners account (or create one if you don't have it)

## Step 2: Create a New App

1. In the Shopify Partners dashboard, navigate to **Apps** in the left sidebar
2. Click **"Create app"** button
3. Choose one of the following:
   - **Create app manually** (recommended for custom integrations)
   - **Use a template** (if you want to start from a template)

## Step 3: Configure App Details

After creating the app, you'll need to configure the app details in the **Versions** section:

1. Click **"Versions"** in the left navigation panel
2. Click on your version or create a new one
3. Configure:
   - **App name**: Your app's display name (e.g., "E-commerce Enablement Platform")
   - **App URL**: Your application's base URL (e.g., `https://yourdomain.com`)
   - **Allowed redirection URL(s)**:
     - For development: `https://yourdomain.com/api/shopify/auth/callback`
     - For production: Your production callback URL
     - You can add multiple URLs (one per line)

## Step 4: Configure App URL, Redirect URLs, and API Scopes

**Important:** In the updated Shopify Partners dashboard, these settings are configured in the **Versions** section, not in Settings.

**Where to configure:**

1. In your app's dashboard, click **"Versions"** in the left navigation panel (under your app name)
2. You'll see your current version (e.g., "e-commerce-enablement-platform-1")
3. Click on the version or click **"New version"** to create/edit a version
4. In the version settings, you'll find:
   - **App URL**: Your application's base URL (e.g., `https://ai-privacy-compliance.vercel.app`)
   - **Allowed redirection URL(s)**: Where Shopify redirects after OAuth
     - For production: `https://ai-privacy-compliance.vercel.app/api/shopify/auth/callback`
     - For development: `http://localhost:3000/api/shopify/auth/callback`
     - You can add multiple URLs (one per line) for different environments
     - **Important**: The redirect URI is automatically generated from the request origin, so make sure the domain you're accessing matches what's configured here
   - **API scopes**: The permissions your app needs

**Required scopes for your app:**

Based on your code, you need these scopes:

- `read_orders` - Read order information
- `write_orders` - Create and update orders
- `read_products` - Read product information

**Additional scopes you might need:**

- `read_customers` - If you need customer data
- `write_products` - If you need to create/update products
- `read_inventory` - If you need inventory information

**Note:** The scopes you set here must match what you request in your OAuth flow. Your code uses `SHOPIFY_APP_SCOPES` environment variable, which should match the scopes configured in the version settings.

## Step 5: Get API Credentials

The API credentials are in the **Settings** page:

1. Click **"Settings"** in the left navigation panel
2. In the **Credentials** section, you'll see:
   - **Client ID** - This is your `SHOPIFY_API_KEY` (you can copy it using the copy icon)
   - **Secret** - This is your `SHOPIFY_API_SECRET` (click the eye icon to reveal it)
3. **Important**: Copy these credentials immediately - save them securely!
4. You can rotate the secret if needed using the "Rotate" button

## Step 6: Configure Environment Variables

Add the following to your `.env.local` file (or your environment configuration):

```env
# Shopify App Credentials
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here

# Optional: Custom scopes (defaults to read_orders,write_orders,read_products)
SHOPIFY_APP_SCOPES=read_orders,write_orders,read_products

# Note: Redirect URI is automatically generated from request origin
# No need to set SHOPIFY_APP_REDIRECT_URI - it will use the domain you're accessing
# Make sure your Shopify app's "Allowed redirection URL(s)" includes your production domain
```

## Step 7: Development vs Production

### Development App

- Use for testing and development
- Can be installed on development stores
- Limited to 10 development stores
- Free to use

### Production App

- For public distribution
- Requires app review for public listing
- Can be installed on any Shopify store
- May require subscription/pricing setup

## Step 8: Create Development Stores (For Testing)

As mentioned in the Shopify Partners dashboard banner:

1. Go to the **Dev Dashboard** (not the regular Stores section)
2. Create development stores to test your app
3. Install your app on these development stores

## Step 9: Test the Integration

1. Start your development server
2. Navigate to your integrations page: `/dashboard/settings/integrations`
3. Click "Connect Store"
4. Enter your development store domain (e.g., `your-dev-store.myshopify.com`)
5. Complete the OAuth flow

## Important Notes

### Security

- **Never commit** your `SHOPIFY_API_SECRET` to version control
- Use environment variables for all credentials
- The secret key is only shown once - save it securely

### Redirect URLs

- Must match exactly what you configure in Shopify Partners dashboard
- Include the full URL with protocol (https://)
- Can add multiple URLs for different environments

### App URLs

- **App URL**: Your main application URL
- **Allowed redirection URLs**: Where Shopify redirects after OAuth (your callback endpoint)

## Troubleshooting

### "Shopify integration not configured"

- Check that `SHOPIFY_API_KEY` and `SHOPIFY_API_SECRET` are set in your environment
- Restart your development server after adding environment variables

### "Invalid redirect_uri"

- Ensure the redirect URI in your app settings matches exactly
- Check for trailing slashes, http vs https, etc.

### "Invalid HMAC"

- Usually means the API secret is incorrect
- Verify you copied the secret key correctly

## Next Steps

After setting up your app:

1. Test the OAuth flow with a development store
2. Implement webhook handlers for real-time updates
3. Add additional scopes as needed
4. Prepare for app review if going public

## Resources

- [Shopify App Development Documentation](https://shopify.dev/docs/apps)
- [OAuth Documentation](https://shopify.dev/docs/apps/auth/oauth)
- [API Scopes Reference](https://shopify.dev/docs/api/admin-graphql/latest/enums/AppPermission)
- [Partners Dashboard](https://partners.shopify.com)
