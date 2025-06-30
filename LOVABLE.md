# InsightFlow AI Trading Platform: Lovable.dev Guide

This document provides step-by-step instructions for deploying and running the InsightFlow AI Trading Platform on Lovable.dev.

## 🚀 Quick Setup Guide for Lovable

### Step 1: Create a New Project

1. Sign in to your Lovable.dev account
2. Click "New Project" and select "From Git Repository"
3. Enter the repository URL: `https://github.com/yourusername/insightflowaitrading.git`
4. Choose the branch (usually `main` or `master`)

### Step 2: Configure Build Settings

Configure your Lovable project with these settings:

- **Framework**: Custom (Node.js)
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Install Command**: `npm install`
- **Node Version**: 18.x or higher

### Step 3: Environment Variables

Add the following environment variables in your Lovable project settings:

```
DATABASE_URL=your_supabase_url
API_KEY=your_api_key
PORT=3000
```

### Step 4: Deploy

1. Click "Deploy" and wait for the build to complete
2. Once deployed, you can access your application at the provided Lovable URL

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

## ⚙️ Troubleshooting Lovable Deployments

### Build Failed

If your build fails:

1. Check Lovable's build logs for error messages
2. Verify your package.json has the correct scripts
3. Ensure all dependencies are properly listed in package.json
4. Try running `npm run build` locally to identify issues

### Runtime Errors

If your application builds but doesn't run properly:

1. Check Lovable's runtime logs
2. Verify environment variables are set correctly
3. Ensure database connections are working properly

## 📈 Monitoring Your Lovable App

Lovable provides:

- Runtime logs
- Build logs
- Performance metrics

Access these by clicking on the respective tabs in your project dashboard.

## 🚪 Accessing Your Application

Your deployed application will be available at:

```
https://[your-project-name].lovable.dev
```

You can share this URL with stakeholders for testing and feedback. 