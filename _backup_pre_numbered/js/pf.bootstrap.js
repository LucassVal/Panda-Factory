/**
 * 🐼 Panda Factory - Bootstrap
 * =============================
 * Inicialização ZERO-CONFIG para modo GitHub
 *
 * Detecta automaticamente:
 * - Ambiente (GitHub Pages vs Local)
 * - Repositório (owner/repo)
 * - Modo (read-only vs read-write)
 *
 * Uso:
 * <script src="js/pf.sdk.js"></script>
 * <script src="js/pf.bootstrap.js"></script>
 *
 * Pronto! Panda.* está disponível.
 */

(function (window) {
  "use strict";

  // ==========================================
  // 🔧 AUTO-DETECTION
  // ==========================================

  const Bootstrap = {
    mode: null, // 'github-pages', 'local', 'server'
    config: null,

    /**
     * Initialize Panda Factory
     */
    async init() {
      console.log("🐼 Panda Factory Bootstrap v1.0");

      // Detect environment
      this.mode = this._detectMode();
      console.log(`📍 Mode: ${this.mode}`);

      // Get config from URL or localStorage
      this.config = this._getConfig();
      console.log(`📦 Repo: ${this.config.owner}/${this.config.repo}`);

      // Load scripts dynamically
      await this._loadScripts();

      // Initialize GitHub as infrastructure
      if (this.mode === "github-pages" || this.mode === "local-github") {
        await this._initGitHubMode();
      }

      // Emit ready event
      window.dispatchEvent(
        new CustomEvent("panda:ready", { detail: this.config }),
      );
      console.log("🐼 Panda Factory is READY!");

      return this.config;
    },

    /**
     * Detect running mode
     */
    _detectMode() {
      const host = window.location.hostname;

      // GitHub Pages
      if (host.endsWith(".github.io")) {
        return "github-pages";
      }

      // Local development
      if (host === "localhost" || host === "127.0.0.1") {
        // Check if we should use GitHub as backend
        if (localStorage.getItem("panda_github_mode") === "true") {
          return "local-github";
        }
        return "local";
      }

      // Custom domain (still could be GitHub Pages)
      if (localStorage.getItem("panda_github_mode") === "true") {
        return "github-pages";
      }

      return "server";
    },

    /**
     * Get configuration
     */
    _getConfig() {
      // Try to get from localStorage first
      const stored = localStorage.getItem("panda_config");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          // Continue to auto-detect
        }
      }

      // Auto-detect from URL
      const host = window.location.hostname;
      let owner = null;
      let repo = null;

      if (host.endsWith(".github.io")) {
        // Parse: username.github.io/repo
        owner = host.replace(".github.io", "");
        const path = window.location.pathname.split("/")[1];
        repo = path || owner; // If no path, assume user site
      }

      // Also check meta tags
      const metaOwner = document.querySelector(
        'meta[name="panda-owner"]',
      )?.content;
      const metaRepo = document.querySelector(
        'meta[name="panda-repo"]',
      )?.content;

      return {
        owner: metaOwner || owner || "LucassVal",
        repo: metaRepo || repo || "SAAS",
        branch: "main",
        token: localStorage.getItem("panda_github_token") || null,
        mode: this.mode,
        pagesUrl: `https://${owner || "lucassval"}.github.io/${repo || "saas"}`,
      };
    },

    /**
     * Load required scripts
     */
    async _loadScripts() {
      const basePath = this._getBasePath();

      const scripts = [
        // GitHub Tentacle
        "js/tentacles/github/pf.github-parent.js",
        "js/tentacles/github/children/database.js",
        "js/tentacles/github/children/pages.js",
        "js/tentacles/github/children/actions.js",
      ];

      for (const script of scripts) {
        try {
          await this._loadScript(`${basePath}${script}`);
        } catch (e) {
          console.warn(`⚠️ Failed to load ${script}:`, e.message);
        }
      }
    },

    /**
     * Load a script dynamically
     */
    _loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },

    /**
     * Get base path for scripts
     */
    _getBasePath() {
      // Handle GitHub Pages subpath
      const path = window.location.pathname;
      if (path.includes("/") && this.mode === "github-pages") {
        const parts = path.split("/").filter(Boolean);
        if (parts.length > 0) {
          return `/${parts[0]}/`;
        }
      }
      return "/";
    },

    /**
     * Initialize GitHub mode
     */
    async _initGitHubMode() {
      // Wait for GitHub Parent to load
      let attempts = 0;
      while (!window.GitHubParent && attempts < 50) {
        await new Promise((r) => setTimeout(r, 100));
        attempts++;
      }

      if (!window.GitHubParent) {
        console.error("❌ GitHub Tentacle not loaded");
        return;
      }

      // Initialize
      await window.GitHubParent.init({
        owner: this.config.owner,
        repo: this.config.repo,
        branch: this.config.branch,
        token: this.config.token,
      });

      // Alias Panda.Data to GitHub DB
      if (window.GitHubDB) {
        window.Panda = window.Panda || {};
        window.Panda.Data = window.GitHubDB;
        console.log("📦 Panda.Data → GitHub DB");
      }

      // Alias Panda.Storage to GitHub (for beta)
      window.Panda = window.Panda || {};
      window.Panda.Storage = {
        async upload(file) {
          // Convert to base64 and store
          const reader = new FileReader();
          return new Promise((resolve) => {
            reader.onload = async () => {
              const base64 = reader.result.split(",")[1];
              const path = `uploads/${Date.now()}_${file.name}`;
              const result = await window.Panda.GitHub.saveFile(
                path,
                base64,
                `Upload: ${file.name}`,
              );
              resolve({
                success: result.success,
                url: `${this.config?.pagesUrl}/${path}`,
                path,
              });
            };
            reader.readAsDataURL(file);
          });
        },

        async download(path) {
          const result = await window.Panda.GitHub.getFile(path);
          if (!result.success) return null;

          // Decode base64
          const binary = atob(result.content);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          return new Blob([bytes]);
        },
      };

      console.log("🐙 GitHub Mode active (ZERO SERVER!)");
    },

    /**
     * Configure GitHub token (for write operations)
     */
    setToken(token) {
      localStorage.setItem("panda_github_token", token);
      this.config.token = token;

      if (window.GitHubParent) {
        window.GitHubParent.init(this.config);
      }

      console.log("🔑 Token configured");
    },

    /**
     * Enable GitHub mode for local development
     */
    enableGitHubMode(owner, repo) {
      localStorage.setItem("panda_github_mode", "true");
      localStorage.setItem(
        "panda_config",
        JSON.stringify({ owner, repo, branch: "main" }),
      );
      console.log("🐙 GitHub mode enabled. Reload page to apply.");
    },

    /**
     * Disable GitHub mode
     */
    disableGitHubMode() {
      localStorage.removeItem("panda_github_mode");
      localStorage.removeItem("panda_config");
      console.log("GitHub mode disabled. Reload page to apply.");
    },
  };

  // ==========================================
  // 🌍 AUTO-INIT
  // ==========================================
  if (document.readyState === "complete") {
    Bootstrap.init();
  } else {
    window.addEventListener("DOMContentLoaded", () => Bootstrap.init());
  }

  window.PandaBootstrap = Bootstrap;
})(window);
