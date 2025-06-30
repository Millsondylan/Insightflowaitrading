# 🚀 Insight Flow AI Trading Platform

A comprehensive AI-powered trading intelligence platform built with Next.js 14, Supabase, and TailwindCSS. Features 10 core systems for strategy development, market analysis, trade planning, and performance tracking.

## ✨ Features

### 🧠 Core Systems
- **Strategy Intelligence Engine** - AI-powered strategy development and validation
- **Market & Setup Engine** - Real-time market analysis and opportunity detection
- **Trade Reflection & Coaching Loop** - AI coaching and performance improvement
- **Mindset & Journaling System** - Emotional tracking and psychological insights
- **Community & Multiplayer Tools** - Collaborative strategy sharing and discussions
- **Learning Engine (Academy 2.0)** - Self-paced education with AI feedback
- **Copilot AI Integration** - Intelligent trading assistant
- **Broker Sync & Trade Capture** - Real-time portfolio tracking
- **Trade Planning & Risk Management** - Advanced risk analysis and position sizing
- **Advanced Analytics & Performance** - Comprehensive performance metrics

### 🤖 AI-Powered Features
- Natural language strategy building
- Market sentiment analysis
- Trade coaching and reflection
- Performance optimization suggestions
- Risk assessment and alerts
- Personalized learning paths

### 📊 Analytics & Performance
- Portfolio tracking and P&L analysis
- Strategy performance comparison
- Risk metrics and drawdown analysis
- Trade history and statistics
- Performance visualization
- Benchmark analysis

## 🚀 Features

### Core Systems

1. **Strategy Intelligence Engine**
   - AI-powered strategy builder with natural language processing
   - Strategy vault with version tracking and AI-generated changelogs
   - Heatmap view of tag usage and performance correlation

2. **Market & Setup Engine**
   - AI-curated market insights and trending tickers
   - Daily narrated summaries (Broadcast Mode)
   - Ticker scanning engine for volatility and momentum detection

3. **Trade Reflection & Coaching Loop**
   - Visual trade timelines with PnL metrics
   - AI-powered trade replay engine
   - Behavioral pattern analysis and coaching

4. **Mindset & Journaling System**
   - AI-powered self-reflection with emotional tracking
   - Digital twin modeling of user's emotional and trade style
   - Pattern recognition for repeated mistakes

5. **Community & Multiplayer Tools**
   - Collaborative strategy vaults
   - AI-powered community GPT replies
   - Multiplayer strategy editing with cursor avatars

6. **Learning Engine (Academy 2.0)**
   - Self-paced educational flow with memory tracking
   - AI feedback and lesson interjections
   - Gamified learning experience

7. **Copilot AI Integration**
   - Embedded AI assistance throughout the platform
   - Strategy validation and mistake rewriting
   - Real-time coaching and suggestions

8. **Broker Sync & Trade Capture**
   - Real broker integration (MT4, MT5, TradingView)
   - Secure credential management
   - Automated trade capture and analysis

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS + ShadCN/ui
- **Backend**: Supabase (Auth, Database, Real-time)
- **AI**: OpenAI GPT-4, Claude Opus, Gemini Pro
- **Payments**: Stripe integration
- **Mobile**: Capacitor for native builds
- **Testing**: Playwright E2E testing

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd insightflow-trading-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   
   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase**
   ```bash
   # Run database migrations
   npm run db:push
   
   # Generate types
   npm run db:generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗 Project Structure

```
app/
├── layout.tsx                 # Root layout
├── page.tsx                  # Dashboard
├── auth/                     # Authentication
│   ├── page.tsx
│   └── callback/
├── modules/                  # Feature modules
│   ├── strategy/            # Strategy Intelligence
│   ├── markets/             # Market & Setup Engine
│   ├── reflection/          # Trade Reflection
│   ├── journal/             # Mindset & Journaling
│   ├── community/           # Community & Multiplayer
│   ├── academy/             # Learning Engine
│   ├── copilot/             # Copilot AI Integration
│   └── broker/              # Broker Sync
components/
├── ui/                      # ShadCN/ui components
├── dashboard/               # Dashboard components
└── providers/               # Context providers
lib/
├── utils.ts                 # Utility functions
├── supabase/                # Supabase client
└── ai/                      # AI integration
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run test` - Run Playwright tests
- `npm run db:push` - Push database schema
- `npm run db:generate` - Generate database types

### Adding New Features

1. Create a new module in `app/modules/`
2. Add the module to the dashboard navigation
3. Implement the feature with proper TypeScript types
4. Add tests for critical functionality
5. Update documentation

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Configure environment variables

## 🔒 Security

- All API keys are stored securely in environment variables
- Supabase RLS (Row Level Security) enabled
- Input validation with Zod schemas
- Rate limiting on API endpoints
- Secure authentication with Supabase Auth

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@insightflow.ai or join our Discord community.

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced AI features
- [ ] More broker integrations
- [ ] Social trading features
- [ ] Advanced analytics
- [ ] API for third-party integrations

---

Built with ❤️ by the Insight Flow team 