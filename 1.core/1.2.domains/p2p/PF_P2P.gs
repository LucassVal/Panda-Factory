/**
 * 🌐 PF_P2P.gs - P2P Compute Network Backend
 *
 * Endpoints para gerenciamento de nós P2P e mineração Partner Mode
 * Cross-Ref: docs/PF_P2P_REFERENCE.md
 *
 * @version 1.0.0
 */

// ============================================================================
// 1. CONSTANTS & CONFIG
// ============================================================================

const P2P_CONFIG = {
  // Node Tiers & Multipliers
  TIERS: {
    seed: { multiplier: 1.0, minRam: 4, minCores: 2, minUptime: 0.9 },
    sprout: { multiplier: 1.5, minRam: 8, minCores: 4, minUptime: 0.95 },
    tree: { multiplier: 2.5, minRam: 16, minCores: 8, minUptime: 0.99 },
    forest: { multiplier: 4.0, minRam: 32, minCores: 12, minUptime: 0.99 },
    titan: { multiplier: 8.0, minRam: 64, minCores: 16, minUptime: 0.99 },
  },

  // Task Profiles (cost in PC)
  TASK_COSTS: {
    "text.gen": 5, // Chat, translation
    "image.gen": 40, // Image generation
    "video.gen": 500, // Video rendering (per 30s chunk)
    "code.compile": 20, // Build/compile
    "ml.training": 1000, // ML training (per epoch)
  },

  // Splits
  SPLITS: {
    host: 0.95, // 95% to node host
    ops: 0.025, // 2.5% Panda Ops
    incentive: 0.025, // 2.5% Incentive Fund
  },

  HEARTBEAT_INTERVAL_MS: 60000, // 60 seconds
  STALE_NODE_THRESHOLD_MS: 180000, // 3 minutes = stale
};

// ============================================================================
// 2. P2P SERVICE
// ============================================================================

