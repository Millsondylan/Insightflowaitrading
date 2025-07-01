# InsightFlow AI Trading Platform - Lovable.dev Setup Guide

## 🎯 Overview

This is a comprehensive AI-powered trading intelligence platform built with React + Vite for full lovable.dev compatibility.

## ✅ Lovable.dev Compatibility Checklist

### Framework & Build Tool
- ✅ **React 18** (not Next.js)
- ✅ **Vite 7** (not Next.js)
- ✅ **TypeScript** support
- ✅ **TailwindCSS** styling
- ✅ **Radix UI** components

### Project Structure
```
├── src/                    # Main source directory
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── types/             # TypeScript definitions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration
├── package.json           # React/Vite dependencies
└── .env.example           # Environment variables example
```

### Environment Variables (VITE_ prefix)
```bash
# Required for Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required for AI features
VITE_OPENAI_API_KEY=your_openai_api_key

# Optional for payments
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# App configuration
VITE_APP_URL=http://localhost:3000
VITE_APP_NAME=InsightFlow AI
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual values
# At minimum, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

### 3. Start Development Server
```bash
npm run dev
```

The app will run at http://localhost:3000

## 🏗️ Deploying to Lovable.dev

### 1. Connect Repository
1. Go to lovable.dev
2. Connect your GitHub repository
3. Select this branch

### 2. Configure Build Settings
- **Framework**: React
- **Build Tool**: Vite
- **Build Command**: `npm run build`
- **Dev Command**: `npm run dev`
- **Install Command**: `npm install`
- **Output Directory**: `dist`

### 3. Environment Variables
Add these in the Lovable dashboard:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 4. Deploy
Lovable will automatically build and deploy your app.

## 🔧 Supabase Integration

### Authentication Setup
The app includes proper Supabase authentication handling that avoids deadlocks:

```typescript
// ✅ Correct: Non-async callback with setTimeout
supabase.auth.onAuthStateChange((event, session) => {
  setTimeout(async () => {
    // Async operations here
    if (session) {
      await fetchUserProfile(session.user);
    }
  }, 0);
});
```

### Database Tables
Required Supabase tables:
- `profiles` - User profiles
- `strategies` - Trading strategies
- `trades` - Trade records
- `journal_entries` - Journal entries

### RLS Policies
Ensure Row Level Security is enabled with proper policies.

## 🎨 Component Structure

### Lovable Exports
All components include the required lovable export:

```typescript
export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
```

### Key Components
- **Dashboard**: Main trading dashboard
- **Strategy Builder**: AI-powered strategy creation
- **Journal**: Trading journal and reflection
- **Academy**: Educational content
- **Portfolio**: Performance tracking
- **Community**: Social features

## 🔍 Troubleshooting

### Common Issues

1. **"supabaseKey is required" Error**
   - This is normal in development without Supabase credentials
   - App uses mock data when credentials are missing
   - Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use real Supabase

2. **Build Errors**
   - Ensure all dependencies are installed: `npm install`
   - Check TypeScript errors: `npm run build`
   - Verify environment variables are using VITE_ prefix

3. **Authentication Issues**
   - Check Supabase configuration
   - Verify RLS policies are set up
   - Ensure onAuthStateChange handlers are non-async

### Development Mode
The app gracefully handles missing environment variables:
- Shows mock data when Supabase isn't configured
- Displays helpful console messages
- Allows full UI testing without backend setup

## 📱 Features

### Core Trading Systems
1. **Strategy Intelligence** - AI-powered strategy creation
2. **Market Analysis** - Real-time market insights
3. **Trade Planning** - Pre-trade analysis
4. **Journal & Reflection** - Trade analysis and learning
5. **Portfolio Management** - Performance tracking
6. **Community Features** - Social trading
7. **Academy** - Educational content
8. **AI Copilot** - Intelligent assistance
9. **Risk Management** - Position sizing
10. **Analytics** - Advanced reporting

### Technical Features
- ✅ Responsive design
- ✅ Dark/light theme
- ✅ Real-time updates
- ✅ PWA ready
- ✅ TypeScript support
- ✅ Error boundaries
- ✅ Lazy loading
- ✅ Code splitting

## 🔗 Links

- **Repository**: https://github.com/your-username/insightflow-ai
- **Lovable.dev**: https://lovable.dev
- **Supabase**: https://supabase.com
- **Documentation**: This file

## 💡 Tips for Lovable.dev

1. **Use Specific Prompts**: Be clear about what you want to change
2. **Start Simple**: Build features incrementally
3. **Test Frequently**: Use the preview to test changes
4. **Use Select Tool**: Highlight specific components to modify
5. **Join Community**: Use Lovable Discord for help and tips

## 🆘 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify environment variables are set correctly
3. Ensure Supabase configuration is correct
4. Join the Lovable Discord community for help 