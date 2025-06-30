# Insight Flow AI Trading Platform

A comprehensive AI-powered trading platform with real-time market analysis, strategy building, and Pine Script generation.

## Features

- **AI-Powered Strategy Building**: Create trading strategies using natural language
- **Pine Script Generator**: Generate TradingView Pine Script code from prompts
- **Real-time Market Correlations**: Live correlation heatmaps with auto-refresh
- **Trading Journal & Reflection**: AI-powered trade analysis and emotional coaching
- **System Monitoring**: Developer-mode panels for audit trails and system health
- **Academy & Learning**: Interactive lessons with progress tracking
- **Pro Features**: Unlimited generations, advanced AI models, and priority support

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Providers
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GROQ_API_KEY=your_groq_key

# Market Data APIs
POLYGON_API_KEY=your_polygon_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
FINNHUB_API_KEY=your_finnhub_key

# Audit & Monitoring (Optional)
AUDIT_WEBHOOK_URL=https://your-webhook-endpoint.com/audit

# TradingView Integration (Optional)
TRADINGVIEW_SCRIPT_DEEPLINK=https://www.tradingview.com/chart/

# Stripe (for subscriptions)
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
```

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up Supabase**:
   ```bash
   npx supabase start
   npx supabase db push
   ```

3. **Run development server**:
   ```bash
   pnpm dev
   ```

4. **Run tests**:
   ```bash
   # Unit tests
   pnpm test
   
   # E2E tests
   pnpm cypress open
   ```

## Architecture

### Database
- **Supabase PostgreSQL** with real-time subscriptions
- **Audit trails** for all user actions and AI interactions
- **JSON schema validation** for data integrity

### AI Integration
- **Multi-model routing** (GPT-4, Claude, Groq) based on task complexity
- **Reasoning logs** stored for analysis and improvement
- **Quota management** with subscription tiers

### Real-time Features
- **Market correlation updates** via Supabase channels
- **Live system monitoring** with developer mode
- **Collaborative strategy building** with presence indicators

## Testing

### Unit Tests
```bash
pnpm test
```
Tests cover:
- JSON validation utilities
- React hooks (market correlations, auth)
- Audit logging functions

### E2E Tests
```bash
pnpm cypress open
```
Full user journey tests:
- Authentication flow
- Pine Script generation
- Developer mode toggle
- System status monitoring

## Deployment

1. **Database migrations**:
   ```bash
   supabase db push
   ```

2. **Build and deploy**:
   ```bash
   pnpm build
   pnpm start
   ```

## Lovable.dev Integration

This project is fully compatible with Lovable.dev:

- **Registered blocks**: SystemStatusPanel, CorrelationHeatmap, ReferralSystem, PineScriptGeneratorPage
- **AI-friendly structure**: Dual file pattern (`.tsx` + `.lovable.tsx`)
- **Function endpoints**: All API routes follow Lovable conventions

To sync with Lovable:
```bash
npx lovable-tagger serve src/lovable-demo/LovableDemo.tsx
```

## License

MIT License - see LICENSE file for details.
