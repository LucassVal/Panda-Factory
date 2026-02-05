/**
 * 🐼 Distribution Child - PWA Hook
 * =================================
 * Hook para deploy PWA direto (sem store)
 *
 * Custo: Grátis
 * Entrega: Link direto para instalação
 */

(function (window) {
  "use strict";

  const PARENT = "distribution";
  const CHILD_ID = "pwa";
  const TM = window.TentacleMonitor;

  // ==========================================
  // 🔧 PWA API
  // ==========================================
  const PWAHook = {
    id: CHILD_ID,
    name: "PWA Direct",
    icon: "📱",

    /**
     * Deploy as PWA (hosted)
     */
    async deploy(projectId, options = {}) {
      const {
        domain = null, // Custom domain or use panda subdomain
        version = "1.0.0",
      } = options;

      _log(`Deploying PWA for ${projectId}...`);

      // Generate PWA assets
      const manifest = await this._generateManifest(projectId, options);
      const sw = await this._generateServiceWorker(projectId);

      // Upload to hosting (Google Drive or Firebase)
      const hostingResult = await this._uploadToHosting(projectId, {
        manifest,
        serviceWorker: sw,
      });

      const url = domain
        ? `https://${domain}`
        : `https://${projectId}.panda.app`; // Future subdomain

      return {
        success: true,
        platform: "pwa",
        url,
        installUrl: `${url}?install=true`,
        manifest,
        version,
      };
    },

    /**
     * Generate Web App Manifest
     */
    async _generateManifest(projectId, options) {
      const project =
        (await window.Panda?.Data?.get?.("projects", projectId)) || {};

      return {
        name: options.name || project.name || "Panda App",
        short_name: options.shortName || project.shortName || "App",
        description: options.description || project.description || "",
        start_url: "/",
        display: "standalone",
        orientation: "any",
        background_color: options.bgColor || "#1a1a2e",
        theme_color: options.themeColor || "#4cc9f0",
        icons: [
          {
            src: "/icons/icon-72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/icons/icon-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/icons/icon-128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        screenshots: [],
        categories: ["productivity", "utilities"],
      };
    },

    /**
     * Generate Service Worker
     */
    async _generateServiceWorker(projectId) {
      return `
// Panda PWA Service Worker - ${projectId}
const CACHE_NAME = 'panda-${projectId}-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache
const ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/manifest.json',
  '/offline.html',
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});
      `.trim();
    },

    /**
     * Upload to hosting
     */
    async _uploadToHosting(projectId, assets) {
      // In production: upload to Firebase Hosting or Google Drive
      await _delay(500);

      return {
        success: true,
        hostingId: `hosting_${Date.now()}`,
      };
    },

    /**
     * Get analytics
     */
    async getAnalytics(projectId, period) {
      return {
        platform: "pwa",
        installs: 0, // Would come from service worker analytics
        activeUsers: 0,
      };
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function _log(message) {
    console.log(`📱 [Dist/PWA] ${message}`);
    TM?.log?.("info", `${PARENT}:${CHILD_ID}`, message);
  }

  const _delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  const register = () => {
    if (window.DistributionParent) {
      window.DistributionParent.registerChild(CHILD_ID, PWAHook);
      _log("✓ PWA hook ready");
    } else {
      setTimeout(register, 100);
    }
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register);
  }

  window.PWAHook = PWAHook;
})(window);
