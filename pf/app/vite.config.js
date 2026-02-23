import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "panda-192.png",
        "panda-512.png",
      ],
      manifest: {
        name: "Panda Factory — AI Workspace",
        short_name: "Panda Factory",
        description:
          "AI-powered workspace for creators, developers, and entrepreneurs.",
        theme_color: "#0a0a16",
        background_color: "#0a0a16",
        display: "standalone",
        start_url: "./",
        scope: "./",
        orientation: "any",
        categories: ["productivity", "business", "developer"],
        icons: [
          {
            src: "panda-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "panda-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  base: "./",
  build: {
    outDir: "../dist/jam",
    emptyOutDir: true,
  },
  server: {
    port: 3001,
    cors: true,
  },
});
