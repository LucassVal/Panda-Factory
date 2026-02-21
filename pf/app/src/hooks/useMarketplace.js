/**
 * 🏪 useMarketplace Hook
 * =======================
 * Aggregates marketplace integrations for PFStore
 *
 * Supported Platforms:
 * - Kiwify (Education)
 * - Hotmart (Education)
 * - Eduzz (Education)
 * - Steam (Distribution)
 * - VS Code (Distribution)
 * - npm (Distribution)
 */

import { useState, useCallback, useEffect } from "react";

/**
 * Marketplace categories
 */
export const MarketplaceCategory = {
  EDUCATION: "education",
  GAMING: "gaming",
  DEVELOPER: "developer",
  CREATIVE: "creative",
};

/**
 * Platform configurations
 */
const PLATFORMS = {
  kiwify: {
    id: "kiwify",
    name: "Kiwify",
    icon: "🥝",
    category: MarketplaceCategory.EDUCATION,
    description: "Infoprodutos e cursos BR",
    configured: false,
    features: ["Webhooks", "Affiliates", "Subscriptions"],
  },
  hotmart: {
    id: "hotmart",
    name: "Hotmart",
    icon: "🔥",
    category: MarketplaceCategory.EDUCATION,
    description: "Maior plataforma BR/Global",
    configured: false,
    features: ["Webhooks", "Affiliates", "Subscriptions", "Club"],
  },
  eduzz: {
    id: "eduzz",
    name: "Eduzz",
    icon: "☀️",
    category: MarketplaceCategory.EDUCATION,
    description: "Infoprodutos com Sun",
    configured: false,
    features: ["Webhooks", "Affiliates", "Contracts"],
  },
  steam: {
    id: "steam",
    name: "Steam",
    icon: "🎮",
    category: MarketplaceCategory.GAMING,
    description: "Gaming PC marketplace",
    configured: false,
    features: ["Steamworks", "Achievements", "Workshop"],
  },
  googlePlay: {
    id: "google-play",
    name: "Google Play",
    icon: "📱",
    category: MarketplaceCategory.GAMING,
    description: "Android apps and games",
    configured: false,
    features: ["In-App Purchases", "Subscriptions"],
  },
  vscode: {
    id: "vscode",
    name: "VS Code",
    icon: "💻",
    category: MarketplaceCategory.DEVELOPER,
    description: "Extensions marketplace",
    configured: false,
    features: ["Extensions", "Themes", "Packs"],
  },
  npm: {
    id: "npm",
    name: "npm",
    icon: "📦",
    category: MarketplaceCategory.DEVELOPER,
    description: "Node packages",
    configured: false,
    features: ["Packages", "CLI Tools"],
  },
};

/**
 * useMarketplace Hook
 */
