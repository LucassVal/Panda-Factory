import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../..");

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
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
        shortcuts: [
          {
            name: "New Canvas",
            short_name: "Canvas",
            url: "./?action=canvas",
            icons: [{ src: "panda-192.png", sizes: "192x192" }],
          },
          {
            name: "Open Store",
            short_name: "Store",
            url: "./?action=store",
            icons: [{ src: "panda-192.png", sizes: "192x192" }],
          },
          {
            name: "AI Chat",
            short_name: "Chat",
            url: "./?action=chat",
            icons: [{ src: "panda-192.png", sizes: "192x192" }],
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,wasm}"],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api/],
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
          {
            urlPattern: /^https:\/\/script\.google\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "gas-api-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            urlPattern: /^https:\/\/.*\.firebaseio\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "firebase-cache",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 },
              networkTimeoutSeconds: 5,
            },
          },
        ],
      },
    }),
  ],
  base: "./",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
  server: {
    port: 3001,
    cors: true,
    fs: {
      // Allow serving files from the entire Panda Factory root (needed for panda-core WASM in 3.sdk/)
      strict: false,
      allow: [PROJECT_ROOT],
    },
    headers: {
      // TICKET-06: CSP + Security Headers (mirrors index.html meta tag)
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  },
});
