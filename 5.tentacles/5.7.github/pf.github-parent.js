/**
 * 🐼 GitHub Tentacle - Parent
 * ============================
 * Usa GitHub como infraestrutura completa:
 * - GitHub Pages = Hosting
 * - JSON no repo = Database
 * - Actions = Compute
 * - Releases = CDN
 *
 * ZERO SERVIDOR. CUSTO ZERO.
 *
 * @version 1.0.0
 */

(function (window) {
  "use strict";

  const TENTACLE_ID = "github";
  const TM = window.TentacleMonitor;

  // Children registry
  const children = new Map();

  // ==========================================
  // 🔧 CONFIGURATION
  // ==========================================
  const CONFIG = {
    apiBase: "https://api.github.com",
    owner: null,
    repo: null,
    branch: "main",
    dataPath: "data/", // Where JSON "database" lives
    token: null, // PAT for write operations
  };

  // ==========================================
  // 📦 PARENT API
  // ==========================================
  const GitHubParent = {
    id: TENTACLE_ID,

    /**
     * Initialize with repo info
     */
    async init(options = {}) {
      CONFIG.owner = options.owner || CONFIG.owner;
      CONFIG.repo = options.repo || CONFIG.repo;
      CONFIG.branch = options.branch || CONFIG.branch;
      CONFIG.token = options.token || CONFIG.token;
      CONFIG.dataPath = options.dataPath || CONFIG.dataPath;

      TM?.registerTentacle(TENTACLE_ID, { category: "infrastructure" });
      TM?.registerParent(TENTACLE_ID, "Panda.GitHub");
      _log(`Initialized: ${CONFIG.owner}/${CONFIG.repo}`);

      return { success: true, repo: `${CONFIG.owner}/${CONFIG.repo}` };
    },

    /**
     * Register child
     */
    registerChild(name, childApi) {
      children.set(name, {
        api: childApi,
        status: "ready",
      });

      TM?.registerChild(TENTACLE_ID, name);
      this.api[name] = childApi;
      _log(`✓ ${name} child ready`);
    },

    // ==========================================
    // 🔧 CORE API
    // ==========================================
    api: {
      /**
       * Get repo info
       */
      getConfig() {
        return {
          owner: CONFIG.owner,
          repo: CONFIG.repo,
          branch: CONFIG.branch,
          pagesUrl: `https://${CONFIG.owner}.github.io/${CONFIG.repo}`,
          apiUrl: `${CONFIG.apiBase}/repos/${CONFIG.owner}/${CONFIG.repo}`,
        };
      },

      /**
       * Check API rate limit
       */
      async getRateLimit() {
        const response = await _fetch("/rate_limit");
        return response.rate;
      },

      /**
       * Get file content
       */
      async getFile(path) {
        try {
          const response = await _fetch(
            `/contents/${path}?ref=${CONFIG.branch}`,
          );
          const content = atob(response.content);
          return {
            success: true,
            content,
            sha: response.sha,
            path: response.path,
          };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      /**
       * Save file (create or update)
       */
      async saveFile(path, content, message = "Update via Panda") {
        if (!CONFIG.token) {
          return {
            success: false,
            error: "Token required for write operations",
          };
        }

        // Get current SHA if file exists
        let sha = null;
        try {
          const existing = await this.getFile(path);
          if (existing.success) {
            sha = existing.sha;
          }
        } catch (e) {
          // File doesn't exist, that's fine
        }

        const body = {
          message,
          content: btoa(unescape(encodeURIComponent(content))),
          branch: CONFIG.branch,
        };

        if (sha) {
          body.sha = sha;
        }

        try {
          const response = await _fetch(`/contents/${path}`, {
            method: "PUT",
            body: JSON.stringify(body),
          });

          return {
            success: true,
            commit: response.commit?.sha,
            path: response.content?.path,
          };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      /**
       * Delete file
       */
      async deleteFile(path, message = "Delete via Panda") {
        const existing = await this.getFile(path);
        if (!existing.success) {
          return { success: false, error: "File not found" };
        }

        try {
          await _fetch(`/contents/${path}`, {
            method: "DELETE",
            body: JSON.stringify({
              message,
              sha: existing.sha,
              branch: CONFIG.branch,
            }),
          });

          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      /**
       * List directory
       */
      async listDir(path = "") {
        try {
          const response = await _fetch(
            `/contents/${path}?ref=${CONFIG.branch}`,
          );
          return {
            success: true,
            files: Array.isArray(response)
              ? response.map((f) => ({
                  name: f.name,
                  path: f.path,
                  type: f.type,
                  size: f.size,
                  sha: f.sha,
                }))
              : [],
          };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      /**
       * Trigger workflow
       */
      async triggerWorkflow(workflowId, inputs = {}) {
        if (!CONFIG.token) {
          return { success: false, error: "Token required" };
        }

        try {
          await _fetch(`/actions/workflows/${workflowId}/dispatches`, {
            method: "POST",
            body: JSON.stringify({
              ref: CONFIG.branch,
              inputs,
            }),
          });

          return { success: true, workflow: workflowId };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      /**
       * Get workflow runs
       */
      async getWorkflowRuns(workflowId, limit = 5) {
        try {
          const response = await _fetch(
            `/actions/workflows/${workflowId}/runs?per_page=${limit}`,
          );
          return {
            success: true,
            runs: response.workflow_runs?.map((r) => ({
              id: r.id,
              status: r.status,
              conclusion: r.conclusion,
              createdAt: r.created_at,
              url: r.html_url,
            })),
          };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      /**
       * Get latest release
       */
      async getLatestRelease() {
        try {
          const response = await _fetch("/releases/latest");
          return {
            success: true,
            tag: response.tag_name,
            name: response.name,
            body: response.body,
            assets: response.assets?.map((a) => ({
              name: a.name,
              url: a.browser_download_url,
              size: a.size,
            })),
          };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      /**
       * Create release
       */
      async createRelease(tag, name, body, assets = []) {
        if (!CONFIG.token) {
          return { success: false, error: "Token required" };
        }

        try {
          const response = await _fetch("/releases", {
            method: "POST",
            body: JSON.stringify({
              tag_name: tag,
              name,
              body,
              draft: false,
              prerelease: false,
            }),
          });

          return {
            success: true,
            id: response.id,
            url: response.html_url,
            uploadUrl: response.upload_url,
          };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },
    },

    getStatus() {
      return {
        configured: !!(CONFIG.owner && CONFIG.repo),
        owner: CONFIG.owner,
        repo: CONFIG.repo,
        children: [...children.keys()],
      };
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function _log(message) {
    console.log(`🐙 [GitHub] ${message}`);
    TM?.log?.("info", TENTACLE_ID, message);
  }

  async function _fetch(endpoint, options = {}) {
    const url = `${CONFIG.apiBase}/repos/${CONFIG.owner}/${CONFIG.repo}${endpoint}`;

    const headers = {
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    };

    if (CONFIG.token) {
      headers.Authorization = `Bearer ${CONFIG.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API Error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  if (window.Panda) {
    window.Panda.GitHub = GitHubParent.api;
    window.Panda._tentacles = window.Panda._tentacles || {};
    window.Panda._tentacles.github = GitHubParent;
  }

  window.GitHubParent = GitHubParent;

  _log("GitHub Parent loaded");
})(window);