const P2PService = {
  /**
   * Register a new node in the P2P network
   * @param {Object} payload - { userId, resources: { ramGb, cpuCores, gpuTflops, gpuName } }
   */
  registerNode(payload) {
    const { userId, resources } = payload;

    if (!userId || !resources) {
      return jsonResponse({ error: "Missing userId or resources" }, 400);
    }

    // Determine tier based on resources
    const tier = this._determineTier(resources);
    const nodeId = Utilities.getUuid();

    // Store in Sheet
    const sheet = getSheet("P2P_Nodes");
    const now = new Date().toISOString();

    sheet.appendRow([
      nodeId,
      userId,
      tier,
      resources.ramGb || 0,
      resources.cpuCores || 0,
      resources.gpuTflops || 0,
      resources.gpuName || "none",
      "active",
      now, // registered_at
      now, // last_heartbeat
      0, // total_tasks
      0, // total_pc_earned
    ]);

    return jsonResponse({
      nodeId,
      tier,
      multiplier: P2P_CONFIG.TIERS[tier].multiplier,
      message: `Node registered as ${tier.toUpperCase()}`,
    });
  },

  /**
   * Heartbeat from a node (keeps it active)
   * @param {Object} payload - { nodeId, stats: { cpuUsage, ramUsage, gpuTemp } }
   */
  heartbeat(payload) {
    const { nodeId, stats } = payload;

    if (!nodeId) {
      return jsonResponse({ error: "Missing nodeId" }, 400);
    }

    const sheet = getSheet("P2P_Nodes");
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === nodeId) {
        // Update last_heartbeat (column 10, index 9)
        sheet.getRange(i + 1, 10).setValue(new Date().toISOString());

        return jsonResponse({
          acknowledged: true,
          nextHeartbeatMs: P2P_CONFIG.HEARTBEAT_INTERVAL_MS,
          pendingTasks: this._getPendingTasksForNode(nodeId),
        });
      }
    }

    return jsonResponse({ error: "Node not found" }, 404);
  },

  /**
   * Get node statistics
   * @param {Object} payload - { nodeId } or { userId }
   */
  getStats(payload) {
    const { nodeId, userId } = payload;
    const sheet = getSheet("P2P_Nodes");
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === nodeId || data[i][1] === userId) {
        const tier = data[i][2];
        return jsonResponse({
          nodeId: data[i][0],
          userId: data[i][1],
          tier: tier,
          multiplier: P2P_CONFIG.TIERS[tier]?.multiplier || 1.0,
          status: data[i][7],
          registeredAt: data[i][8],
          lastHeartbeat: data[i][9],
          totalTasks: data[i][10],
          totalPcEarned: data[i][11],
        });
      }
    }

    return jsonResponse({ error: "Node not found" }, 404);
  },

  /**
   * Submit a compute task to the P2P network
   * @param {Object} payload - { userId, taskType, data, priority }
   */
  submitTask(payload) {
    const { userId, taskType, data, priority } = payload;

    // Validate task type
    if (!P2P_CONFIG.TASK_COSTS[taskType]) {
      return jsonResponse({ error: `Unknown task type: ${taskType}` }, 400);
    }

    const costPc = P2P_CONFIG.TASK_COSTS[taskType];

    // Check user balance
    const balance = getUserBalance(userId);
    if (balance < costPc) {
      return jsonResponse(
        {
          error: "Insufficient PC balance",
          required: costPc,
          current: balance,
        },
        402,
      );
    }

    // Debit user
    debitUserBalance(userId, costPc, `p2p.task.${taskType}`);

    // Find available node
    const node = this._findAvailableNode(taskType);
    if (!node) {
      // Refund and return error
      creditUserBalance(userId, costPc, "p2p.task.refund");
      return jsonResponse({ error: "No available nodes" }, 503);
    }

    // Create task
    const taskId = Utilities.getUuid();
    const taskSheet = getSheet("P2P_Tasks");
    const now = new Date().toISOString();

    taskSheet.appendRow([
      taskId,
      userId,
      node.nodeId,
      taskType,
      JSON.stringify(data || {}),
      "pending",
      costPc,
      priority || "normal",
      now, // submitted_at
      "", // completed_at
      "", // result
    ]);

    return jsonResponse({
      taskId,
      nodeId: node.nodeId,
      nodeTier: node.tier,
      costPc,
      status: "pending",
      estimatedTimeMs: this._estimateTime(taskType),
    });
  },

  /**
   * Complete a task and pay the host
   * @param {Object} payload - { taskId, result, success }
   */
  completeTask(payload) {
    const { taskId, result, success } = payload;

    const taskSheet = getSheet("P2P_Tasks");
    const data = taskSheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === taskId) {
        const nodeId = data[i][2];
        const costPc = data[i][6];

        // Update task
        taskSheet.getRange(i + 1, 6).setValue(success ? "completed" : "failed");
        taskSheet.getRange(i + 1, 10).setValue(new Date().toISOString());
        taskSheet.getRange(i + 1, 11).setValue(JSON.stringify(result || {}));

        if (success) {
          // Pay the host
          const hostNode = this._getNodeById(nodeId);
          if (hostNode) {
            const hostPc = Math.floor(costPc * P2P_CONFIG.SPLITS.host);
            const opsPc = Math.floor(costPc * P2P_CONFIG.SPLITS.ops);
            const incentivePc = costPc - hostPc - opsPc;

            creditUserBalance(
              hostNode.userId,
              hostPc,
              `p2p.task.reward.${taskId}`,
            );
            // ops and incentive go to system accounts (can be tracked separately)

            // Update node stats
            this._updateNodeStats(nodeId, 1, hostPc);
          }
        }

        return jsonResponse({
          taskId,
          status: success ? "completed" : "failed",
        });
      }
    }

    return jsonResponse({ error: "Task not found" }, 404);
  },

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  _determineTier(resources) {
    const { ramGb, cpuCores, gpuTflops, gpuName } = resources;

    if (ramGb >= 64 && cpuCores >= 16) return "titan";
    if (ramGb >= 32 && cpuCores >= 12 && this._isRtx30Plus(gpuName))
      return "forest";
    if (ramGb >= 16 && cpuCores >= 8 && gpuTflops > 0) return "tree";
    if (ramGb >= 8 && cpuCores >= 4) return "sprout";
    return "seed";
  },

  _isRtx30Plus(gpuName) {
    if (!gpuName) return false;
    const lower = gpuName.toLowerCase();
    return (
      lower.includes("rtx 30") ||
      lower.includes("rtx 40") ||
      lower.includes("rtx 50") ||
      lower.includes("a100") ||
      lower.includes("h100")
    );
  },

  _findAvailableNode(taskType) {
    const sheet = getSheet("P2P_Nodes");
    const data = sheet.getDataRange().getValues();
    const now = new Date().getTime();

    // Determine minimum tier for task
    const minTier = this._getMinTierForTask(taskType);
    const tierOrder = ["seed", "sprout", "tree", "forest", "titan"];
    const minTierIndex = tierOrder.indexOf(minTier);

    for (let i = 1; i < data.length; i++) {
      const tier = data[i][2];
      const status = data[i][7];
      const lastHeartbeat = new Date(data[i][9]).getTime();

      // Check if node is active and not stale
      if (
        status === "active" &&
        now - lastHeartbeat < P2P_CONFIG.STALE_NODE_THRESHOLD_MS
      ) {
        // Check if tier is sufficient
        if (tierOrder.indexOf(tier) >= minTierIndex) {
          return {
            nodeId: data[i][0],
            userId: data[i][1],
            tier: tier,
          };
        }
      }
    }

    return null;
  },

  _getMinTierForTask(taskType) {
    const minTiers = {
      "text.gen": "seed",
      "image.gen": "tree",
      "video.gen": "forest",
      "code.compile": "sprout",
      "ml.training": "titan",
    };
    return minTiers[taskType] || "seed";
  },

  _estimateTime(taskType) {
    const estimates = {
      "text.gen": 5000,
      "image.gen": 30000,
      "video.gen": 120000,
      "code.compile": 60000,
      "ml.training": 300000,
    };
    return estimates[taskType] || 30000;
  },

  _getPendingTasksForNode(nodeId) {
    const sheet = getSheet("P2P_Tasks");
    const data = sheet.getDataRange().getValues();
    let count = 0;

    for (let i = 1; i < data.length; i++) {
      if (data[i][2] === nodeId && data[i][5] === "pending") {
        count++;
      }
    }

    return count;
  },

  _getNodeById(nodeId) {
    const sheet = getSheet("P2P_Nodes");
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === nodeId) {
        return {
          nodeId: data[i][0],
          userId: data[i][1],
          tier: data[i][2],
        };
      }
    }
    return null;
  },

  _updateNodeStats(nodeId, tasksCompleted, pcEarned) {
    const sheet = getSheet("P2P_Nodes");
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === nodeId) {
        const currentTasks = data[i][10] || 0;
        const currentPc = data[i][11] || 0;
        sheet.getRange(i + 1, 11).setValue(currentTasks + tasksCompleted);
        sheet.getRange(i + 1, 12).setValue(currentPc + pcEarned);
        break;
      }
    }
  },
};

// ============================================================================
// 3. SETUP HELPER (Create sheets if missing)
// ============================================================================

function setupP2PSheets() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);

  // P2P_Nodes sheet
  if (!ss.getSheetByName("P2P_Nodes")) {
    const sheet = ss.insertSheet("P2P_Nodes");
    sheet.appendRow([
      "node_id",
      "user_id",
      "tier",
      "ram_gb",
      "cpu_cores",
      "gpu_tflops",
      "gpu_name",
      "status",
      "registered_at",
      "last_heartbeat",
      "total_tasks",
      "total_pc_earned",
    ]);
  }

  // P2P_Tasks sheet
  if (!ss.getSheetByName("P2P_Tasks")) {
    const sheet = ss.insertSheet("P2P_Tasks");
    sheet.appendRow([
      "task_id",
      "user_id",
      "node_id",
      "task_type",
      "data",
      "status",
      "cost_pc",
      "priority",
      "submitted_at",
      "completed_at",
      "result",
    ]);
  }

  return "P2P sheets created successfully";
}
