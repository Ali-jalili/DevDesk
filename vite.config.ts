/** @format */

import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({

  server: {
    host: '127.0.0.1',  // یا '0.0.0.0' که همهی اینترفیسها رو بگیره
    port: 5173,
    strictPort: true,
  },

  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
