import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    // Optional: proxy /health to a local API during dev if you hit CORS — uncomment and adjust.
    // proxy: { '/health': { target: 'http://localhost:8000', changeOrigin: true } },
  },
});
