import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "insightflow",
  e2e: {
    baseUrl: 'http://localhost:8085',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    // Environment variables can be added here
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite"
    }
  },
  viewportWidth: 1280,
  viewportHeight: 800,
}); 