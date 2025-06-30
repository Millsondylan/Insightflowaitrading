# InsightFlow AI Trading Platform: Lovable Deployment Guide

## Complete Deployment Instructions

This document provides detailed instructions for deploying InsightFlow AI Trading on Lovable.

### 1. Pre-Deployment Checklist

Before deploying to Lovable, ensure you have:

- [ ] A Supabase account and project set up
- [ ] Database URL and API key
- [ ] Git repository with the latest code

### 2. Environment Variables

Set the following environment variables in the Lovable dashboard:

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| DATABASE_URL | `postgresql://...` | Yes | Your Supabase connection string |
| SUPABASE_URL | `https://ikreglaqlileqlmlgsao.supabase.co` | Yes | |
| SUPABASE_KEY | `your-supabase-anon-key` | Yes | Publishable/anon key |
| NODE_ENV | `production` | Yes | |
| PORT | `3000` | No | Default is 3000 |
| VITE_IS_LOVABLE | `true` | No | Enables Lovable-specific features |

#### API Keys and Sensitive Data

For security, add these additional environment variables in the Lovable dashboard:

- **AI Providers**: `OPENAI_API_KEY`, `GROQ_API_KEY`, `GEMINI_API_KEY`
- **Market Data**: `YFINANCE_API_KEY`, `COINGECKO_API_KEY`, etc.
- **Messaging/Email**: `TELEGRAM_BOT_TOKEN`, `SENDGRID_API_KEY`, etc.

⚠️ **IMPORTANT**: Never commit API keys or sensitive data to your repository. Use the `lovable.env.example` template as a reference and add actual values only in the Lovable dashboard.

### 3. Deployment Configuration

Use these exact settings in the Lovable deployment panel:

- **Framework**: `Node.js`
- **Build Command**: `echo 'Skipping build process for Lovable deployment'` 
- **Start Command**: `node lovable-minimal-server.js`
- **Install Command**: `npm install express`
- **Node Version**: `18` (or higher)

### 4. Database Setup

If this is your first deployment:

1. Create Supabase tables using the schema in `supabase/migrations`
2. Ensure public access is properly configured
3. Use the Supabase dashboard to verify connections

### 5. Troubleshooting

#### White Screen Issues
- Check `/health` endpoint for server status
- View server logs for environment variable problems
- Ensure DATABASE_URL is correctly configured

#### Database Connection Issues
- Test your connection string separately
- Check Supabase console for connection errors
- Verify network permissions

#### Common Error Messages

| Error | Solution |
|-------|----------|
| "DatabaseURL not set" | Add DATABASE_URL environment variable |
| "Unexpected token '<'" | Check deployment paths in package.json |
| "Module not found" | Ensure all dependencies are installed |

### 6. Post-Deployment Verification

After deployment:

1. Visit your app's Lovable URL
2. Check the `/health` endpoint to verify server status
3. Try logging in to test database connectivity
4. Test core functionality

### 7. Commands for Local Testing

Test the exact Lovable configuration locally:

```bash
# Export required environment variables
export DATABASE_URL=your_database_url
export NODE_ENV=production
export VITE_IS_LOVABLE=true

# Run the same command Lovable will use
node lovable-minimal-server.js
```

### 8. Contact and Support

If you encounter issues with Lovable deployment:

1. Check Lovable documentation for platform-specific guidance
2. Review environment variables for typos or missing values
3. Ensure your repository is public or properly accessible by Lovable

For direct support, contact [Lovable support](https://support.lovable.dev) 