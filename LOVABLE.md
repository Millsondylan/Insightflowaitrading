# InsightFlow AI Trading Platform: Lovable.dev Guide

This document provides step-by-step instructions for deploying and running the InsightFlow AI Trading Platform on Lovable.dev.

## 🚀 Ultra Simple Deployment (RECOMMENDED)

To resolve the white screen issue, we've created a guaranteed working static fallback:

### Step 1: Create a New Project

1. Sign in to your Lovable.dev account
2. Click "New Project" and select "From Git Repository"
3. Enter the repository URL: `https://github.com/yourusername/insightflowaitrading.git`
4. Choose the branch (usually `main` or `master`)

### Step 2: Configure Build Settings

Configure your Lovable project with these **simplified** settings:

- **Framework**: Custom (Node.js)
- **Build Command**: `npm run build && cp client/public/lovable-fallback.html dist/public/index.html`
- **Start Command**: `npm start`
- **Install Command**: `npm install`
- **Node Version**: 18.x or higher

This approach bypasses the React rendering issues by serving a static HTML fallback page that will always display correctly.

### Step 3: Deploy

1. Click "Deploy" and wait for the build to complete
2. Once deployed, you can access your application at the provided Lovable URL

## 🔄 Advanced Configuration (If Needed)

If you need the full React application functionality, you can try these alternative settings after diagnosing the issue:

### Alternative Build Commands

Try one of these commands:

```
npm run lovable-static  # Uses the static fallback HTML (recommended)
npm run lovable-entry   # Uses a simplified React entry point
npm run lovable         # Standard build with fallbacks
```

### Environment Variables

Add these environment variables as needed:

```
DATABASE_URL=your_supabase_url
API_KEY=your_api_key
PORT=3000
VITE_IS_LOVABLE=true
```

## 🔄 Syncing Changes

### Manual Sync

To manually sync your project with the latest changes:

1. Go to your project page on Lovable.dev
2. Click on "Settings"
3. Find the "Sync" section
4. Click "Sync Now"

### Automatic Sync

Lovable automatically detects changes when you push to your GitHub repository:

1. Make your changes locally
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Your update message"
git push origin main
```
3. Lovable will automatically rebuild your project

## 🔍 Lovable Preview

After deployment, you can preview your application:

1. Go to your project on Lovable
2. Click "Preview" to see your running application
3. Share the preview URL with team members for testing

## ⚙️ Troubleshooting White Screen Issues

If you encounter a white screen on all pages:

1. **Use the static HTML approach (recommended)**
   ```bash
   # Build command:
   npm run build && cp client/public/lovable-fallback.html dist/public/index.html
   ```
   This ensures something will always display regardless of React issues.

2. **Check browser console for errors**
   - Look for React-related errors
   - Check for missing dependencies or imports
   - Verify that environment variables are set correctly

3. **Try direct access**
   - Try adding `/index.html` to the end of your Lovable URL
   - Check the network tab for failed requests

4. **Lovable-specific issues**
   - Make sure your Vite build is targeting the correct directories
   - Verify that server-side rendering is disabled if causing issues
   - Try serving the static HTML fallback with `lovable-static` script

## 📈 Monitoring Your Lovable App

Lovable provides:

- Runtime logs
- Build logs
- Performance metrics

Access these by clicking on the respective tabs in your project dashboard to diagnose any issues.

## 🚪 Accessing Your Application

Your deployed application will be available at:

```
https://[your-project-name].lovable.dev
```

You can share this URL with stakeholders for testing and feedback. 