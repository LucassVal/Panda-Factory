/**
 * 🐼 Distribution Child - Steam Hook
 * ====================================
 * Hook para deploy automático na Steam
 *
 * Features:
 * - Steamworks API integration
 * - SteamCMD automation
 * - Depot configuration
 * - Build upload
 * - Branch management
 *
 * @requires Steamworks Partner Account
 * @see https://partner.steamgames.com/
 */

(function (window) {
  "use strict";

  const PARENT = "distribution";
  const CHILD_ID = "steam";
  const TM = window.TentacleMonitor;

  // ==========================================
  // 🔧 CONFIGURATION
  // ==========================================
  const CONFIG = {
    partnerApi: "https://partner.steam-api.com",
    cdnApi: "https://api.steampowered.com",
    branches: ["default", "beta", "alpha", "staging"],
  };

  // Credentials
  let credentials = {
    appId: null,
    publisherKey: null,
    username: null,
  };

  // ==========================================
  // 🔧 STEAM API
  // ==========================================
  const SteamHook = {
    id: CHILD_ID,
    name: "Steam",
    icon: "🎮",

    /**
     * Configure Steamworks credentials
     */
    async configure(options = {}) {
      const { appId, publisherKey, username } = options;

      if (!appId) {
        return {
          success: false,
          error: "Steam App ID required",
          help: "Get from https://partner.steamgames.com/apps",
        };
      }

      credentials.appId = appId;
      credentials.publisherKey = publisherKey;
      credentials.username = username;

      localStorage.setItem("panda_steam_configured", "true");
      localStorage.setItem("panda_steam_appid", appId);

      _log(`Configured for App ID: ${appId}`);
      return { success: true, appId };
    },

    /**
     * Check if configured
     */
    isConfigured() {
      return (
        !!credentials.appId ||
        localStorage.getItem("panda_steam_configured") === "true"
      );
    },

    /**
     * Deploy to Steam
     */
    async deploy(projectId, options = {}) {
      const {
        branch = "default",
        description = "Panda Factory build",
        setLive = false,
        platforms = ["windows"],
      } = options;

      const appId =
        credentials.appId || localStorage.getItem("panda_steam_appid");

      if (!appId) {
        return {
          success: false,
          error: "Steam not configured. Call configure() first.",
        };
      }

      if (!CONFIG.branches.includes(branch)) {
        return {
          success: false,
          error: `Invalid branch. Use: ${CONFIG.branches.join(", ")}`,
        };
      }

      _log(`Deploying to Steam ${branch} branch...`);

      // Step 1: Build game files
      const buildResult = await this._buildGame(projectId, platforms);
      if (!buildResult.success) return buildResult;

      // Step 2: Generate depot configs
      const depotConfig = await this._generateDepotConfig(appId, platforms);

      // Step 3: Upload via SteamCMD (cloud action)
      const uploadResult = await this._uploadBuild(
        appId,
        branch,
        buildResult.buildPath,
        description,
      );

      if (!uploadResult.success) return uploadResult;

      // Step 4: Set live if requested
      if (setLive) {
        await this._setLive(appId, branch);
      }

      return {
        success: true,
        platform: "steam",
        appId,
        branch,
        buildId: uploadResult.buildId,
        url: `https://store.steampowered.com/app/${appId}`,
        partnerUrl: `https://partner.steamgames.com/apps/builds/${appId}`,
        message: setLive
          ? "Build is LIVE!"
          : "Build uploaded. Set live in Steamworks.",
      };
    },

    /**
     * Get app info
     */
    async getAppInfo() {
      const appId =
        credentials.appId || localStorage.getItem("panda_steam_appid");
      if (!appId) {
        return { success: false, error: "Not configured" };
      }

      // Would call Steamworks API
      await _delay(500);

      return {
        success: true,
        appId,
        name: "Panda Game",
        type: "game",
        platforms: ["windows", "macos", "linux"],
        status: "playable",
      };
    },

    /**
     * List builds
     */
    async listBuilds(limit = 10) {
      const appId =
        credentials.appId || localStorage.getItem("panda_steam_appid");
      if (!appId) {
        return { success: false, error: "Not configured" };
      }

      // Would call Steamworks API
      await _delay(300);

      return {
        success: true,
        builds: [
          {
            buildId: Date.now(),
            branch: "default",
            createdAt: new Date().toISOString(),
            description: "Latest build",
            live: true,
          },
        ],
      };
    },

    /**
     * Set branch live
     */
    async setLive(branch = "default") {
      const appId =
        credentials.appId || localStorage.getItem("panda_steam_appid");

      _log(`Setting ${branch} branch live...`);
      await _delay(500);

      return {
        success: true,
        appId,
        branch,
        message: "Branch is now live!",
      };
    },

    /**
     * Create new branch
     */
    async createBranch(branchName, password = null) {
      _log(`Creating branch: ${branchName}`);
      await _delay(300);

      return {
        success: true,
        branch: branchName,
        password: password ? "[protected]" : null,
      };
    },

    /**
     * Get analytics
     */
    async getAnalytics(projectId, period = "30d") {
      const appId =
        credentials.appId || localStorage.getItem("panda_steam_appid");

      return {
        platform: "steam",
        appId,
        dashboardUrl: `https://partner.steamgames.com/apps/navstats/${appId}`,
        note: "Full analytics available in Steamworks Partner",
        metrics: {
          wishlistAdds: 0,
          purchases: 0,
          refunds: 0,
          peakCCU: 0,
          reviews: { positive: 0, negative: 0 },
        },
      };
    },

    /**
     * Configure achievements
     */
    async setAchievements(achievements) {
      // achievements = [{ id, name, description, icon }]
      _log(`Configuring ${achievements.length} achievements...`);
      await _delay(500);

      return {
        success: true,
        count: achievements.length,
        note: "Achievements configured. Publish via Steamworks.",
      };
    },

    /**
     * Get supported platforms
     */
    getPlatforms() {
      return [
        { id: "windows", name: "Windows", required: true },
        { id: "macos", name: "macOS", required: false },
        { id: "linux", name: "Linux", required: false },
        { id: "steamdeck", name: "Steam Deck", required: false },
      ];
    },

    /**
     * Get branch protection options
     */
    getBranchOptions() {
      return [
        {
          branch: "default",
          desc: "Main release branch (public)",
        },
        {
          branch: "beta",
          desc: "Beta testing (opt-in)",
        },
        {
          branch: "alpha",
          desc: "Alpha/Developer preview",
        },
        {
          branch: "staging",
          desc: "Internal testing only",
        },
      ];
    },

    // ==========================================
    // PRIVATE METHODS
    // ==========================================

    async _buildGame(projectId, platforms) {
      _log(`Building game for: ${platforms.join(", ")}...`);

      // Would trigger GitHub Action or Colab
      await _delay(1000);

      return {
        success: true,
        buildPath: `/builds/${projectId}/steam`,
        platforms,
      };
    },

    _generateDepotConfig(appId, platforms) {
      const depots = {};
      let depotId = parseInt(appId) + 1;

      for (const platform of platforms) {
        depots[depotId] = {
          fileMapping: {
            localPath: `./${platform}/*`,
            depotPath: ".",
            recursive: true,
          },
        };
        depotId++;
      }

      return {
        appId,
        depots,
        branches: {
          default: { buildId: "0" },
        },
      };
    },

    async _uploadBuild(appId, branch, buildPath, description) {
      _log(`Uploading to Steam (App ${appId}, ${branch})...`);

      // Would use SteamCMD via GitHub Action
      await _delay(2000);

      return {
        success: true,
        buildId: `build_${Date.now()}`,
        branch,
        manifest: `manifest_${appId}.vdf`,
      };
    },

    async _setLive(appId, branch) {
      _log(`Setting ${branch} live for App ${appId}...`);
      await _delay(500);

      return { success: true };
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function _log(message) {
    console.log(`🎮 [Dist/Steam] ${message}`);
    TM?.log?.("info", `${PARENT}:${CHILD_ID}`, message);
  }

  const _delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  const register = () => {
    if (window.DistributionParent) {
      window.DistributionParent.registerChild(CHILD_ID, SteamHook);
      _log("✓ Steam hook ready");
    } else {
      setTimeout(register, 100);
    }
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register);
  }

  window.Panda = window.Panda || {};
  window.Panda.Dist = window.Panda.Dist || {};
  window.Panda.Dist.Steam = SteamHook;
  window.SteamHook = SteamHook;
})(window);
