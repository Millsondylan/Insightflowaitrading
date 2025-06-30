#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Insight Flow Environment Setup\n');

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Backing up to .env.local.backup');
  fs.copyFileSync(envPath, envPath + '.backup');
}

// Create .env.local with template
const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Database (if using direct connection)
DATABASE_URL=your_database_connection_string

# Optional: Additional AI Services
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token

# Optional: Email (for notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
`;

fs.writeFileSync(envPath, envTemplate);

console.log('✅ Created .env.local file');
console.log('\n📝 Next steps:');
console.log('1. Get your Supabase credentials from https://supabase.com');
console.log('2. Get your OpenAI API key from https://platform.openai.com');
console.log('3. Update the values in .env.local with your actual credentials');
console.log('4. Run "npm run dev" to start the development server');
console.log('\n🔗 Useful links:');
console.log('- Supabase Setup: https://supabase.com/docs/guides/getting-started');
console.log('- OpenAI API: https://platform.openai.com/docs/quickstart');
console.log('- Stripe Setup: https://stripe.com/docs/development');
console.log('\n�� Happy coding!'); 