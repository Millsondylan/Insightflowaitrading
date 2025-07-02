# 🔒 Security Notice: API Keys and Environment Variables

## ⚠️ CRITICAL SECURITY WARNING

**Your current environment variables contain sensitive API keys that should NOT be exposed to the client-side!**

## 🚨 Current Security Issues

### Sensitive Keys That Should NOT Use `VITE_` Prefix:
- ❌ `OPENAI_API_KEY` - Exposes your OpenAI account
- ❌ `GROQ_API_KEY` - Exposes your Groq account  
- ❌ `GEMINI_API_KEY` - Exposes your Google AI account
- ❌ Market Data API keys (11 different services)
- ❌ `TELEGRAM_BOT_TOKEN` - Could allow bot hijacking
- ❌ Email service API keys

### Why This Matters:
1. **Client Exposure**: `VITE_` prefixed variables are bundled into your JavaScript and visible to anyone
2. **API Abuse**: Exposed keys can be extracted and used maliciously
3. **Rate Limiting**: Others could exhaust your API quotas
4. **Billing Impact**: Unauthorized usage could result in unexpected charges

## ✅ Secure Solution for Lovable.dev

### Option 1: Supabase Edge Functions (Recommended)
Store sensitive API keys in Supabase and create Edge Functions to proxy API calls:

```typescript
// supabase/functions/ai-chat/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { message } = await req.json()
  
  // API key is stored securely in Supabase
  const openaiKey = Deno.env.get('OPENAI_API_KEY')
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
    }),
  })
  
  return new Response(JSON.stringify(await response.json()), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

### Option 2: Proxy Through Your Own Backend
If you have a separate backend server, route API calls through it instead of making direct client-side calls.

## 🔧 Safe Environment Variable Setup

### ✅ Safe for Client-Side (Use `VITE_` prefix):
```bash
# Public wallet addresses
VITE_RECEIVE_ETH_ADDRESS=0xb0b544e9c4f8b549df60cd752f47fe7d3564d080
VITE_RECEIVE_USDT_ADDRESS=TLEgUbALuXwV49RbJFRhMpaX23AYjC9Dwc
VITE_RECEIVE_BTC_ADDRESS=1KcYGjJnNduK72rEt8LZyzZeZ3BGGwGYT

# Supabase public configuration
VITE_SUPABASE_URL=https://ikreglaqlileqlmlgsao.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App configuration
VITE_APP_URL=https://yourapp.lovable.app
VITE_ENABLE_AI_FEATURES=true
```

### ❌ Keep Server-Side (NO `VITE_` prefix):
```bash
# Store these in Supabase Edge Functions environment
OPENAI_API_KEY=sk-svcacct-z5KpvqDDIbSBAUNuLPfNs8i6...
GROQ_API_KEY=gsk_6TgkdqW728HFNuFr0oz9WGdyb3FY...
TELEGRAM_BOT_TOKEN=7850305593:AAGWlAtH_N7UCsSZ5JecRse...
# ... all other API keys
```

## 🛠️ Implementation Steps

### 1. Update Your Environment Files
- Remove `VITE_` prefix from all sensitive API keys
- Keep only public values with `VITE_` prefix

### 2. Create Supabase Edge Functions
```bash
# Create Edge Functions for each service
supabase functions new openai-chat
supabase functions new market-data
supabase functions new telegram-alerts
```

### 3. Store Secrets in Supabase
```bash
# Set secrets for Edge Functions
supabase secrets set OPENAI_API_KEY=your_actual_key
supabase secrets set GROQ_API_KEY=your_actual_key
```

### 4. Update Client-Side Code
Replace direct API calls with calls to your Edge Functions:

```typescript
// Instead of direct OpenAI call
const response = await fetch('/api/ai-chat', {
  method: 'POST',
  body: JSON.stringify({ message }),
})
```

## 📚 Additional Resources

- [Supabase Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Environment Variables Security Best Practices](https://owasp.org/www-community/vulnerabilities/Insufficient_Logging)
- [API Key Security Guidelines](https://owasp.org/www-project-api-security/)

## 🆘 Immediate Actions Required

1. **Revoke and regenerate** all exposed API keys
2. **Remove sensitive keys** from client-side environment variables
3. **Set up Edge Functions** for API proxying
4. **Test thoroughly** before deploying to production

Remember: Security is not optional in production applications! 