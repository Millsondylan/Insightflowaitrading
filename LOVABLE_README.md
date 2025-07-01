# InsightFlow AI Trading Platform - Lovable Setup

## 🎯 For Lovable.dev Integration

This project contains both a Next.js app (root) and a React/Vite app (client-legacy). **For Lovable, use the React/Vite version.**

## 📁 Project Structure

```
├── app/                    # Next.js app (IGNORE for Lovable)
├── client-legacy/          # React/Vite app (USE for Lovable)
│   ├── src/
│   ├── package.json        # React/Vite dependencies
│   ├── vite.config.ts      # Vite configuration
│   └── index.html          # Entry point
├── lovable.config.json     # Lovable configuration
└── .lovableignore          # Files to ignore
```

## 🚀 Lovable Setup Instructions

### 1. **Select Root Directory**
When connecting to Lovable, select `client-legacy` as your root directory.

### 2. **Build Configuration**
- **Build Command**: `npm run build`
- **Dev Command**: `npm run dev`
- **Entry Point**: `src/main.tsx`

### 3. **Framework Detection**
This project is configured as:
- **Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Library**: Radix UI

## ✅ What's Included

- ✅ React 18 with TypeScript
- ✅ Vite build system
- ✅ Tailwind CSS styling
- ✅ Radix UI components
- ✅ All components have `lovable` exports
- ✅ Trading platform features
- ✅ AI-powered components

## 🔧 Configuration Files

- `lovable.config.json` - Main Lovable configuration
- `client-legacy/package.json` - React/Vite dependencies
- `client-legacy/vite.config.ts` - Vite build configuration
- `.lovableignore` - Files to exclude from Lovable

## 🎨 Visual Editing

All components include the `lovable` export for visual editing:

```tsx
export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
```

## 🚨 Troubleshooting

If Lovable detects the wrong language:
1. Make sure you selected `client-legacy` as root
2. Check that `lovable.config.json` is in the root
3. Verify `client-legacy/package.json` has `"framework": "react"`

## 📞 Support

If you encounter issues, check:
1. Build logs in Lovable
2. Framework detection in project settings
3. Entry point configuration

---

**Note**: This project is a full-stack trading platform. The `client-legacy` directory contains the frontend React app optimized for Lovable visual editing. 