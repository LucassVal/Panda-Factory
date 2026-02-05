/**
 * 🐼 Distribution Child - Panda Arcade Hook
 * ==========================================
 * Hook para deploy interno no Panda Arcade
 *
 * Custo: Grátis (interno)
 * Vantagem: Integração total com Panda Wallet, tokens, achievements
 */

(function (window) {
  "use strict";

  const PARENT = "distribution";
  const CHILD_ID = "arcade";
  const TM = window.TentacleMonitor;

  // ==========================================
  // 🔧 PANDA ARCADE API
  // ==========================================
  const ArcadeHook = {
    id: CHILD_ID,
    name: "Panda Arcade",
    icon: "🕹️",

    /**
     * Deploy game to Panda Arcade
     */
    async deploy(projectId, options = {}) {
      const {
        version = "1.0.0",
        price = 0, // 0 = Free to play
        category = "casual",
        tags = [],
        ageRating = "E", // E, T, M
      } = options;

      _log(`Deploying to Panda Arcade: ${projectId}...`);

      // Validate project
      const project = await window.Panda?.Data?.get?.("projects", projectId);
      if (!project) {
        return { success: false, error: "Project not found" };
      }

      // Create arcade listing
      const listing = await window.Panda?.Data?.save?.("arcade_games", {
        projectId,
        title: project.name || "Untitled Game",
        description: project.description || "",
        version,
        price,
        category,
        tags,
        ageRating,
        developer: (await window.Panda?.Auth?.getUser?.()?.uid) || "anonymous",
        publishedAt: Date.now(),
        status: "published",
        stats: {
          plays: 0,
          ratings: [],
          avgRating: 0,
        },
      });

      return {
        success: true,
        platform: "panda_arcade",
        listingId: listing?.id,
        url: `/arcade/play/${listing?.id || projectId}`,
        embedUrl: `/arcade/embed/${listing?.id || projectId}`,
        version,
        price: price === 0 ? "Free" : `${price} PC`,
      };
    },

    /**
     * Update existing listing
     */
    async update(listingId, updates) {
      const listing = await window.Panda?.Data?.get?.(
        "arcade_games",
        listingId,
      );
      if (!listing) {
        return { success: false, error: "Listing not found" };
      }

      await window.Panda?.Data?.save?.("arcade_games", {
        ...listing,
        ...updates,
        updatedAt: Date.now(),
      });

      return { success: true, listingId };
    },

    /**
     * Unpublish from arcade
     */
    async unpublish(listingId) {
      await this.update(listingId, { status: "unpublished" });
      return { success: true, listingId };
    },

    /**
     * Get analytics from Panda Arcade
     */
    async getAnalytics(projectId, period) {
      // Get from internal database
      const listing = await window.Panda?.Data?.list?.("arcade_games", {
        where: [["projectId", "==", projectId]],
        limit: 1,
      });

      if (!listing?.length) {
        return { platform: "panda_arcade", error: "Not published" };
      }

      const game = listing[0];

      // Get play sessions
      const plays =
        (await window.Panda?.Data?.list?.("arcade_sessions", {
          where: [["gameId", "==", game.id]],
          orderBy: [["startedAt", "desc"]],
          limit: 100,
        })) || [];

      return {
        platform: "panda_arcade",
        listingId: game.id,
        plays: game.stats?.plays || plays.length,
        avgRating: game.stats?.avgRating || 0,
        totalRatings: game.stats?.ratings?.length || 0,
        revenue: game.price > 0 ? plays.length * game.price * 0.95 : 0, // 95% to dev
        period,
      };
    },

    /**
     * Get categories
     */
    getCategories() {
      return [
        "action",
        "adventure",
        "arcade",
        "casual",
        "puzzle",
        "racing",
        "rpg",
        "simulation",
        "sports",
        "strategy",
      ];
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function _log(message) {
    console.log(`🕹️ [Dist/Arcade] ${message}`);
    TM?.log?.("info", `${PARENT}:${CHILD_ID}`, message);
  }

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  const register = () => {
    if (window.DistributionParent) {
      window.DistributionParent.registerChild(CHILD_ID, ArcadeHook);
      _log("✓ Panda Arcade hook ready");
    } else {
      setTimeout(register, 100);
    }
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register);
  }

  window.ArcadeHook = ArcadeHook;
})(window);
