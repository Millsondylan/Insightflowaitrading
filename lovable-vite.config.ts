import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { componentTagger } from "lovable-tagger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Special Vite configuration for Lovable deployment
 * Uses a simplified entry point to guarantee rendering
 */
export default defineConfig({
  plugins: [
    react(),
    componentTagger(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "client/src/lovable-entry.tsx"),
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  root: path.resolve(__dirname, "client"),
}); 