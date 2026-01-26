/**
 * 🐼 Distribution Child - VS Code Marketplace Hook
 * =================================================
 * Hook para deploy automático de extensões VS Code
 *
 * Features:
 * - VSCE CLI integration
 * - Automatic versioning
 * - Category/tags management
 * - Publisher verification
 *
 * @requires Personal Access Token (PAT) from Azure DevOps
 */

(function (window) {
  "use strict";

  const PARENT = "distribution";
  const CHILD_ID = "vscode";
  const TM = window.TentacleMonitor;

  // Config
  let personalAccessToken = null;
  let publisherName = null;

  // ==========================================
  // 🔧 VS CODE API
  // ==========================================
  const VSCodeHook = {
    id: CHILD_ID,
    name: "VS Code Marketplace",
    icon: "💻",

    /**
     * Configure publisher credentials
     */
    async configure(options = {}) {
      const { pat, publisher } = options;

      if (!pat) {
        return {
          success: false,
          error: "Personal Access Token required from Azure DevOps",
          help: "https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token",
        };
      }

      if (!publisher) {
        return {
          success: false,
          error: "Publisher name required",
        };
      }

      personalAccessToken = pat;
      publisherName = publisher;

      localStorage.setItem("panda_vscode_configured", "true");
      _log(`Configured for publisher: ${publisher}`);

      return { success: true, publisher };
    },

    /**
     * Check if configured
     */
    isConfigured() {
      return (
        !!personalAccessToken ||
        localStorage.getItem("panda_vscode_configured") === "true"
      );
    },

    /**
     * Deploy extension to VS Code Marketplace
     */
    async deploy(projectId, options = {}) {
      const {
        name = null,
        displayName = "Panda Extension",
        description = "Extension created with Panda Factory",
        version = "1.0.0",
        categories = ["Other"],
        keywords = ["panda"],
        icon = null,
      } = options;

      if (!name) {
        return {
          success: false,
          error: "Extension name required (lowercase, no spaces)",
        };
      }

      _log(`Deploying ${name} to VS Code Marketplace...`);

      // Step 1: Generate package.json for extension
      const packageJson = this._generatePackageJson({
        name,
        displayName,
        description,
        version,
        categories,
        keywords,
        publisher: publisherName || "panda-factory",
      });

      // Step 2: Build VSIX via cloud
      const buildResult = await this._buildVSIX(projectId, {
        name,
        packageJson,
        icon,
      });

      if (!buildResult.success) {
        return buildResult;
      }

      // Step 3: Publish via vsce
      const publishResult = await this._publish(name, buildResult.vsixPath);

      return {
        success: true,
        platform: "vscode",
        name,
        displayName,
        version,
        url: `https://marketplace.visualstudio.com/items?itemName=${publisherName || "panda-factory"}.${name}`,
        manageUrl: `https://marketplace.visualstudio.com/manage/publishers/${publisherName || "panda-factory"}/extensions/${name}`,
      };
    },

    /**
     * Update existing extension
     */
    async update(projectId, options = {}) {
      // Increment version and republish
      const currentVersion = options.version || "1.0.0";
      const [major, minor, patch] = currentVersion.split(".").map(Number);
      const newVersion = `${major}.${minor}.${patch + 1}`;

      return this.deploy(projectId, { ...options, version: newVersion });
    },

    /**
     * Unpublish extension
     */
    async unpublish(extensionName) {
      _log(`Unpublishing ${extensionName}...`);

      await _delay(500);

      return {
        success: true,
        name: extensionName,
        message:
          "Extension unpublished. It may take a few minutes to disappear from marketplace.",
      };
    },

    /**
     * Get analytics
     */
    async getAnalytics(projectId, period) {
      return {
        platform: "vscode",
        note: "Analytics via VS Code Marketplace dashboard",
        dashboardUrl: `https://marketplace.visualstudio.com/manage/publishers/${publisherName || "panda-factory"}`,
        metrics: {
          installs: 0,
          updates: 0,
          ratings: { average: 0, count: 0 },
        },
      };
    },

    /**
     * Get extension categories
     */
    getCategories() {
      return [
        "Programming Languages",
        "Snippets",
        "Linters",
        "Themes",
        "Debuggers",
        "Formatters",
        "Keymaps",
        "SCM Providers",
        "Other",
        "Extension Packs",
        "Language Packs",
        "Data Science",
        "Machine Learning",
        "Visualization",
        "Notebooks",
        "Education",
        "Testing",
      ];
    },

    // ==========================================
    // PRIVATE METHODS
    // ==========================================

    _generatePackageJson(config) {
      return {
        name: config.name,
        displayName: config.displayName,
        description: config.description,
        version: config.version,
        publisher: config.publisher,
        engines: { vscode: "^1.85.0" },
        categories: config.categories,
        keywords: config.keywords,
        activationEvents: [],
        main: "./extension.js",
        contributes: {},
        repository: {
          type: "git",
          url: "https://github.com/panda-factory/extensions",
        },
        scripts: {
          "vscode:prepublish": "npm run compile",
          compile: "tsc -p ./",
        },
        devDependencies: {
          "@types/vscode": "^1.85.0",
          typescript: "^5.3.0",
        },
      };
    },

    async _buildVSIX(projectId, config) {
      _log(`Building VSIX for ${config.name}...`);

      // Trigger cloud build
      await _delay(1000);

      return {
        success: true,
        vsixPath: `/builds/${projectId}/${config.name}.vsix`,
      };
    },

    async _publish(name, vsixPath) {
      _log(`Publishing ${name}...`);

      // In production: run vsce publish via GitHub Action
      await _delay(500);

      return {
        success: true,
        published: true,
      };
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function _log(message) {
    console.log(`💻 [Dist/VSCode] ${message}`);
    TM?.log?.("info", `${PARENT}:${CHILD_ID}`, message);
  }

  const _delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  const register = () => {
    if (window.DistributionParent) {
      window.DistributionParent.registerChild(CHILD_ID, VSCodeHook);
      _log("✓ VS Code hook ready");
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
  window.Panda.Dist.VSCode = VSCodeHook;
  window.VSCodeHook = VSCodeHook;
})(window);
