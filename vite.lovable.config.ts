import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom plugin for Lovable.dev compatibility
    {
      name: 'lovable-component-ids',
      transform(code, id) {
        // Add stable IDs to JSX elements for Lovable Visual Editing
        if (id.endsWith('.lovable.tsx') || id.endsWith('.lovable.jsx')) {
          // This is a simplified version of what Lovable.dev would do
          // In a real implementation, this would use an AST parser
          return code;
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Special configuration for Lovable.dev builds
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'lovable-vendor': ['react-router-dom', '@tanstack/react-query'],
        },
      },
    },
  },
});
