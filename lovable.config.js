module.exports = {
  project: {
    name: "Insight Flow AI Trading",
    description: "AI-powered trading strategy builder and portfolio management platform",
    version: "2.0.0",
    repository: {
      type: "git",
      url: "https://github.com/yourusername/Insightflowaitrading"
    },
    techStack: {
      framework: "react",
      language: "typescript",
      styling: "tailwindcss",
      buildTool: "vite",
      database: "supabase"
    }
  },
  entry: {
    client: "src/App.tsx",
    server: null
  },
  visualEditing: {
    enabled: true,
    supportsTailwind: true,
    componentExtension: ".lovable.tsx",
    stableIdStrategy: "attribute-based"
  },
  components: {
    sourcePath: "src/components",
    modules: "src/modules",
    pages: "src/pages"
  },
  paths: {
    assets: "public",
    styles: "src/styles",
    config: "src/lib/config.ts"
  },
  features: {
    componentLibrary: true,
    visualEditing: true,
    aiGeneration: true,
    themeSupport: true,
    responsivePreview: true,
    componentSearch: true,
    propEditing: true,
    exportToCode: true
  },
  integration: {
    supabase: {
      enabled: true
    },
    github: {
      enabled: true,
      autoCommit: false
    }
  },
  apps: [
    {
      name: "web",
      type: "nextjs",
      root: ".",
      buildCommand: "pnpm run build",
      startCommand: "pnpm start",
      testCommand: "npx lovable test:web"
    },
    {
      name: "mobile",
      type: "expo",
      root: "expo-app",
      buildCommand: "expo build",
      startCommand: "expo start --dev-client --non-interactive",
      testCommand: "npx lovable test:mobile"
    }
  ],
  qa: {
    enabled: true,
    pipelines: {
      web: "lovable test:web",
      mobile: "lovable test:mobile",
      backend: "lovable test:backend"
    },
    blockOnFailure: true
  }
}; 