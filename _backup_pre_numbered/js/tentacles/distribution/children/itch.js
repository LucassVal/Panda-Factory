/**
 * 🐼 Distribution Child - itch.io Hook
 * =====================================
 * Hook para deploy automático no itch.io
 *
 * Usa Butler CLI (oficial) para upload
 * Custo: Grátis (itch não cobra)
 *
 * @requires Butler CLI ou cloud build
 */

(function (window) {
  "use strict";

  const PARENT = "distribution";
  const CHILD_ID = "itch";
  const TM = window.TentacleMonitor;

  // ==========================================
  // 🔧 ITCH.IO API
  // ==========================================
  const ItchHook = {
    id: CHILD_ID,
    name: "itch.io",
    icon: "🎮",

    /**
     * Deploy game to itch.io
     * @param {string} projectId
     * @param {object} options - { channel, version, userSlash }
     */
    async deploy(projectId, options = {}) {
      const {
        channel = "web",
        version = "1.0.0",
        userSlash = null, // "username/game-name"
      } = options;

      if (!userSlash) {
        return {
          success: false,
          error: "userSlash required (ex: 'yourname/game-name')",
        };
      }

      _log(`Deploying to itch.io: ${userSlash}...`);

      // In production: trigger Butler via GitHub Action
      // Butler command: butler push ./build itch.io/username/game:channel
      const buildJob = await this._triggerButlerDeploy(projectId, {
        userSlash,
        channel,
        version,
      });

      return {
        success: true,
        platform: "itch.io",
        url: `https://${userSlash.split("/")[0]}.itch.io/${userSlash.split("/")[1]}`,
        buildId: buildJob.id,
        channel,
        version,
      };
    },

    /**
     * Get analytics from itch.io
     */
    async getAnalytics(projectId, period) {
      // itch.io analytics requires scraping or API access
      return {
        platform: "itch.io",
        note: "Analytics via itch.io dashboard",
        dashboardUrl: "https://itch.io/dashboard",
      };
    },

    /**
     * Get available channels
     */
    getChannels() {
      return ["web", "windows", "linux", "mac", "android"];
    },

    /**
     * Trigger Butler deploy via cloud
     */
    async _triggerButlerDeploy(projectId, config) {
      // Mock - in production: GitHub Action
      await _delay(500);

      return {
        id: `butler_${Date.now()}`,
        command: `butler push ./build/${projectId} ${config.userSlash}:${config.channel} --userversion ${config.version}`,
        status: "queued",
      };
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function _log(message) {
    console.log(`🎮 [Dist/itch] ${message}`);
    TM?.log?.("info", `${PARENT}:${CHILD_ID}`, message);
  }

  const _delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  const register = () => {
    if (window.DistributionParent) {
      window.DistributionParent.registerChild(CHILD_ID, ItchHook);
      _log("✓ itch.io hook ready");
    } else {
      setTimeout(register, 100);
    }
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register);
  }

  window.ItchHook = ItchHook;
})(window);
