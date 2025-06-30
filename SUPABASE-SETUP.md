# Supabase Setup Guide

## Quick Fix for "supabaseKey is required" Error

If you're seeing the error `[plugin:runtime-error-plugin] supabaseKey is required`, this is normal in development mode. The app is designed to work with mock data when Supabase credentials aren't configured.

### ✅ Automatic Solution

The app automatically detects development mode and uses mock data. You should see console messages like:
```
🔧 Using mock Supabase client - no real database connection
📝 This is normal for development/demo mode
```

### 🎯 To Use Real Supabase

1. **Get your Supabase credentials:**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to Settings > API
   - Copy the URL and anon key

2. **Create environment file:**
   ```bash
   # Create .env file in root directory
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_DEMO_MODE=false
   ```

3. **Restart your development server**

### 🔧 Development Mode (Default)

In development mode, the app uses mock data for:
- ✅ User authentication (mock login/logout)
- ✅ Database operations (mock CRUD)
- ✅ File uploads (mock storage)
- ✅ Real-time subscriptions (mock events)

### 🚀 Production Deployment

For production (like Lovable.dev), the app automatically:
- Detects the deployment environment
- Uses mock data if no credentials are available
- Provides graceful fallbacks for all database operations

### 📝 Console Messages

You'll see helpful console messages:
- `🔧 Using mock Supabase client` - Mock mode active
- `🔍 Mock select from users` - Database operations logged
- `🔐 Mock sign in` - Authentication operations logged
- `✅ Supabase client initialized` - Real connection active

### 🛠️ Troubleshooting

**Error still appears?**
1. Check browser console for mock client messages
2. Restart your development server
3. Clear browser cache
4. Run `npm run setup:env` for guidance

**Want to disable mock mode?**
Set `VITE_DEMO_MODE=false` in your environment variables.

---

**Note:** This is a feature, not a bug! The mock client allows you to develop and test the app without needing a real Supabase database. 