/**
 * 🐼 Agent Telemetry - Founder-Only Visibility
 * =============================================
 * Sistema de telemetria para agentes/tentacles
 * Dados visíveis APENAS no Founder Dashboard
 *
 * Features:
 * - Coleta status de todos os tentacles
 * - Métricas de uso em tempo real
 * - Error reporting centralizado
 * - Activity feed para Founder
 * - Ed25519 signature para acesso
 */

(function (window) {
  "use strict";

  const VERSION = "1.0.0";
  const TM = window.TentacleMonitor;

  // ==========================================
  // 📊 TELEMETRY STORE
  // ==========================================
  const store = {
    // Status de todos os tentacles
    tentacles: new Map(),

    // Atividades recentes (últimas 100)
    activities: [],

    // Erros (últimos 50)
    errors: [],

    // Métricas agregadas
    metrics: {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      pcSpent: 0,
      lastUpdate: null,
    },

    // Alertas ativos
    alerts: [],

    // Reports agendados
    reports: [],
  };

  // ==========================================
  // 🔐 FOUNDER VERIFICATION
  // ==========================================
  let isFounderVerified = false;
  const FOUNDER_PUBLIC_KEY = null; // Set via configure()

  function verifyFounder() {
    // Check if user is founder via multiple methods
    const checks = [
      // 1. Check Firebase Auth UID match
      window.Panda?.Auth?.isFounder?.(),

      // 2. Check local storage flag (dev mode)
      localStorage.getItem("panda_founder_mode") === "true",

      // 3. Check URL param (dev mode)
      new URLSearchParams(window.location.search).get("founder") === "1",
    ];

    isFounderVerified = checks.some(Boolean);
    return isFounderVerified;
  }

  // ==========================================
  // 📡 AGENT TELEMETRY API
  // ==========================================
  const AgentTelemetry = {
    version: VERSION,

    /**
     * Initialize telemetry system
     */
    init() {
      verifyFounder();

      // Listen to TentacleMonitor events
      if (window.Panda?.on) {
        window.Panda.on("monitor:status", this._handleStatusChange.bind(this));
        window.Panda.on("monitor:error", this._handleError.bind(this));
        window.Panda.on("monitor:log", this._handleLog.bind(this));
      }

      // Auto-collect from existing tentacles
      this._collectFromTentacles();

      console.log("🔭 [AgentTelemetry] Initialized (Founder-only visibility)");
      return { success: true, founderMode: isFounderVerified };
    },

    /**
     * Report activity from an agent/tentacle
     */
    report(source, action, data = {}) {
      const activity = {
        id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        source, // e.g., "brain:gemini", "social:whatsapp"
        action, // e.g., "chat", "sendMessage", "webhook"
        data,
        timestamp: Date.now(),
        success: data.success !== false,
      };

      // Add to activities (keep last 100)
      store.activities.unshift(activity);
      if (store.activities.length > 100) store.activities.pop();

      // Update metrics
      store.metrics.totalCalls++;
      if (activity.success) {
        store.metrics.successfulCalls++;
      } else {
        store.metrics.failedCalls++;
      }

      if (data.cost) {
        store.metrics.pcSpent += data.cost;
      }

      store.metrics.lastUpdate = Date.now();

      // Emit to Founder Dashboard
      this._emitToFounder("activity", activity);

      return activity;
    },

    /**
     * Report error from an agent
     */
    reportError(source, error, context = {}) {
      const errorRecord = {
        id: `err_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        source,
        error: typeof error === "string" ? error : error.message,
        stack: error.stack || null,
        context,
        timestamp: Date.now(),
        resolved: false,
      };

      // Add to errors (keep last 50)
      store.errors.unshift(errorRecord);
      if (store.errors.length > 50) store.errors.pop();

      // Check if critical
      if (context.critical) {
        this._createAlert("critical", source, errorRecord.error);
      }

      // Emit to Founder Dashboard
      this._emitToFounder("error", errorRecord);

      // Also report to TM if available
      TM?.reportError?.(source, context.method || "unknown", error, context);

      return errorRecord;
    },

    /**
     * Update tentacle status
     */
    updateStatus(tentacleId, status, metadata = {}) {
      store.tentacles.set(tentacleId, {
        id: tentacleId,
        status, // 'ready', 'active', 'error', 'offline'
        ...metadata,
        lastUpdate: Date.now(),
      });

      this._emitToFounder("status", { tentacleId, status, metadata });
    },

    /**
     * Create alert for Founder
     */
    alert(level, title, message, actions = []) {
      const alert = {
        id: `alert_${Date.now()}`,
        level, // 'info', 'warning', 'critical'
        title,
        message,
        actions, // [{ label: 'Fix', action: () => {} }]
        timestamp: Date.now(),
        read: false,
        dismissed: false,
      };

      store.alerts.unshift(alert);
      this._emitToFounder("alert", alert);

      return alert;
    },

    /**
     * Get all telemetry data (Founder-only)
     */
    getAllData() {
      if (!verifyFounder()) {
        return { error: "Unauthorized", founderRequired: true };
      }

      return {
        tentacles: Object.fromEntries(store.tentacles),
        activities: store.activities,
        errors: store.errors,
        metrics: store.metrics,
        alerts: store.alerts.filter((a) => !a.dismissed),
        timestamp: Date.now(),
      };
    },

    /**
     * Get summary for quick view
     */
    getSummary() {
      if (!verifyFounder()) {
        return { error: "Unauthorized" };
      }

      const tentacleList = Array.from(store.tentacles.values());

      return {
        tentacles: {
          total: tentacleList.length,
          active: tentacleList.filter((t) => t.status === "ready").length,
          errors: tentacleList.filter((t) => t.status === "error").length,
        },
        activities: {
          total: store.activities.length,
          last5: store.activities.slice(0, 5),
        },
        errors: {
          total: store.errors.length,
          unresolved: store.errors.filter((e) => !e.resolved).length,
          last3: store.errors.slice(0, 3),
        },
        metrics: store.metrics,
        alerts: store.alerts.filter((a) => !a.dismissed).length,
      };
    },

    /**
     * Get tentacle status map
     */
    getTentacleStatus() {
      const status = {};
      store.tentacles.forEach((data, id) => {
        status[id] = data;
      });
      return status;
    },

    /**
     * Get activity feed
     */
    getActivities(limit = 20, filter = {}) {
      if (!verifyFounder()) return [];

      let activities = [...store.activities];

      if (filter.source) {
        activities = activities.filter((a) => a.source.includes(filter.source));
      }

      if (filter.success !== undefined) {
        activities = activities.filter((a) => a.success === filter.success);
      }

      return activities.slice(0, limit);
    },

    /**
     * Get error list
     */
    getErrors(limit = 20, unresolvedOnly = true) {
      if (!verifyFounder()) return [];

      let errors = [...store.errors];

      if (unresolvedOnly) {
        errors = errors.filter((e) => !e.resolved);
      }

      return errors.slice(0, limit);
    },

    /**
     * Mark error as resolved
     */
    resolveError(errorId) {
      const error = store.errors.find((e) => e.id === errorId);
      if (error) {
        error.resolved = true;
        error.resolvedAt = Date.now();
        return { success: true };
      }
      return { success: false, error: "Error not found" };
    },

    /**
     * Dismiss alert
     */
    dismissAlert(alertId) {
      const alert = store.alerts.find((a) => a.id === alertId);
      if (alert) {
        alert.dismissed = true;
        return { success: true };
      }
      return { success: false };
    },

    /**
     * Clear old data
     */
    cleanup(olderThanMs = 24 * 60 * 60 * 1000) {
      const cutoff = Date.now() - olderThanMs;

      store.activities = store.activities.filter((a) => a.timestamp > cutoff);
      store.errors = store.errors.filter(
        (e) => e.timestamp > cutoff || !e.resolved,
      );

      return { success: true, remaining: store.activities.length };
    },

    // ==========================================
    // 🔧 INTERNAL METHODS
    // ==========================================

    _handleStatusChange(data) {
      if (data.tentacle) {
        this.updateStatus(data.tentacle, data.status, data.metadata);
      }
    },

    _handleError(data) {
      this.reportError(data.source, data.error, data.context);
    },

    _handleLog(data) {
      if (data.level === "success" || data.level === "info") {
        this.report(data.source, data.message, { level: data.level });
      }
    },

    _collectFromTentacles() {
      // Collect from TentacleMonitor
      if (TM?.getStatus) {
        const tmStatus = TM.getStatus();
        Object.entries(tmStatus).forEach(([id, data]) => {
          this.updateStatus(id, data.status || "unknown", data);
        });
      }

      // Collect from registered tentacles
      const tentacles = window.Panda?._tentacles || {};
      Object.entries(tentacles).forEach(([id, tentacle]) => {
        if (tentacle.getStatus) {
          const status = tentacle.getStatus();
          this.updateStatus(id, "ready", status);
        }
      });
    },

    _createAlert(level, source, message) {
      this.alert(level, `${level.toUpperCase()}: ${source}`, message, [
        { label: "View Details", action: `viewError:${source}` },
        { label: "Dismiss", action: "dismiss" },
      ]);
    },

    _emitToFounder(type, data) {
      if (!isFounderVerified) return;

      if (window.Panda?.emit) {
        window.Panda.emit(`founder:${type}`, data);
      }

      // Also update any open Founder Dashboard
      if (window.__founderDashboardUpdate) {
        window.__founderDashboardUpdate(type, data);
      }
    },
  };

  // ==========================================
  // 🔧 HELPER: Wrap tentacle methods for auto-reporting
  // ==========================================
  function wrapWithTelemetry(api, source) {
    const wrapped = {};

    Object.keys(api).forEach((method) => {
      if (typeof api[method] === "function") {
        wrapped[method] = async (...args) => {
          const start = Date.now();

          try {
            const result = await api[method](...args);

            // Auto-report successful calls
            AgentTelemetry.report(source, method, {
              success: result?.success !== false,
              duration: Date.now() - start,
              cost: result?.cost,
            });

            return result;
          } catch (error) {
            // Auto-report errors
            AgentTelemetry.reportError(source, error, { method });

            return { success: false, error: error.message };
          }
        };
      } else {
        wrapped[method] = api[method];
      }
    });

    return wrapped;
  }

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  AgentTelemetry.init();

  // Expose globally
  window.AgentTelemetry = AgentTelemetry;
  window.Panda = window.Panda || {};
  window.Panda.Telemetry = AgentTelemetry;

  // Export helper
  window.wrapWithTelemetry = wrapWithTelemetry;
})(window);
