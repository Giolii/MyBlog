import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import autoprefixer from "autoprefixer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: [
      "myblog-production-0b77.up.railway.app",
      "*.up.railway.app", // This will allow all railway subdomains
    ],
  },
});
