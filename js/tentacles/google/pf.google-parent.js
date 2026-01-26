/**
 * 🐼 Google Tentacle - Parent (Agrupador)
 * =======================================
 * Gerencia todos os filhos do setor Google:
 * - Drive, Sheets, Colab, Firebase, Calendar, Docs, Gmail, YouTube
 *
 * @version 1.0.0
 * @category tentacle
 * @priority critical
 */

(function (window) {
  "use strict";

  const TENTACLE_ID = "google";
  const TM = window.TentacleMonitor;

  // ==========================================
  // 📦 CHILDREN REGISTRY
  // ==========================================
  const children = new Map();

  // ==========================================
  // 🔧 GOOGLE SCOPES (Para OAuth)
  // ==========================================
  const SCOPES = {
    drive: "https://www.googleapis.com/auth/drive",
    sheets: "https://www.googleapis.com/auth/spreadsheets",
    calendar: "https://www.googleapis.com/auth/calendar",
    gmail: "https://www.googleapis.com/auth/gmail.send",
    docs: "https://www.googleapis.com/auth/documents",
    youtube: "https://www.googleapis.com/auth/youtube.readonly",
  };

  // ==========================================
  // 🔧 PARENT API
  // ==========================================
  const GoogleParent = {
    id: TENTACLE_ID,
    scopes: SCOPES,

    /**
     * Inicializa o tentáculo
     */
    init() {
      if (!TM) {
        console.warn("[Google] TentacleMonitor not available");
        return;
      }
      TM.registerTentacle(TENTACLE_ID, {
        category: "google-services",
        priority: "critical",
      });
      TM.registerParent(TENTACLE_ID, "Panda.Google");
      TM.log("info", TENTACLE_ID, "🔥 Google Tentacle initialized");
    },

    /**
     * Registra um child (API específica)
     * @param {string} name - Nome do child (ex: 'drive', 'sheets')
     * @param {object} childApi - API do child
     */
    registerChild(name, childApi) {
      children.set(name, {
        api: childApi,
        status: "ready",
        registeredAt: Date.now(),
      });

      if (TM) {
        TM.registerChild(TENTACLE_ID, name);
        TM.setStatus(`${TENTACLE_ID}:${name}`, "ready");
      }

      // Expõe no parent
      this.api[name] = this._wrapChild(name, childApi);

      if (TM) {
        TM.log("success", `${TENTACLE_ID}:${name}`, `✓ Child ready`);
      }
      console.log(`[Google] ✓ ${name} registered`);
    },

    /**
     * Wrap child com sandbox + logging
     * @param {string} name - Nome do child
     * @param {object} childApi - API do child
     * @returns {object} API wrapped
     */
    _wrapChild(name, childApi) {
      const wrapped = {};

      Object.keys(childApi).forEach((method) => {
        if (typeof childApi[method] === "function") {
          wrapped[method] = async (...args) => {
            if (TM) {
              return TM.trace(`${TENTACLE_ID}:${name}`, method, async () => {
                try {
                  return await childApi[method](...args);
                } catch (error) {
                  TM.setStatus(`${TENTACLE_ID}:${name}`, "error");
                  throw error;
                }
              });
            } else {
              return await childApi[method](...args);
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
     * @returns {object} Status map
     */
    getStatus() {
      const status = {};
      children.forEach((child, name) => {
        status[name] = child.status;
      });
      return status;
    },

    /**
     * Lista children disponíveis
     * @returns {string[]} Lista de nomes
     */
    listChildren() {
      return Array.from(children.keys());
    },

    /**
     * Verifica se child existe
     * @param {string} name - Nome do child
     * @returns {boolean}
     */
    hasChild(name) {
      return children.has(name);
    },

    /**
     * API exposta (Panda.Google.*)
     */
    api: {
      // Preenchido dinamicamente quando children registram
      // Drive: {...},
      // Sheets: {...},
      // Colab: {...},
      // etc.
    },
  };

  // ==========================================
  // 🌍 EXPORT
  // ==========================================

  // Registra no SDK
  if (window.Panda) {
    window.Panda.Google = GoogleParent.api;
    window.Panda._tentacles = window.Panda._tentacles || {};
    window.Panda._tentacles.google = GoogleParent;
  }

  // Export global para debug
  window.GoogleParent = GoogleParent;

  // Auto-init
  GoogleParent.init();
})(window);
