import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client-legacy/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    },
  },
  root: path.resolve(__dirname, "client-legacy"),
  define: {
    __IS_LOVABLE__: true,
    __FRAMEWORK__: '"react"',
    __BUILD_TOOL__: '"vite"'
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'client-legacy/index.html')
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
}); 