/**
 * 🌐 Panda P2P Tentacle - Parent Module
 *
 * SDK para integração com a rede P2P Compute
 * Cross-Ref: docs/PF_P2P_REFERENCE.md, backend/domains/p2p/PF_P2P.gs
 *
 * @version 1.0.0
 */

(function (pf) {
  "use strict";

  // ============================================================================
  // P2P TENTACLE PARENT
  // ============================================================================

  pf.p2p = {
    name: "p2p",
    version: "1.0.0",

    // Node state
    _nodeId: null,
    _tier: null,
    _isRegistered: false,
    _heartbeatInterval: null,

    // ============================================================================
    // NODE MANAGEMENT
    // ============================================================================

    /**
     * Register this device as a P2P node
     * @param {Object} resources - Optional override for auto-detected resources
     * @returns {Promise<Object>} Registration result with nodeId and tier
     */
    async register(resources = null) {
      const detectedResources = resources || (await this._detectResources());

      const result = await pf.sdk.call("P2P_REGISTER", {
        resources: detectedResources,
      });

      if (result.nodeId) {
        this._nodeId = result.nodeId;
        this._tier = result.tier;
        this._isRegistered = true;

        // Start heartbeat
        this._startHeartbeat();

        pf.events.emit("p2p:registered", result);
      }

      return result;
    },

    /**
     * Unregister from the P2P network
     */
    async unregister() {
      this._stopHeartbeat();
      this._isRegistered = false;
      this._nodeId = null;
      this._tier = null;
      pf.events.emit("p2p:unregistered");
    },

    /**
     * Get current node statistics
     * @returns {Promise<Object>} Node stats including tier, earnings, uptime
     */
    async getStats() {
      if (!this._nodeId) {
        return { error: "Node not registered" };
      }
      return pf.sdk.call("P2P_STATS", { nodeId: this._nodeId });
    },

    // ============================================================================
    // TASK SUBMISSION (for consumers)
    // ============================================================================

    /**
     * Submit a compute task to the P2P network
     * @param {string} taskType - Type of task (text.gen, image.gen, etc.)
     * @param {Object} data - Task data/payload
     * @param {string} priority - Task priority (low, normal, high)
     * @returns {Promise<Object>} Task submission result
     */
    async submitTask(taskType, data, priority = "normal") {
      const result = await pf.sdk.call("P2P_SUBMIT_TASK", {
        taskType,
        data,
        priority,
      });

      if (result.taskId) {
        pf.events.emit("p2p:task:submitted", result);
      }

      return result;
    },

    /**
     * Quick helpers for common task types
     */
    async generateText(prompt, options = {}) {
      return this.submitTask("text.gen", { prompt, ...options });
    },

    async generateImage(prompt, options = {}) {
      return this.submitTask("image.gen", { prompt, ...options });
    },

    async compileCode(code, language, options = {}) {
      return this.submitTask("code.compile", { code, language, ...options });
    },

    // ============================================================================
    // TASK EXECUTION (for nodes/hosts)
    // ============================================================================

    /**
     * Mark a task as completed
     * @param {string} taskId - Task ID
     * @param {Object} result - Task result
     * @param {boolean} success - Whether task succeeded
     */
    async completeTask(taskId, result, success = true) {
      return pf.sdk.call("P2P_COMPLETE_TASK", {
        taskId,
        result,
        success,
      });
    },

    // ============================================================================
    // INTERNAL METHODS
    // ============================================================================

    /**
     * Detect system resources for tier classification
     * @private
     */
    async _detectResources() {
      // Try to get from Rust agent if available
      if (window.panda?.agent?.getResources) {
        return window.panda.agent.getResources();
      }

      // Browser-based detection (limited)
      const memory = navigator.deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 2;

      return {
        ramGb: memory,
        cpuCores: cores,
        gpuTflops: 0, // Can't detect in browser
        gpuName: null,
      };
    },

    /**
     * Start heartbeat interval
     * @private
     */
    _startHeartbeat() {
      if (this._heartbeatInterval) return;

      this._heartbeatInterval = setInterval(async () => {
        if (!this._nodeId) return;

        try {
          const result = await pf.sdk.call("P2P_HEARTBEAT", {
            nodeId: this._nodeId,
            stats: await this._getSystemStats(),
          });

          if (result.pendingTasks > 0) {
            pf.events.emit("p2p:tasks:pending", { count: result.pendingTasks });
          }
        } catch (err) {
          console.warn("[P2P] Heartbeat failed:", err);
        }
      }, 60000); // 60 seconds
    },

    /**
     * Stop heartbeat interval
     * @private
     */
    _stopHeartbeat() {
      if (this._heartbeatInterval) {
        clearInterval(this._heartbeatInterval);
        this._heartbeatInterval = null;
      }
    },

    /**
     * Get current system stats for heartbeat
     * @private
     */
    async _getSystemStats() {
      // Placeholder - real stats come from Rust agent
      return {
        cpuUsage: 0,
        ramUsage: 0,
        gpuTemp: 0,
      };
    },

    // ============================================================================
    // CONSTANTS
    // ============================================================================

    TASK_TYPES: {
      TEXT_GEN: "text.gen",
      IMAGE_GEN: "image.gen",
      VIDEO_GEN: "video.gen",
      CODE_COMPILE: "code.compile",
      ML_TRAINING: "ml.training",
    },

    TIERS: {
      SEED: "seed",
      SPROUT: "sprout",
      TREE: "tree",
      FOREST: "forest",
      TITAN: "titan",
    },
  };

  // ============================================================================
  // AUTO-REGISTER TENTACLE
  // ============================================================================

  if (pf.sdk?.registerTentacle) {
    pf.sdk.registerTentacle("p2p", pf.p2p);
  }
})(window.pf || (window.pf = {}));
