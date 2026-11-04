import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        onlyExplicitManualChunks: true,
        manualChunks(id) {
          if (id.includes("/three/")) return "three";
          if (id.includes("@react-three")) return "scene-runtime";
        },
      },
    },
  },
});
