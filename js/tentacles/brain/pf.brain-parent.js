/**
 * 🐼 Brain Tentacle - Parent (Agrupador)
 * ======================================
 * Gerencia todos os filhos do setor IA:
 * - Gemini, Local LLM, GPU Detection
 */

(function (window) {
  "use strict";

  const TENTACLE_ID = "brain";
  const TM = window.TentacleMonitor;

  const children = new Map();

  const BrainParent = {
    id: TENTACLE_ID,

    init() {
      TM.registerTentacle(TENTACLE_ID, { category: "ai-intelligence" });
      TM.registerParent(TENTACLE_ID, "Panda.Brain");
      TM.log("info", TENTACLE_ID, "🧠 Brain Tentacle initialized");
    },

    registerChild(name, childApi) {
      children.set(name, {
        api: childApi,
        status: "ready",
        registeredAt: Date.now(),
      });

      TM.registerChild(TENTACLE_ID, name);
      TM.setStatus(`${TENTACLE_ID}:${name}`, "ready");
      this.api[name] = this._wrapChild(name, childApi);
      TM.log("success", `${TENTACLE_ID}:${name}`, `✓ Child ready`);
    },

    _wrapChild(name, childApi) {
      const wrapped = {};
      Object.keys(childApi).forEach((method) => {
        if (typeof childApi[method] === "function") {
          wrapped[method] = async (...args) => {
            return TM.trace(`${TENTACLE_ID}:${name}`, method, async () => {
              try {
                return await childApi[method](...args);
              } catch (error) {
                TM.setStatus(`${TENTACLE_ID}:${name}`, "error");
                throw error;
              }
            });
          };
        } else {
          wrapped[method] = childApi[method];
        }
      });
      return wrapped;
    },

    getStatus() {
      const status = {};
      children.forEach((child, name) => {
        status[name] = child.status;
      });
      return status;
    },

    api: {},
  };

  if (window.Panda) {
    window.Panda.Brain = BrainParent.api;
    window.Panda._tentacles = window.Panda._tentacles || {};
    window.Panda._tentacles.brain = BrainParent;
  }

  window.BrainParent = BrainParent;
  if (TM) BrainParent.init();
})(window);
