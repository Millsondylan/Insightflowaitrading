# InsightFlow AI Trading Platform

A full-stack AI-powered trading platform built with React, TypeScript, and Vite, fully compatible with Lovable.dev.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Git

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/insightflowaitrading.git
cd insightflowaitrading
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

This will start both the frontend and backend services.

### Building for Production

```bash
npm run build
```

This will:
- Build the frontend with Vite
- Bundle the server-side code with esbuild

### Running Production Build

After building:
```bash
npm start
```

## 📱 Lovable.dev Integration

### Setting Up on Lovable

1. Log in to your Lovable.dev account
2. Create a new project or select an existing one
3. Connect to your GitHub repository with the following URL: `https://github.com/yourusername/insightflowaitrading.git`

### Build Configuration

Ensure your Lovable.dev project uses the following build commands:

- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Install Command:** `npm install`

### Lovable Preview URL

Once deployed, your project will be available at:
`https://[your-project-name].lovable.dev`

### Syncing Changes with Lovable.dev

1. After making local changes, commit and push to GitHub:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

2. Lovable will automatically detect changes and rebuild your project. To force a sync:
   - Go to your project on Lovable.dev
   - Click "Settings"
   - Click "Sync Now" button

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=your_database_url
API_KEY=your_api_key
PORT=3000
```

### Database Setup

This project uses Supabase. To set up:

1. Create a Supabase project
2. Run migrations:
```bash
npm run migrate
```

## 📚 Project Structure

```
insightflowaitrading/
├── client/               # Frontend React code
│   ├── public/           # Static assets
│   └── src/              # Source code
│       ├── components/   # React components
│       ├── pages/        # Page components
│       ├── lib/          # Utility functions
│       └── modules/      # Feature modules
├── server/               # Backend code
├── supabase/             # Database migrations
└── shared/               # Shared types and utilities
```

## ⚠️ Troubleshooting

### Common Issues

1. **TypeScript Errors**: If you encounter TypeScript errors, ensure all modules are properly imported:
```bash
npx tsc --noEmit
```

2. **Build Failures**: Make sure you have the latest dependencies:
```bash
npm update
```

3. **Lovable Sync Issues**: Verify your GitHub repository is correctly connected and your build commands match the ones in this README.

## 🛠️ Testing

Run the test suite:
```bash
npm test
```

## 🚀 Deployment

For deployment beyond Lovable.dev, build the project and deploy the `dist` directory to your preferred hosting service. 