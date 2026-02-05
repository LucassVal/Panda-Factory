/**
 * 🐼 Social Tentacle - Parent (Agrupador)
 * =======================================
 * Gerencia todos os filhos do setor Social:
 * - WhatsApp, Twitter, YouTube, Meta, TikTok
 */

(function (window) {
  "use strict";

  const TENTACLE_ID = "social";
  const TM = window.TentacleMonitor;

  // ==========================================
  // 📦 CHILDREN REGISTRY
  // ==========================================
  const children = new Map();

  // ==========================================
  // 🔧 PARENT API
  // ==========================================
  const SocialParent = {
    id: TENTACLE_ID,

    /**
     * Inicializa o tentáculo
     */
    init() {
      TM.registerTentacle(TENTACLE_ID, { category: "social-media" });
      TM.registerParent(TENTACLE_ID, "Panda.Social");
      TM.log("info", TENTACLE_ID, "📱 Social Tentacle initialized");
    },

    /**
     * Registra um child (API específica)
     */
    registerChild(name, childApi) {
      children.set(name, {
        api: childApi,
        status: "ready",
        registeredAt: Date.now(),
      });

      TM.registerChild(TENTACLE_ID, name);
      TM.setStatus(`${TENTACLE_ID}:${name}`, "ready");

      // Expõe no parent
      this.api[name] = this._wrapChild(name, childApi);

      TM.log("success", `${TENTACLE_ID}:${name}`, `✓ Child ready`);
    },

    /**
     * Wrap child with FAULT ISOLATION + TELEMETRY
     * If hook crashes, returns graceful error instead of throwing
     * Reports all activities to Founder Dashboard
     */
    _wrapChild(name, childApi) {
      const wrapped = {};
      const AT = window.AgentTelemetry;

      Object.keys(childApi).forEach((method) => {
        if (typeof childApi[method] === "function") {
          wrapped[method] = async (...args) => {
            const start = Date.now();

            try {
              const result = await Promise.race([
                childApi[method](...args),
                new Promise((_, reject) =>
                  setTimeout(
                    () => reject(new Error(`Timeout: ${name}.${method}`)),
                    30000,
                  ),
                ),
              ]);

              // Report success to Founder Dashboard
              AT?.report?.(`${TENTACLE_ID}:${name}`, method, {
                success: result?.success !== false,
                duration: Date.now() - start,
                cost: result?.cost,
              });

              return result;
            } catch (error) {
              console.error(
                `🔴 [${name}] Hook error in ${method}:`,
                error.message,
              );
              TM?.setStatus?.(`${TENTACLE_ID}:${name}`, "error");

              // Report error to Founder Dashboard
              AT?.reportError?.(`${TENTACLE_ID}:${name}`, error, { method });

              return {
                success: false,
                error: error.message,
                hook: name,
                method: method,
                isolated: true,
              };
            }
          };
        } else {
          wrapped[method] = childApi[method];
        }
      });

      return wrapped;
    },

    /**
     * Obtém status de todos os children
     */
    getStatus() {
      const status = {};
      children.forEach((child, name) => {
        status[name] = child.status;
      });
      return status;
    },

    /**
     * API exposta (Panda.Social.*)
     */
    api: {
      // Preenchido dinamicamente quando children registram
      // WhatsApp: {...},
      // Twitter: {...},
      // etc.
    },
  };

  // ==========================================
  // 🌍 EXPORT
  // ==========================================

  // Registra no SDK
  if (window.Panda) {
    window.Panda.Social = SocialParent.api;
    window.Panda._tentacles = window.Panda._tentacles || {};
    window.Panda._tentacles.social = SocialParent;
  }

  // Export global para debug
  window.SocialParent = SocialParent;

  // Auto-init se monitor disponível
  if (TM) {
    SocialParent.init();
  }
})(window);
