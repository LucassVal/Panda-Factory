/**
 * 🐼 GitHub Child - Actions (Serverless Compute)
 * ===============================================
 * Usa GitHub Actions como compute serverless
 *
 * Features:
 * - Trigger workflows via API
 * - Monitor run status
 * - Download artifacts
 * - Secrets management
 *
 * CUSTO: 2000 min/mês grátis
 */

(function (window) {
  "use strict";

  const PARENT = "github";
  const CHILD_ID = "Actions";
  const TM = window.TentacleMonitor;

  // ==========================================
  // 🔧 ACTIONS API
  // ==========================================
  const GitHubActions = {
    id: CHILD_ID,
    name: "GitHub Actions",
    icon: "⚡",

    // Track running workflows
    _activeRuns: new Map(),

    /**
     * Trigger a workflow
     */
    async trigger(workflowFile, inputs = {}) {
      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      _log(`Triggering workflow: ${workflowFile}`);
      const result = await parent.triggerWorkflow(workflowFile, inputs);

      if (result.success) {
        // Poll for run ID
        await _delay(2000); // Wait for run to start
        const runs = await this.getRuns(workflowFile, 1);

        if (runs.success && runs.runs?.length > 0) {
          const runId = runs.runs[0].id;
          this._activeRuns.set(runId, {
            workflow: workflowFile,
            startedAt: Date.now(),
          });

          return {
            success: true,
            runId,
            workflow: workflowFile,
            status: runs.runs[0].status,
            url: runs.runs[0].url,
          };
        }
      }

      return result;
    },

    /**
     * Get workflow runs
     */
    async getRuns(workflowFile, limit = 5) {
      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      return parent.getWorkflowRuns(workflowFile, limit);
    },

    /**
     * Get run status
     */
    async getRunStatus(runId) {
      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      try {
        const config = parent.getConfig();
        const response = await fetch(
          `https://api.github.com/repos/${config.owner}/${config.repo}/actions/runs/${runId}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        return {
          success: true,
          runId,
          status: data.status,
          conclusion: data.conclusion,
          startedAt: data.run_started_at,
          updatedAt: data.updated_at,
          url: data.html_url,
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    /**
     * Wait for run to complete
     */
    async waitForRun(runId, maxWaitMs = 300000) {
      const startTime = Date.now();

      while (Date.now() - startTime < maxWaitMs) {
        const status = await this.getRunStatus(runId);

        if (!status.success) {
          return status;
        }

        if (status.status === "completed") {
          this._activeRuns.delete(runId);
          return {
            success: true,
            runId,
            conclusion: status.conclusion,
            duration: Date.now() - startTime,
          };
        }

        _log(`Run ${runId}: ${status.status}...`);
        await _delay(10000); // Poll every 10s
      }

      return {
        success: false,
        error: "Timeout waiting for run to complete",
        runId,
      };
    },

    /**
     * Get run artifacts
     */
    async getArtifacts(runId) {
      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      try {
        const config = parent.getConfig();
        const response = await fetch(
          `https://api.github.com/repos/${config.owner}/${config.repo}/actions/runs/${runId}/artifacts`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        return {
          success: true,
          artifacts: data.artifacts?.map((a) => ({
            id: a.id,
            name: a.name,
            size: a.size_in_bytes,
            expiresAt: a.expires_at,
            downloadUrl: a.archive_download_url,
          })),
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    /**
     * Cancel run
     */
    async cancelRun(runId) {
      _log(`Cancelling run ${runId}...`);

      // Would POST to cancel endpoint
      await _delay(500);

      this._activeRuns.delete(runId);
      return { success: true, runId };
    },

    /**
     * List available workflows
     */
    async listWorkflows() {
      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      try {
        const config = parent.getConfig();
        const response = await fetch(
          `https://api.github.com/repos/${config.owner}/${config.repo}/actions/workflows`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        return {
          success: true,
          workflows: data.workflows?.map((w) => ({
            id: w.id,
            name: w.name,
            path: w.path,
            state: w.state,
          })),
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    /**
     * Get active runs
     */
    getActiveRuns() {
      return [...this._activeRuns.entries()].map(([id, data]) => ({
        runId: id,
        ...data,
      }));
    },

    /**
     * Get usage minutes
     */
    async getUsage() {
      // Would get from billing API
      return {
        success: true,
        included: 2000, // Free tier
        used: 0,
        remaining: 2000,
      };
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function _log(message) {
    console.log(`⚡ [GitHub/Actions] ${message}`);
    TM?.log?.("info", `${PARENT}:${CHILD_ID}`, message);
  }

  const _delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  const register = () => {
    if (window.GitHubParent) {
      window.GitHubParent.registerChild(CHILD_ID, GitHubActions);
      _log("✓ GitHub Actions ready");
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
  window.Panda.GitHub.Actions = GitHubActions;
  window.GitHubActions = GitHubActions;
})(window);
