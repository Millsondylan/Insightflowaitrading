module.exports = {
  // Framework detection
  framework: 'react',
  buildTool: 'vite',
  
  // Source directory
  sourceDir: 'client-legacy',
  
  // Entry points
  entryPoints: {
    main: 'src/main.tsx',
    app: 'src/App.tsx'
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: false // For development
  },
  
  // Development server
  devServer: {
    port: 3000,
    host: true
  },
  
  // Dependencies
  dependencies: {
    react: '^18.3.1',
    'react-dom': '^18.3.1',
    vite: '^7.0.0',
    '@vitejs/plugin-react': '^4.6.0'
  },
  
  // Lovable specific settings
  lovable: {
    supportsTailwind: true,
    editableComponents: true,
    visualEditing: true,
    componentLibrary: 'radix-ui',
    styling: 'tailwindcss'
  },
  
  // File patterns to include
  include: [
    'client-legacy/src/**/*.{ts,tsx,js,jsx}',
    'client-legacy/src/**/*.css',
    'client-legacy/index.html',
    'client-legacy/package.json',
    'client-legacy/vite.config.ts',
    'client-legacy/tailwind.config.js',
    'client-legacy/tsconfig.json'
  ],
  
  // File patterns to exclude
  exclude: [
    'node_modules/**',
    'dist/**',
    'build/**',
    '.next/**',
    'app/**', // Exclude Next.js app directory
    'server/**',
    'supabase/**'
  ]
}; 