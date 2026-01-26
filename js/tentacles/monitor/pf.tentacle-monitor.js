/**
 * 🐼 Panda Tentacle Monitor v1.0
 * ================================
 * Sistema de log em tempo real para hierarquia de tentáculos.
 * Monitora: SDK → Tentáculos → Pais → Filhos
 */

(function (window) {
  "use strict";

  // ==========================================
  // 📊 REGISTRY
  // ==========================================
  const registry = {
    sdk: {
      status: "ready",
      startTime: Date.now(),
      tentacles: new Map(),
    },
  };

  // ==========================================
  // 📝 LOG BUFFER
  // ==========================================
  const logs = [];
  const MAX_LOGS = 500;

  const COLORS = {
    trace: "color: #888",
    info: "color: #6d5dfc; font-weight: bold",
    warn: "color: #ffa726; font-weight: bold",
    error: "color: #ef5350; font-weight: bold",
    success: "color: #66bb6a; font-weight: bold",
  };

  // ==========================================
  // 🔧 MONITOR API
  // ==========================================
  const TentacleMonitor = {
    /**
     * Registra um tentáculo
     */
    registerTentacle(name, config = {}) {
      registry.sdk.tentacles.set(name, {
        name,
        status: "idle",
        parent: null,
        children: new Map(),
        startTime: Date.now(),
        calls: 0,
        errors: 0,
        ...config,
      });
      this.log("info", `sdk:${name}`, "🔌 Tentacle registered");
    },

    /**
     * Registra um parent (agrupador)
     */
    registerParent(tentacle, parentId, config = {}) {
      const t = registry.sdk.tentacles.get(tentacle);
      if (!t) {
        this.log(
          "error",
          tentacle,
          `Tentacle not found for parent ${parentId}`,
        );
        return;
      }
      t.parent = {
        id: parentId,
        status: "idle",
        children: new Map(),
        startTime: Date.now(),
        ...config,
      };
      this.log("info", `${tentacle}:${parentId}`, "👨‍👧 Parent registered");
    },

    /**
     * Registra um child (API específica)
     */
    registerChild(tentacle, childId, config = {}) {
      const t = registry.sdk.tentacles.get(tentacle);
      if (!t || !t.parent) {
        this.log("error", tentacle, `Parent not found for child ${childId}`);
        return;
      }
      t.parent.children.set(childId, {
        id: childId,
        status: "idle",
        startTime: Date.now(),
        calls: 0,
        errors: 0,
        ...config,
      });
      this.log("info", `${tentacle}:${childId}`, "👶 Child registered");
    },

    /**
     * Atualiza status de qualquer nível
     */
    setStatus(path, status) {
      const parts = path.split(":");
      let target = null;

      if (parts.length === 1) {
        // Tentacle
        target = registry.sdk.tentacles.get(parts[0]);
      } else if (parts.length === 2) {
        // Child
        const t = registry.sdk.tentacles.get(parts[0]);
        if (t && t.parent) {
          target = t.parent.children.get(parts[1]) || t.parent;
        }
      }

      if (target) {
        target.status = status;
        this.log(
          status === "error" ? "error" : "info",
          path,
          `Status → ${status}`,
        );
      }
    },

    /**
     * Log principal
     */
    log(level, source, message, data = null) {
      const entry = {
        id: logs.length,
        timestamp: Date.now(),
        time: new Date().toLocaleTimeString("pt-BR"),
        level,
        source,
        message,
        data,
      };

      // Buffer circular
      logs.push(entry);
      if (logs.length > MAX_LOGS) logs.shift();

      // Console
      console.log(
        `%c[${entry.time}] [${level.toUpperCase()}] ${source}`,
        COLORS[level] || COLORS.info,
        message,
        data || "",
      );

      // Emit para UI (se conectada)
      if (window.Panda && window.Panda.emit) {
        window.Panda.emit("monitor:log", entry);
      }

      // Incrementa contadores
      this._updateCounters(source, level);

      return entry;
    },

    /**
     * Wrapper para chamar função com log automático
     */
    async trace(source, method, fn) {
      this.log("trace", source, `→ ${method}()`);
      const start = performance.now();

      try {
        const result = await fn();
        const duration = (performance.now() - start).toFixed(1);
        this.log("success", source, `✓ ${method}() [${duration}ms]`);
        return result;
      } catch (error) {
        this.log("error", source, `✗ ${method}(): ${error.message}`);
        throw error; // Re-throw para sandbox tratar
      }
    },

    /**
     * Retorna árvore de status
     */
    getTree() {
      const tree = {
        sdk: {
          status: registry.sdk.status,
          uptime: Date.now() - registry.sdk.startTime,
        },
        tentacles: [],
      };

      registry.sdk.tentacles.forEach((t, name) => {
        const tentacle = {
          name,
          status: t.status,
          calls: t.calls,
          errors: t.errors,
          parent: null,
          children: [],
        };

        if (t.parent) {
          tentacle.parent = t.parent.id;
          t.parent.children.forEach((c, childName) => {
            tentacle.children.push({
              id: childName,
              status: c.status,
              calls: c.calls,
              errors: c.errors,
            });
          });
        }

        tree.tentacles.push(tentacle);
      });

      return tree;
    },

    /**
     * Retorna logs filtrados
     */
    getLogs(filter = {}) {
      let result = [...logs];

      if (filter.level) {
        result = result.filter((l) => l.level === filter.level);
      }
      if (filter.source) {
        result = result.filter((l) => l.source.includes(filter.source));
      }
      if (filter.limit) {
        result = result.slice(-filter.limit);
      }

      return result;
    },

    /**
     * Limpa logs
     */
    clearLogs() {
      logs.length = 0;
      this.log("info", "monitor", "🧹 Logs cleared");
    },

    // ===============================
    // INTERNAL
    // ===============================
    _updateCounters(source, level) {
      const parts = source.split(":");
      const t = registry.sdk.tentacles.get(parts[0]);
      if (t) {
        t.calls++;
        if (level === "error") t.errors++;

        if (parts[1] && t.parent) {
          const child = t.parent.children.get(parts[1]);
          if (child) {
            child.calls++;
            if (level === "error") child.errors++;
          }
        }
      }
    },
  };

  // ==========================================
  // 🌍 EXPORT
  // ==========================================
  window.TentacleMonitor = TentacleMonitor;

  // Alias curto
  window.TM = TentacleMonitor;

  console.log("%c🐙 TentacleMonitor Ready", "color: #6d5dfc; font-size: 14px");
})(window);
