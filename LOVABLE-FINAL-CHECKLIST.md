# InsightFlow AI Trading: Lovable Deployment Final Checklist

Use this checklist to ensure your Lovable deployment is successful.

## Pre-Deployment Checklist

- [ ] Confirmed all required files are in the repository
- [ ] Created/updated `lovable.env` with your environment variables
- [ ] Verified `lovable-minimal-server.js` is working locally
- [ ] Checked `client/public/lovable-fallback.html` looks correct
- [ ] All dependencies are in `package.json`

## Lovable Configuration Settings

Make sure your Lovable deployment settings are exactly as follows:

| Setting | Value |
|---------|-------|
| Framework | Node.js |
| Build Command | `echo 'Skipping build process for Lovable deployment'` |
| Start Command | `node lovable-minimal-server.js` |
| Install Command | `npm install express` |
| Node Version | 18 |

## Environment Variables

Ensure these environment variables are set in your Lovable deployment:

- [ ] `DATABASE_URL` = Your Supabase connection string
- [ ] `SUPABASE_URL` = `https://ikreglaqlileqlmlgsao.supabase.co`
- [ ] `SUPABASE_KEY` = Your Supabase anon key
- [ ] `NODE_ENV` = `production`
- [ ] `VITE_IS_LOVABLE` = `true`

## Post-Deployment Verification

After deployment, check the following:

1. Visit your Lovable URL to confirm the site loads
2. Check the `/health` endpoint for server status
3. Check browser console for any errors
4. Try basic functionality (login, navigation)

## Troubleshooting

If you encounter issues:

- Check Lovable logs for startup errors
- Verify all environment variables are set correctly
- Make sure package.json has all dependencies
- Try manually connecting to your database from another client
- Check the lovable-fallback.html is present and accessible

## Recovery Steps

If all else fails:

1. Deploy using only the minimal server: `node lovable-minimal-server.js`
2. Set `SKIP_DATABASE=true` in the environment variables
3. Check the logs to identify the specific issue

## Contact Support

For additional help:

- Create a GitHub issue with detailed error logs
- Contact Lovable support through their dashboard
- Reach out to your Supabase admin for database issues 