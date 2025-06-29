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
  }
}; 