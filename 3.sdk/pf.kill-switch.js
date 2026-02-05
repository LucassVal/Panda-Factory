/**
 * 🐼 Panda Kill Switch
 * ====================
 * Emergency system shutdown mechanism.
 * Only Founder (Ed25519 signed) can activate.
 *
 * @version 1.0.0
 * @category security
 * @priority critical
 */

(function (window) {
  "use strict";

  const KILL_SWITCH_KEY = "PANDA_KILL_SWITCH_ACTIVE";
  const KILL_SWITCH_MESSAGE_KEY = "PANDA_KILL_SWITCH_MESSAGE";
  const KILL_SWITCH_TIMESTAMP_KEY = "PANDA_KILL_SWITCH_TIMESTAMP";

  // ==========================================
  // 🔴 KILL SWITCH MODULE
  // ==========================================
  const KillSwitch = {
    /**
     * Verifica se Kill Switch está ativo
     * @returns {boolean}
     */
    isActive() {
      try {
        return localStorage.getItem(KILL_SWITCH_KEY) === "true";
      } catch {
        return false;
      }
    },

    /**
     * Obtém mensagem do Kill Switch
     * @returns {string|null}
     */
    getMessage() {
      try {
        return localStorage.getItem(KILL_SWITCH_MESSAGE_KEY);
      } catch {
        return null;
      }
    },

    /**
     * Ativa Kill Switch (requer assinatura Founder)
     * @param {string} message - Mensagem de emergência
     * @param {string} signature - Assinatura Ed25519
     * @returns {Promise<boolean>}
     */
    async activate(message, signature) {
      // Verificar se é Founder via assinatura
      const isFounder = await this._verifyFounderSignature(
        "KILL_SWITCH_ACTIVATE",
        signature,
      );

      if (!isFounder) {
        console.error("[KillSwitch] ❌ Invalid Founder signature");
        return false;
      }

      // Ativar Kill Switch
      try {
        localStorage.setItem(KILL_SWITCH_KEY, "true");
        localStorage.setItem(KILL_SWITCH_MESSAGE_KEY, message);
        localStorage.setItem(KILL_SWITCH_TIMESTAMP_KEY, Date.now().toString());

        // Notificar backend
        await this._notifyBackend("activate", message);

        // Broadcast para todas as tabs
        this._broadcastKillSwitch(true, message);

        console.warn("[KillSwitch] 🔴 KILL SWITCH ACTIVATED:", message);
        return true;
      } catch (e) {
        console.error("[KillSwitch] Error activating:", e);
        return false;
      }
    },

    /**
     * Desativa Kill Switch (requer assinatura Founder)
     * @param {string} signature - Assinatura Ed25519
     * @returns {Promise<boolean>}
     */
    async deactivate(signature) {
      const isFounder = await this._verifyFounderSignature(
        "KILL_SWITCH_DEACTIVATE",
        signature,
      );

      if (!isFounder) {
        console.error("[KillSwitch] ❌ Invalid Founder signature");
        return false;
      }

      try {
        localStorage.removeItem(KILL_SWITCH_KEY);
        localStorage.removeItem(KILL_SWITCH_MESSAGE_KEY);
        localStorage.removeItem(KILL_SWITCH_TIMESTAMP_KEY);

        await this._notifyBackend("deactivate", "System restored");

        this._broadcastKillSwitch(false, "");

        console.log("[KillSwitch] 🟢 Kill Switch deactivated");
        return true;
      } catch (e) {
        console.error("[KillSwitch] Error deactivating:", e);
        return false;
      }
    },

    /**
     * Aplica Kill Switch na UI
     * Bloqueia interações e mostra mensagem
     */
    enforceUI() {
      if (!this.isActive()) return;

      const message = this.getMessage() || "Sistema em manutenção";

      // Criar overlay de bloqueio
      const overlay = document.createElement("div");
      overlay.id = "panda-kill-switch-overlay";
      overlay.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.95);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 999999;
          color: white;
          font-family: system-ui, sans-serif;
        ">
          <div style="font-size: 64px; margin-bottom: 24px;">🔴</div>
          <h1 style="font-size: 32px; margin-bottom: 16px;">Kill Switch Ativo</h1>
          <p style="font-size: 18px; opacity: 0.8; max-width: 500px; text-align: center;">
            ${message}
          </p>
          <p style="margin-top: 32px; opacity: 0.5; font-size: 14px;">
            Contato: suporte@panda.com
          </p>
        </div>
      `;

      document.body.appendChild(overlay);

      // Bloquear todas as interações
      document.body.style.pointerEvents = "none";
      overlay.style.pointerEvents = "auto";
    },

    /**
     * Verifica assinatura do Founder
     * @private
     */
    async _verifyFounderSignature(action, signature) {
      // Em produção: verificar via Panda.Crypto.verify
      if (window.Panda?.Crypto?.verify) {
        return window.Panda.Crypto.verify(action, signature);
      }

      // Fallback: verificar via backend
      try {
        const result = await window.Panda?.callGAS("verify_founder_signature", {
          action,
          signature,
        });
        return result?.valid === true;
      } catch {
        return false;
      }
    },

    /**
     * Notifica backend sobre estado do Kill Switch
     * @private
     */
    async _notifyBackend(action, message) {
      try {
        await window.Panda?.callGAS("kill_switch_update", {
          action,
          message,
          timestamp: Date.now(),
        });
      } catch (e) {
        console.error("[KillSwitch] Backend notification failed:", e);
      }
    },

    /**
     * Broadcast para outras tabs via BroadcastChannel
     * @private
     */
    _broadcastKillSwitch(active, message) {
      try {
        const channel = new BroadcastChannel("panda_kill_switch");
        channel.postMessage({ active, message, timestamp: Date.now() });
        channel.close();
      } catch {
        // BroadcastChannel não suportado
      }
    },

    /**
     * Inicializa listener para broadcasts
     */
    initListener() {
      try {
        const channel = new BroadcastChannel("panda_kill_switch");
        channel.onmessage = (event) => {
          const { active } = event.data;
          if (active) {
            localStorage.setItem(KILL_SWITCH_KEY, "true");
            localStorage.setItem(KILL_SWITCH_MESSAGE_KEY, event.data.message);
            this.enforceUI();
          } else {
            localStorage.removeItem(KILL_SWITCH_KEY);
            location.reload();
          }
        };
      } catch {
        // BroadcastChannel não suportado
      }

      // Verificar estado inicial
      if (this.isActive()) {
        this.enforceUI();
      }
    },
  };

  // ==========================================
  // 🌍 EXPORT
  // ==========================================
  if (window.Panda) {
    window.Panda.KillSwitch = KillSwitch;
  }

  window.PandaKillSwitch = KillSwitch;

  // Auto-init listener
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      KillSwitch.initListener(),
    );
  } else {
    KillSwitch.initListener();
  }
})(window);
