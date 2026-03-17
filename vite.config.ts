import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/components/utils"),
      "@errors": path.resolve(__dirname, "src/errors"),
      "@services": path.resolve(__dirname, "src/components/services"),
      "@ui": path.resolve(__dirname, "src/components/ui"),
    },
  },
  plugins: [react(), tailwindcss(), svgr({
    svgrOptions: {
      icon: true
    }
  })],
})
