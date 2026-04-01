import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "import.meta.env.ENV": JSON.stringify(env.ENV ?? ""),
    },
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
  };
});
