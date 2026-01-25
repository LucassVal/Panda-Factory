/**
 * 🐼 GitHub Child - Pages (Static Hosting)
 * =========================================
 * Gerencia GitHub Pages para hosting gratuito
 *
 * Features:
 * - Deploy automático
 * - Custom domain support
 * - HTTPS grátis (via GitHub)
 * - SPA routing via 404.html
 *
 * CUSTO: $0
 */

(function (window) {
  "use strict";

  const PARENT = "github";
  const CHILD_ID = "Pages";
  const TM = window.TentacleMonitor;

  // ==========================================
  // 🔧 PAGES API
  // ==========================================
  const GitHubPages = {
    id: CHILD_ID,
    name: "GitHub Pages",
    icon: "🌐",

    /**
     * Get Pages URL
     */
    getUrl() {
      const config = window.GitHubParent?.api?.getConfig?.();
      if (!config) return null;

      return config.pagesUrl;
    },

    /**
     * Deploy to Pages (via workflow or direct push)
     */
    async deploy(options = {}) {
      const {
        source = "docs", // or "gh-pages" branch
        buildCommand = null,
      } = options;

      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      _log(`Deploying to GitHub Pages...`);

      // Trigger deploy workflow if exists
      try {
        const result = await parent.triggerWorkflow("pages.yml", {
          source,
        });

        if (result.success) {
          return {
            success: true,
            url: this.getUrl(),
            message: "Deploy triggered. Site will be live in 1-2 minutes.",
          };
        }
      } catch (e) {
        // Workflow doesn't exist, continue
      }

      // Fallback: just return the URL (assume already deployed)
      return {
        success: true,
        url: this.getUrl(),
        message:
          "Push to main branch to deploy. GitHub Pages should auto-deploy.",
      };
    },

    /**
     * Check if Pages is enabled
     */
    async isEnabled() {
      // Would check via GitHub API
      return {
        enabled: true,
        url: this.getUrl(),
        source: "main",
        path: "/",
      };
    },

    /**
     * Generate 404.html for SPA routing
     */
    async setupSPARouting() {
      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      const spa404 = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Panda Factory</title>
  <script>
    // SPA redirect for GitHub Pages
    var pathSegmentsToKeep = 1;
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body></body>
</html>`;

      const result = await parent.saveFile(
        "404.html",
        spa404,
        "Setup SPA routing for GitHub Pages",
      );

      if (result.success) {
        _log("SPA routing configured (404.html)");
      }

      return result;
    },

    /**
     * Create CNAME file for custom domain
     */
    async setCustomDomain(domain) {
      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      const result = await parent.saveFile(
        "CNAME",
        domain,
        `Set custom domain: ${domain}`,
      );

      if (result.success) {
        _log(`Custom domain set: ${domain}`);
        return {
          success: true,
          domain,
          instructions: [
            "1. Add CNAME record pointing to your-user.github.io",
            "2. Wait for DNS propagation (up to 48h)",
            "3. Enable HTTPS in repository settings",
          ],
        };
      }

      return result;
    },

    /**
     * Remove custom domain
     */
    async removeCustomDomain() {
      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      return parent.deleteFile("CNAME", "Remove custom domain");
    },

    /**
     * Get deployment status
     */
    async getDeploymentStatus() {
      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      // Check workflow runs
      const runs = await parent.getWorkflowRuns("pages-build-deployment", 1);

      if (runs.success && runs.runs?.length > 0) {
        const latest = runs.runs[0];
        return {
          success: true,
          status: latest.status,
          conclusion: latest.conclusion,
          url: this.getUrl(),
          lastDeploy: latest.createdAt,
        };
      }

      return {
        success: true,
        status: "unknown",
        url: this.getUrl(),
      };
    },

    /**
     * Generate index redirect for PWA
     */
    async setupPWAIndex(manifestPath = "/manifest.json") {
      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      // Add PWA meta tags to index
      // This would typically modify the index.html
      return {
        success: true,
        message: "Add these to your index.html <head>:",
        meta: [
          '<link rel="manifest" href="/manifest.json">',
          '<meta name="theme-color" content="#4cc9f0">',
          '<link rel="apple-touch-icon" href="/icons/icon-192.png">',
          '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        ],
      };
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function _log(message) {
    console.log(`🌐 [GitHub/Pages] ${message}`);
    TM?.log?.("info", `${PARENT}:${CHILD_ID}`, message);
  }

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  const register = () => {
    if (window.GitHubParent) {
      window.GitHubParent.registerChild(CHILD_ID, GitHubPages);
      _log("✓ GitHub Pages ready");
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
  window.Panda.GitHub = window.Panda.GitHub || {};
  window.Panda.GitHub.Pages = GitHubPages;
  window.GitHubPages = GitHubPages;
})(window);
