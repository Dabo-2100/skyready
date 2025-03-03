import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: "https://skyready.online/",
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ["apexcharts", "react-apexcharts"],
  },
});
