
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    // Restrict to localhost in development mode
    host: mode === "development" ? "localhost" : "0.0.0.0",
    port: 8080,
    // Set CORS headers for development server
    cors: {
      origin: mode === "development" 
        ? "http://localhost:8080" 
        : "324d0fc3-9056-4d88-b33e-7111454bd4a6.lovableproject.com",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true
    },
    // Explicit allowedHosts configuration
    allowedHosts: [
      "localhost",
      "127.0.0.1",
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
  },
}));
