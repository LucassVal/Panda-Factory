/**
 * 🐼 Panda DRM - Token-Based Content Protection
 * =============================================
 * Protege conteúdo digital com tokens vinculados ao PC do usuário.
 *
 * @version 1.0.0
 * @category security
 * @priority high
 */

(function (window) {
  "use strict";

  // ==========================================
  // 🔐 DRM MODULE
  // ==========================================
  const DRM = {
    /**
     * Gera token de acesso para conteúdo
     * @param {string} contentId - ID do conteúdo
     * @param {string} userId - ID do usuário
     * @param {object} options - Opções de proteção
     * @returns {Promise<object>} Token de acesso
     */
    async generateToken(contentId, userId, options = {}) {
      const {
        expiresIn = 24 * 60 * 60 * 1000, // 24h default
        maxDevices = 3,
        allowOffline = true,
      } = options;

      // Fingerprint do dispositivo
      const deviceId = await this.getDeviceFingerprint();

      // Gera token via backend
      const result = await window.Panda?.callGAS("drm_generate_token", {
        contentId,
        userId,
        deviceId,
        expiresAt: Date.now() + expiresIn,
        maxDevices,
        allowOffline,
      });

      if (result?.token) {
        // Cache local para offline
        this._cacheToken(contentId, result.token);
      }

      return result;
    },

    /**
     * Valida token de acesso
     * @param {string} token - Token a validar
     * @param {string} contentId - ID do conteúdo
     * @returns {Promise<object>} Resultado da validação
     */
    async validateToken(token, contentId) {
      // Primeiro verifica cache local (para offline)
      const cached = this._getCachedToken(contentId);
      if (cached && cached.token === token) {
        const isExpired = Date.now() > cached.expiresAt;
        if (!isExpired) {
          return { valid: true, source: "cache", expiresAt: cached.expiresAt };
        }
      }

      // Valida no backend
      try {
        const deviceId = await this.getDeviceFingerprint();
        const result = await window.Panda?.callGAS("drm_validate_token", {
          token,
          contentId,
          deviceId,
        });

        return result;
      } catch (e) {
        // Offline: usa cache se disponível
        if (cached?.allowOffline) {
          return {
            valid: true,
            source: "offline",
            expiresAt: cached.expiresAt,
          };
        }
        return { valid: false, error: "offline_no_cache" };
      }
    },

    /**
     * Revoga token (Founder/Admin only)
     * @param {string} token - Token a revogar
     * @param {string} reason - Motivo
     * @returns {Promise<boolean>}
     */
    async revokeToken(token, reason = "") {
      const result = await window.Panda?.callGAS("drm_revoke_token", {
        token,
        reason,
        revokedAt: Date.now(),
      });

      // Remove do cache local
      this._clearCachedToken(token);

      return result?.success || false;
    },

    /**
     * Protege conteúdo com marca d'água invisível
     * @param {HTMLElement} element - Elemento a proteger
     * @param {string} userId - ID do usuário (para rastreamento)
     */
    applyWatermark(element, userId) {
      const watermark = document.createElement("div");
      watermark.className = "panda-drm-watermark";
      watermark.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.02;
        background: repeating-linear-gradient(
          45deg,
          transparent,
          transparent 50px,
          rgba(0,0,0,0.1) 50px,
          rgba(0,0,0,0.1) 100px
        );
        z-index: 9999;
      `;

      // ID invisível para rastreamento
      watermark.dataset.userId = btoa(userId);
      watermark.dataset.timestamp = Date.now();

      element.style.position = "relative";
      element.appendChild(watermark);
    },

    /**
     * Bloqueia PrintScreen/Screenshots
     * @param {HTMLElement} container - Container a proteger
     */
    blockScreenCapture(container) {
      // Detecta PrintScreen
      document.addEventListener("keyup", (e) => {
        if (e.key === "PrintScreen") {
          navigator.clipboard.writeText("");
          this._showBlockMessage(container, "Screenshot bloqueado");
        }
      });

      // Blur quando perde foco (evita window capture)
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          container.style.filter = "blur(20px)";
        } else {
          container.style.filter = "none";
        }
      });

      // Bloqueia right-click
      container.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this._showBlockMessage(container, "Download não permitido");
      });
    },

    /**
     * Gera fingerprint do dispositivo
     * @returns {Promise<string>}
     */
    async getDeviceFingerprint() {
      const components = [];

      // Screen
      components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);

      // Timezone
      components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

      // Language
      components.push(navigator.language);

      // Platform
      components.push(navigator.platform);

      // Hardware concurrency
      components.push(navigator.hardwareConcurrency || 0);

      // Canvas fingerprint
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.textBaseline = "top";
        ctx.font = "14px Arial";
        ctx.fillText("Panda DRM Fingerprint", 2, 2);
        components.push(canvas.toDataURL().slice(-50));
      } catch {
        components.push("no-canvas");
      }

      // WebGL
      try {
        const gl = document.createElement("canvas").getContext("webgl");
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
        }
      } catch {
        components.push("no-webgl");
      }

      // Hash tudo
      const fingerprint = components.join("|");
      return await this._hash(fingerprint);
    },

    // ==========================================
    // 🔧 HELPERS
    // ==========================================

    async _hash(str) {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    },

    _cacheToken(contentId, tokenData) {
      try {
        const cache = JSON.parse(
          localStorage.getItem("panda_drm_cache") || "{}",
        );
        cache[contentId] = { ...tokenData, cachedAt: Date.now() };
        localStorage.setItem("panda_drm_cache", JSON.stringify(cache));
      } catch {}
    },

    _getCachedToken(contentId) {
      try {
        const cache = JSON.parse(
          localStorage.getItem("panda_drm_cache") || "{}",
        );
        return cache[contentId];
      } catch {
        return null;
      }
    },

    _clearCachedToken(contentId) {
      try {
        const cache = JSON.parse(
          localStorage.getItem("panda_drm_cache") || "{}",
        );
        delete cache[contentId];
        localStorage.setItem("panda_drm_cache", JSON.stringify(cache));
      } catch {}
    },

    _showBlockMessage(container, message) {
      const msg = document.createElement("div");
      msg.textContent = `🔒 ${message}`;
      msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 20px 40px;
        border-radius: 8px;
        font-size: 18px;
        z-index: 99999;
      `;
      container.appendChild(msg);
      setTimeout(() => msg.remove(), 2000);
    },
  };

  // ==========================================
  // 🌍 EXPORT
  // ==========================================
  if (window.Panda) {
    window.Panda.DRM = DRM;
  }

  window.PandaDRM = DRM;
})(window);
