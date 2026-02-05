/**
 * 🐼 Distribution Tentacle - Parent
 * ==================================
 * Gerencia distribuição multi-plataforma com 1-click deploy
 *
 * Plataformas suportadas:
 * - Mobile: Google Play, PWA, APK direto
 * - Gaming: Steam, Epic, itch.io, Panda Arcade
 * - Dev: VS Code, NPM, Chrome Extensions
 * - EdTech: Kiwify, Hotmart
 *
 * @version 1.0.0
 * @requires pf.sdk.js, TentacleMonitor
 */

(function (window) {
  "use strict";

  const TENTACLE_ID = "distribution";
  const TM = window.TentacleMonitor;

  // Registro de children (hooks de plataformas)
  const children = new Map();

  // ==========================================
  // 💰 COSTS (PC por operação)
  // ==========================================
  const COSTS = {
    BUILD_ANDROID: 500,
    BUILD_WEB: 50,
    BUILD_DESKTOP: 1000,
    DEPLOY_PLAY_STORE: 200,
    DEPLOY_ITCH: 50,
    DEPLOY_STEAM: 500,
    DEPLOY_PWA: 0, // Grátis
    DEPLOY_ARCADE: 0, // Interno
  };

  // ==========================================
  // 📦 PARENT API
  // ==========================================
  const DistributionParent = {
    id: TENTACLE_ID,

    /**
     * Initialize tentacle
     */
    init() {
      TM?.registerTentacle(TENTACLE_ID, { category: "distribution" });
      TM?.registerParent(TENTACLE_ID, "Panda.Dist");
      TM?.log("info", TENTACLE_ID, "📦 Distribution Tentacle initialized");
    },

    /**
     * Register a platform hook (child)
     */
    registerChild(name, childApi) {
      children.set(name, {
        api: childApi,
        status: "ready",
        registeredAt: Date.now(),
      });

      TM?.registerChild(TENTACLE_ID, name);
      TM?.setStatus(`${TENTACLE_ID}:${name}`, "ready");
      this.api[name] = this._wrapChild(name, childApi);
      TM?.log("success", `${TENTACLE_ID}:${name}`, `✓ ${name} hook ready`);
    },

    /**
     * Wrap child methods with FAULT ISOLATION + TELEMETRY
     * If a child hook crashes, it won't bring down the parent
     * Reports all activities to Founder Dashboard
     */
    _wrapChild(name, childApi) {
      const wrapped = {};
      const AT = window.AgentTelemetry;

      Object.keys(childApi).forEach((method) => {
        if (typeof childApi[method] === "function") {
          wrapped[method] = async (...args) => {
            const start = Date.now();

            try {
              const result = await Promise.race([
                childApi[method](...args),
                new Promise((_, reject) =>
                  setTimeout(
                    () => reject(new Error(`Timeout: ${name}.${method}`)),
                    30000,
                  ),
                ),
              ]);

              // Report success to Founder Dashboard
              AT?.report?.(`${TENTACLE_ID}:${name}`, method, {
                success: result?.success !== false,
                duration: Date.now() - start,
                cost: result?.cost,
              });

              return result;
            } catch (error) {
              console.error(
                `🔴 [${name}] Hook error in ${method}:`,
                error.message,
              );
              TM?.setStatus(`${TENTACLE_ID}:${name}`, "error");

              // Report error to Founder Dashboard
              AT?.reportError?.(`${TENTACLE_ID}:${name}`, error, { method });

              return {
                success: false,
                error: error.message,
                hook: name,
                method: method,
                isolated: true,
              };
            }
          };
        } else {
          wrapped[method] = childApi[method];
        }
      });
      return wrapped;
    },

    // ==========================================
    // 🔧 CORE API
    // ==========================================
    api: {
      /**
       * Configure credentials for a platform
       */
      async configure(platform, credentials) {
        const stored = await _loadCredentials();
        stored[platform] = {
          ...credentials,
          configuredAt: Date.now(),
        };
        await _saveCredentials(stored);
        _log(`Configured credentials for ${platform}`);
        return { success: true, platform };
      },

      /**
       * Get configured platforms
       */
      async getConfigured() {
        const stored = await _loadCredentials();
        return Object.keys(stored);
      },

      /**
       * Build project for target platforms
       */
      async build(projectId, targets = ["web"]) {
        const results = {};

        for (const target of targets) {
          _log(`Building for ${target}...`);

          const cost = COSTS[`BUILD_${target.toUpperCase()}`] || 100;
          await _charge(cost, `DIST_BUILD_${target.toUpperCase()}`);

          // Dispatch to appropriate builder
          switch (target) {
            case "android":
              results[target] = await this._buildAndroid(projectId);
              break;
            case "web":
            case "pwa":
              results[target] = await this._buildPWA(projectId);
              break;
            case "desktop":
              results[target] = await this._buildDesktop(projectId);
              break;
            default:
              results[target] = { error: `Unknown target: ${target}` };
          }
        }

        return results;
      },

      /**
       * Deploy to platform (1-click)
       */
      async deploy(projectId, platform, options = {}) {
        _log(`Deploying ${projectId} to ${platform}...`);

        // Check if hook exists
        const hook = children.get(platform);
        if (!hook) {
          return { success: false, error: `No hook for platform: ${platform}` };
        }

        // Charge for deploy
        const cost = COSTS[`DEPLOY_${platform.toUpperCase()}`] || 100;
        if (cost > 0) {
          await _charge(cost, `DIST_DEPLOY_${platform.toUpperCase()}`);
        }

        // Execute deploy via hook
        const result = await hook.api.deploy(projectId, options);

        // Log deployment
        await window.Panda?.Data?.save?.("deployments", {
          projectId,
          platform,
          version: options.version || "1.0.0",
          timestamp: Date.now(),
          result: result.success ? "success" : "failed",
        });

        return result;
      },

      /**
       * Deploy to multiple platforms at once
       */
      async deployAll(projectId, platforms, options = {}) {
        const results = {};

        for (const platform of platforms) {
          results[platform] = await this.deploy(projectId, platform, options);
        }

        return results;
      },

      /**
       * Get deployment status across all platforms
       */
      async getStatus(projectId) {
        const deployments =
          (await window.Panda?.Data?.list?.("deployments", {
            where: [["projectId", "==", projectId]],
            orderBy: [["timestamp", "desc"]],
            limit: 20,
          })) || [];

        const status = {};
        for (const dep of deployments) {
          if (!status[dep.platform]) {
            status[dep.platform] = dep;
          }
        }

        return status;
      },

      /**
       * Get analytics across platforms
       */
      async getAnalytics(projectId, period = "30d") {
        const analytics = {};

        for (const [name, child] of children) {
          if (child.api.getAnalytics) {
            analytics[name] = await child.api.getAnalytics(projectId, period);
          }
        }

        return analytics;
      },

      // ==========================================
      // BUILD HELPERS
      // ==========================================

      async _buildPWA(projectId) {
        _log("Building PWA...");

        // Generate manifest
        const manifest = await this._generateManifest(projectId);

        // Generate service worker
        const sw = await this._generateServiceWorker(projectId);

        return {
          success: true,
          manifest,
          serviceWorker: sw,
          assets: `/projects/${projectId}/build/pwa/`,
        };
      },

      async _buildAndroid(projectId) {
        _log("Building Android (via cloud)...");

        // This triggers GitHub Action or Colab
        const buildJob = await this._triggerCloudBuild(projectId, "android");

        return {
          success: true,
          buildId: buildJob.id,
          status: "queued",
          estimatedTime: "3-5 minutes",
          checkUrl: buildJob.statusUrl,
        };
      },

      async _buildDesktop(projectId) {
        _log("Building Desktop (via cloud)...");

        const buildJob = await this._triggerCloudBuild(projectId, "desktop");

        return {
          success: true,
          buildId: buildJob.id,
          status: "queued",
          targets: ["windows", "linux", "mac"],
        };
      },

      async _generateManifest(projectId) {
        const project =
          (await window.Panda?.Data?.get?.("projects", projectId)) || {};

        return {
          name: project.name || "Panda App",
          short_name: project.shortName || "App",
          start_url: "/",
          display: "standalone",
          background_color: project.bgColor || "#1a1a2e",
          theme_color: project.themeColor || "#4cc9f0",
          icons: [
            {
              src: project.icon || "/icons/icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: project.iconLarge || "/icons/icon-512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        };
      },

      async _generateServiceWorker(projectId) {
        return `
// Panda PWA Service Worker
const CACHE_NAME = 'panda-${projectId}-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});
        `.trim();
      },

      async _triggerCloudBuild(projectId, target) {
        // In production: trigger GitHub Action via API
        // For now: mock response
        return {
          id: `build_${Date.now()}`,
          statusUrl: `https://github.com/LucassVal/SAAS/actions/runs/${Date.now()}`,
          target,
          projectId,
        };
      },
    },

    /**
     * Get status of all hooks
     */
    getStatus() {
      const status = {};
      children.forEach((child, name) => {
        status[name] = child.status;
      });
      return status;
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function _log(message) {
    console.log(`📦 [Distribution] ${message}`);
    TM?.log?.("info", TENTACLE_ID, message);
  }

  async function _charge(amount, reason) {
    if (window.Panda?.Wallet?.charge) {
      const result = await window.Panda.Wallet.charge(amount, reason);
      if (!result?.success) {
        throw new Error(`Saldo insuficiente. Necessário: ${amount} PC`);
      }
    }
  }

  async function _loadCredentials() {
    try {
      const stored = localStorage.getItem("panda_dist_credentials");
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  async function _saveCredentials(creds) {
    localStorage.setItem("panda_dist_credentials", JSON.stringify(creds));
  }

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  if (window.Panda) {
    window.Panda.Dist = DistributionParent.api;
    window.Panda._tentacles = window.Panda._tentacles || {};
    window.Panda._tentacles.distribution = DistributionParent;
  }

  window.DistributionParent = DistributionParent;

  if (TM) {
    DistributionParent.init();
  }

  _log("Distribution Parent loaded");
})(window);
