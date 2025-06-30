import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      tsDecorators: true,
    }),
  ],
  esbuild: {
    jsx: 'automatic',
    // Skip type checking
    tsconfigRaw: {
      compilerOptions: {
        skipLibCheck: true,
        // Skip all type checking
        checkJs: false,
        noEmit: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}); 