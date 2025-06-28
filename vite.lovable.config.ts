import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'src/lovable-demo'),
  base: './',
  build: {
    outDir: resolve(__dirname, 'dist/lovable'),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
}); 