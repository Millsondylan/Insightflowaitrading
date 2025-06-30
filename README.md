# InsightFlow AI Trading Platform

A full-stack AI-powered trading platform built with React, TypeScript, and Vite, fully compatible with Lovable.dev.

## ⚠️ LOVABLE DEPLOYMENT - READ THIS FIRST

If you're experiencing white screens on Lovable, use this ultra-simple approach:

### Lovable Setup (Guaranteed to Work)

1. Configure your Lovable project with these exact settings:

```
Framework: Node.js
Build Command: echo 'Skipping build process for Lovable deployment'
Start Command: node lovable-minimal-server.js
Install Command: npm install express
```

2. That's it! This will bypass the React build process entirely and serve a simple static page.

The `lovable-minimal-server.js` will:
- Set up a simple Express server
- Create the minimal HTML page
- Handle all routes automatically

This approach requires no build step and will always work, even when React has issues.

## 🚀 Standard Setup (For Local Development)

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

## 📚 Project Structure

```
insightflowaitrading/
├── client/               # Frontend React code
├── server/               # Backend code
├── public/               # Static assets
├── minimal-server.js     # Simple Express server
└── lovable-minimal-server.js  # Self-contained server for Lovable
```

## ⚠️ Troubleshooting

### White Screen Issues

If you encounter white screens or rendering issues:

1. For local testing:
```bash
npm run minimal-start
```

2. For Lovable, follow the ultra-simple approach at the top of this README.

## 🛠️ Need More Help?

See `LOVABLE.md` or `ULTRA-MINIMAL-SETUP.md` for additional deployment options. 