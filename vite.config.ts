
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  esbuild: {
    logOverride: {
      'jsx-syntax': 'silent',
      'jsx-tag-mismatch': 'silent',
      'jsx-no-self-closing': 'silent',
      'unterminated-regexp': 'silent',
    },
  },
  build: {
    minify: 'development',
    sourcemap: 'development',
  },
});