export function useMarketplace() {
  const [platforms, setPlatforms] = useState(PLATFORMS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load configuration status on mount
  useEffect(() => {
    loadConfigurationStatus();
  }, []);

  /**
   * Load platform configuration status
   */
  const loadConfigurationStatus = useCallback(async () => {
    try {
      // Check each platform for configuration
      const updated = { ...platforms };

      // Education platforms (via tentacles)
      if (window.Panda?.Education) {
        const kiwify = window.Panda.Education.Kiwify;
        const hotmart = window.Panda.Education.Hotmart;
        const eduzz = window.Panda.Education.Eduzz;

        if (kiwify?.isConfigured?.()) updated.kiwify.configured = true;
        if (hotmart?.isConfigured?.()) updated.hotmart.configured = true;
        if (eduzz?.isConfigured?.()) updated.eduzz.configured = true;
      }

      // Distribution platforms (via tentacles)
      if (window.Panda?.Dist) {
        const steam = window.Panda.Dist.Steam;
        const vscode = window.Panda.Dist.VSCode;
        const npm = window.Panda.Dist.NPM;

        if (steam?.isConfigured?.()) updated.steam.configured = true;
        if (vscode?.isConfigured?.()) updated.vscode.configured = true;
        if (npm?.isConfigured?.()) updated.npm.configured = true;
      }

      setPlatforms(updated);
    } catch (err) {
      console.error("Failed to load marketplace config:", err);
    }
  }, [platforms]);

  /**
   * Configure a marketplace platform
   */
  const configurePlatform = useCallback(
    async (platformId, credentials) => {
      setIsLoading(true);
      setError(null);

      try {
        const platform = platforms[platformId];
        if (!platform) {
          console.error(`Unknown platform: ${platformId}`);
          setError(`Unknown platform: ${platformId}`);
          setIsLoading(false);
          return { success: false, error: `Unknown platform: ${platformId}`, isolated: true };
        }

        // Route to appropriate tentacle
        if (platform.category === MarketplaceCategory.EDUCATION) {
          const hook = window.Panda?.Education?.[capitalizeFirst(platformId)];
          if (hook?.configure) {
            await hook.configure(credentials);
          }
        } else if (
          platform.category === MarketplaceCategory.GAMING ||
          platform.category === MarketplaceCategory.DEVELOPER
        ) {
          const hook = window.Panda?.Dist?.[capitalizeFirst(platformId)];
          if (hook?.configure) {
            await hook.configure(credentials);
          }
        }

        // Update state
        setPlatforms((prev) => ({
          ...prev,
          [platformId]: { ...prev[platformId], configured: true },
        }));

        return { success: true };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [platforms],
  );

  /**
   * Get products from a platform
   */
  const getProducts = useCallback(
    async (platformId) => {
      setIsLoading(true);
      setError(null);

      try {
        const platform = platforms[platformId];
        if (!platform) {
          console.error(`Unknown platform: ${platformId}`);
          setError(`Unknown platform: ${platformId}`);
          setIsLoading(false);
          return { success: false, error: `Unknown platform: ${platformId}`, isolated: true };
        }

        let products = [];

        if (platform.category === MarketplaceCategory.EDUCATION) {
          const hook = window.Panda?.Education?.[capitalizeFirst(platformId)];
          if (hook?.getProducts) {
            products = await hook.getProducts();
          }
        } else {
          const hook = window.Panda?.Dist?.[capitalizeFirst(platformId)];
          if (hook?.getProducts) {
            products = await hook.getProducts();
          }
        }

        return products;
      } catch (err) {
        setError(err.message);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [platforms],
  );

  /**
   * Get analytics for a platform
   */
  const getAnalytics = useCallback(
    async (platformId, productId = null, period = "30d") => {
      try {
        const platform = platforms[platformId];
        if (!platform) return null;

        if (platform.category === MarketplaceCategory.EDUCATION) {
          const hook = window.Panda?.Education?.[capitalizeFirst(platformId)];
          if (hook?.getAnalytics) {
            return await hook.getAnalytics(productId, period);
          }
        } else {
          const hook = window.Panda?.Dist?.[capitalizeFirst(platformId)];
          if (hook?.getAnalytics) {
            return await hook.getAnalytics(productId, period);
          }
        }

        return null;
      } catch (err) {
        console.error("Analytics error:", err);
        return null;
      }
    },
    [platforms],
  );

  /**
   * Get all platforms by category
   */
  const getPlatformsByCategory = useCallback(
    (category) => {
      return Object.values(platforms).filter((p) => p.category === category);
    },
    [platforms],
  );

  /**
   * Get configured platforms
   */
  const getConfiguredPlatforms = useCallback(() => {
    return Object.values(platforms).filter((p) => p.configured);
  }, [platforms]);

  return {
    platforms: Object.values(platforms),
    isLoading,
    error,
    clearError: () => setError(null),

    // Methods
    configurePlatform,
    getProducts,
    getAnalytics,
    getPlatformsByCategory,
    getConfiguredPlatforms,
    refreshConfig: loadConfigurationStatus,
  };
}

/**
 * Helper: Capitalize first letter
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default useMarketplace;
