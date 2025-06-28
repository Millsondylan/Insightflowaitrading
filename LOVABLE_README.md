# InsightFlow AI Trading - Lovable Platform Guide

## 🚀 Overview

InsightFlow AI Trading is a comprehensive trading education and strategy platform fully optimized for Lovable.dev. This platform features:

- **10+ Comprehensive Trading Courses** with 60+ lessons and 100+ quizzes
- **20+ Professional Trading Strategies** with detailed performance metrics
- **Real-time Market Data** for cryptocurrencies, forex, stocks, and commodities
- **AI-Powered Features** including journal insights and strategy recommendations
- **Full Lovable Compatibility** with visual editing and live preview

## 🎨 Lovable Features

### Visual Editing
All components are Lovable-compatible with `.lovable.tsx` versions that support:
- Drag-and-drop editing
- Real-time style updates
- Component property editing
- Visual theme customization

### Component Library
- 100+ pre-built UI components
- Fully customizable with Tailwind CSS
- Dark mode support
- Responsive design

### AI Integration
- OpenAI integration for content generation
- AI-powered trading insights
- Automated quiz generation
- Smart strategy recommendations

## 📚 Content Overview

### Academy Courses

1. **Technical Analysis Mastery** (Beginner)
   - 12 weeks, 15+ lessons
   - Chart patterns, indicators, price action

2. **Professional Risk Management** (Intermediate)
   - 8 weeks, 10+ lessons
   - Portfolio theory, position sizing

3. **Advanced Cryptocurrency Trading** (Advanced)
   - 10 weeks, 12+ lessons
   - DeFi, yield farming, on-chain analysis

4. **Algorithmic Trading Systems** (Expert)
   - 16 weeks, 15+ lessons
   - ML models, backtesting, automation

5. **Options Trading Mastery** (Advanced)
   - 14 weeks, 12+ lessons
   - Greeks, strategies, volatility

6. **Forex Trading Fundamentals** (Intermediate)
   - 10 weeks, 10+ lessons
   - Currency pairs, central banks

7. **Trading Psychology Mastery** (Intermediate)
   - 6 weeks, 8+ lessons
   - Biases, mindset, performance

8. **Fundamental Market Analysis** (Intermediate)
   - 8 weeks, 10+ lessons
   - Economic indicators, central banks

9. **Quantitative Trading Analysis** (Expert)
   - 12 weeks, 12+ lessons
   - Statistics, backtesting, risk metrics

10. **Institutional Trading Strategies** (Expert)
    - 10 weeks, 10+ lessons
    - Order flow, market making

### Strategy Vault

20+ professional strategies including:
- AI Momentum Scanner Pro
- Cross-Exchange Arbitrage Master
- Smart Grid DCA Evolution
- Options Theta Harvester
- Crypto Whale Tracker Pro
- Market Profile Scalper Ultra
- And many more...

Each strategy includes:
- Detailed performance metrics
- Risk levels and requirements
- Author information and ratings
- Real-world application examples

### Market Data

Real-time data for:
- **Cryptocurrencies**: BTC, ETH, BNB, SOL, and more
- **Forex Pairs**: EUR/USD, GBP/USD, USD/JPY, etc.
- **Stocks**: AAPL, MSFT, GOOGL, AMZN, etc.
- **Commodities**: Gold, Silver, Oil, Natural Gas, etc.

## 🛠️ Lovable-Specific Setup

### 1. Import to Lovable

```bash
# Clone the repository
git clone https://github.com/yourusername/insightflow-ai-trading.git

# Or import directly in Lovable
# Go to Lovable.dev → New Project → Import from GitHub
```

### 2. Environment Variables

Create `.env` file with:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (for AI features)
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe (for payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Other APIs
VITE_GROQ_API_KEY=your_groq_key
VITE_GEMINI_API_KEY=your_gemini_key
```

### 3. Database Setup

Run the Supabase migrations:

```sql
-- See supabase/migrations/ folder for all SQL files
-- Run in order to set up tables for:
-- - Users and authentication
-- - Trading strategies
-- - Journal entries
-- - Academy progress
-- - Market data cache
```

## 🎯 Key Features for Lovable

### Component Structure

Each major component has two versions:
- `Component.tsx` - Standard React component
- `Component.lovable.tsx` - Lovable-optimized version

### Styling

- Uses Tailwind CSS with custom theme
- Futuristic dark theme by default
- All colors use CSS variables for easy theming
- Responsive breakpoints configured

### State Management

- React Query for server state
- Context API for theme and auth
- Local storage for user preferences

### Routing

- React Router v6 with protected routes
- Lazy loading for performance
- Breadcrumb navigation support

## 📱 Responsive Design

All components are fully responsive:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🔧 Customization

### Theme Customization

Edit `src/styles/futuristic-theme.css`:

```css
:root {
  --primary: 219 100% 50%;
  --secondary: 267 100% 64%;
  --background: 240 10% 3.9%;
  /* ... more variables */
}
```

### Adding New Strategies

Add to `src/lib/vault/comprehensiveStrategies.ts`:

```typescript
{
  id: "21",
  name: "Your Strategy Name",
  description: "Strategy description",
  category: "Category",
  // ... other properties
}
```

### Adding New Courses

Add to `src/lib/academy/comprehensiveLessonData.ts`:

```typescript
{
  id: "new-course",
  title: "Course Title",
  lessons: [...],
  quizzes: [...]
}
```

## 🚀 Deployment

### Via Lovable

1. Connect your GitHub repository
2. Configure environment variables
3. Deploy with one click

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

## 📖 API Documentation

### Academy API
- `GET /api/academy/courses` - Get all courses
- `GET /api/academy/quiz/:lessonId` - Generate quiz for lesson
- `POST /api/academy/progress` - Update user progress

### Strategy API
- `GET /api/strategies` - Get all strategies
- `GET /api/strategies/:id` - Get strategy details
- `POST /api/strategies/backtest` - Run backtest

### Market API
- `GET /api/markets` - Get all market data
- `GET /api/markets/:symbol` - Get specific market
- `WS /api/markets/stream` - Real-time updates

## 🤝 Support

- **Lovable Community**: https://lovable.dev/community
- **Documentation**: https://docs.lovable.dev
- **GitHub Issues**: Report bugs and request features
- **Discord**: Join our Discord server

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Credits

Built with ❤️ using:
- [Lovable.dev](https://lovable.dev) - AI-powered development platform
- [React](https://reactjs.org) - UI framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Supabase](https://supabase.com) - Backend and database
- [shadcn/ui](https://ui.shadcn.com) - Component library

---

**Ready to start trading smarter?** Import this project to Lovable and customize it to your needs! 