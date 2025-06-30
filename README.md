# Insight Flow AI Trading Platform

[![Lovable Quality Gate](https://lovable.dev/badge/Insightflowaitrading)](https://lovable.dev/projects/Insightflowaitrading)
[![CI Tests](https://github.com/Millsondylan/Insightflowaitrading/actions/workflows/lovable.yml/badge.svg)](https://github.com/Millsondylan/Insightflowaitrading/actions/workflows/lovable.yml)

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

This project is integrated with Lovable.dev for visual component editing and AI-powered development. The integration provides:

- Visual component editing
- AI-powered code generation
- Theme support
- Responsive preview
- Component search
- Prop editing
- Code export

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/Insightflowaitrading.git
cd Insightflowaitrading
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp env.example .env
# Edit .env with your configuration
```

4. Start development server
```bash
npm run dev
```

### Project Structure

```
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   ├── modules/      # Feature modules
│   ├── pages/        # Page components
│   ├── lib/          # Utilities and config
│   └── styles/       # Global styles
└── lovable.config.js # Lovable.dev configuration
```

### Tech Stack

- React with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- Supabase for backend
- Lovable.dev for visual editing

### Development Workflow

1. Components are created in `src/components/`
2. Use `.lovable.tsx` extension for components that support visual editing
3. Run `npm run dev` to start development server
4. Access Lovable.dev editor at `http://localhost:3000`

### Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to your hosting platform of choice.

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
