
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    // Add the allowed host
    allowedHosts: [
      "324d0fc3-9056-4d88-b33e-7111454bd4a6.lovableproject.com"
    ],
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    emptyOutDir: false, // ✅ jangan hapus dist saat build
    rollupOptions: {
      external: ['react-quill']
    }
  },
}));
