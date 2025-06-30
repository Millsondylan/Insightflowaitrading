# InsightFlow AI Trading Platform

Advanced AI-powered trading platform for market analysis, strategy development, and AI-enhanced trading.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Lovable Deployment

This project is configured for deployment on Lovable.dev with multiple deployment options:

### Option 1: Ultra-Minimal Server (Recommended)

For the most reliable Lovable deployment, use the minimal server approach:

1. Set up environment variables in the Lovable dashboard (see [LOVABLE-DEPLOYMENT.md](./LOVABLE-DEPLOYMENT.md))
2. Use the following deployment settings in Lovable:
   - **Start Command**: `node lovable-minimal-server.js`
   - **Build Command**: Skip or use `echo 'Skipping build'`

This approach creates a self-contained Express server that handles static file serving and API endpoints.

### Option 2: Full Application

For the complete application with all features:

1. Set the required environment variables (DATABASE_URL, SUPABASE_KEY, etc.)
2. Set Lovable's deployment settings:
   - **Start Command**: `npm run lovable:full`
   - **Build Command**: `npm run build`

## Features

- AI-powered trading strategy development
- Real-time market analysis with ML insights
- Trading journal with AI reflection
- Strategy backtesting
- Portfolio analytics
- Community features and multiplayer
- Extensive learning resources
- Customizable dashboard

## Environment Setup

Copy the example environment file:

```bash
cp lovable.env .env
```

Update with your own credentials:

```
DATABASE_URL=your_supabase_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Project Structure

- `/client` - Frontend (React, Vite)
- `/server` - Backend API
- `/shared` - Shared types and utilities
- `/supabase` - Database migrations and schemas

## Documentation

- [Lovable Deployment Guide](./LOVABLE-DEPLOYMENT.md)
- [API Documentation](./API.md)
- [Development Guide](./DEVELOPMENT.md)

## License

Copyright (c) 2024 InsightFlow AI. All rights reserved. 