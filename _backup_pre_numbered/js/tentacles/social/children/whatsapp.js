/**
 * 🐼 WhatsApp Child - Social Tentacle
 * ====================================
 * Filho do Social Parent para API WhatsApp
 *
 * Features:
 * - Evolution API / Baileys integration
 * - QR Code management
 * - Webhook handling
 * - Bulk messaging with rate limits
 * - AI-powered chatbot integration
 * - Template management
 */

(function (window) {
  "use strict";

  const PARENT = "social";
  const CHILD_ID = "WhatsApp";
  const TM = window.TentacleMonitor;

  // ==========================================
  // 🔧 CONFIGURATION
  // ==========================================
  const CONFIG = {
    // Evolution API (self-hosted)
    evolutionUrl: "http://localhost:8080",
    evolutionApiKey: null,

    // Baileys (alternative)
    baileysUrl: null,

    // Rate limits
    rateLimit: {
      messagesPerMinute: 30,
      bulkDelay: 1000, // ms between bulk messages
    },

    // Webhook endpoint for receiving messages
    webhookSecret: null,
  };

  // ==========================================
  // 💰 COSTS (PC por ação)
  // ==========================================
  const COSTS = {
    SEND_MESSAGE: 1,
    SEND_BULK: 2,
    SEND_MEDIA: 3,
    CHATBOT_RESPONSE: 10,
    CAMPAIGN: 20,
    TEMPLATE_AI: 15,
    QR_SCAN: 0, // Free
  };

  // ==========================================
  // 📊 STATE
  // ==========================================
  let state = {
    connected: false,
    qrCode: null,
    qrExpiry: null,
    instanceId: null,
    lastSync: null,
    backend: null, // 'evolution' | 'baileys' | 'mock'
  };

  // ==========================================
  // 🔧 WHATSAPP API
  // ==========================================
  const WhatsAppAPI = {
    id: CHILD_ID,
    name: "WhatsApp",
    icon: "📱",

    /**
     * Configure API connection
     */
    configure(options = {}) {
      if (options.evolutionUrl) CONFIG.evolutionUrl = options.evolutionUrl;
      if (options.evolutionApiKey)
        CONFIG.evolutionApiKey = options.evolutionApiKey;
      if (options.baileysUrl) CONFIG.baileysUrl = options.baileysUrl;
      if (options.webhookSecret) CONFIG.webhookSecret = options.webhookSecret;

      log("Configuration updated");
      return { success: true, config: CONFIG };
    },

    /**
     * Connect to WhatsApp (get QR or restore session)
     */
    async connect(instanceName = "panda-default") {
      try {
        // Try Evolution API first
        if (CONFIG.evolutionApiKey) {
          const response = await fetch(
            `${CONFIG.evolutionUrl}/instance/create`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: CONFIG.evolutionApiKey,
              },
              body: JSON.stringify({
                instanceName,
                qrcode: true,
                webhook: CONFIG.webhookSecret ? true : false,
              }),
            },
          );

          if (response.ok) {
            const data = await response.json();
            state.backend = "evolution";
            state.instanceId = instanceName;
            state.qrCode = data.qrcode?.base64 || null;
            state.qrExpiry = Date.now() + 60000; // 60s expiry

            log(`Evolution API connected: ${instanceName}`);
            return {
              success: true,
              backend: "evolution",
              qrCode: state.qrCode,
              needsQr: !data.instance?.state?.includes("open"),
            };
          }
        }

        // Fallback to mock mode
        log("No API configured, using mock mode");
        state.backend = "mock";
        state.connected = true;
        state.instanceId = instanceName;

        return {
          success: true,
          backend: "mock",
          note: "Using mock mode. Configure Evolution API for real messaging.",
        };
      } catch (error) {
        log("ERROR: " + error.message);
        return { success: false, error: error.message };
      }
    },

    /**
     * Get QR Code for pairing
     */
    async getQR(instanceName = state.instanceId || "panda-default") {
      if (state.backend === "evolution" && CONFIG.evolutionApiKey) {
        try {
          const response = await fetch(
            `${CONFIG.evolutionUrl}/instance/connect/${instanceName}`,
            {
              headers: { apikey: CONFIG.evolutionApiKey },
            },
          );

          if (response.ok) {
            const data = await response.json();
            state.qrCode = data.base64;
            state.qrExpiry = Date.now() + 60000;

            return {
              success: true,
              qrCode: state.qrCode,
              expiresIn: 60,
            };
          }
        } catch (error) {
          return { success: false, error: error.message };
        }
      }

      // Mock QR
      return {
        success: true,
        qrCode: "data:image/png;base64,MOCK_QR_CODE",
        expiresIn: 60,
        note: "Mock mode - configure Evolution API",
      };
    },

    /**
     * Check connection status
     */
    async checkStatus() {
      if (state.backend === "evolution" && CONFIG.evolutionApiKey) {
        try {
          const response = await fetch(
            `${CONFIG.evolutionUrl}/instance/connectionState/${state.instanceId}`,
            {
              headers: { apikey: CONFIG.evolutionApiKey },
            },
          );

          if (response.ok) {
            const data = await response.json();
            state.connected = data.state === "open";
            return {
              connected: state.connected,
              state: data.state,
              backend: "evolution",
            };
          }
        } catch (error) {
          return { connected: false, error: error.message };
        }
      }

      return {
        connected: state.connected,
        backend: state.backend,
        mock: state.backend === "mock",
      };
    },

    /**
     * Send text message
     */
    async sendMessage(to, message, options = {}) {
      // Normalize phone number
      const phone = _normalizePhone(to);

      if (state.backend === "evolution" && CONFIG.evolutionApiKey) {
        try {
          const response = await fetch(
            `${CONFIG.evolutionUrl}/message/sendText/${state.instanceId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: CONFIG.evolutionApiKey,
              },
              body: JSON.stringify({
                number: phone,
                text: message,
                delay: options.delay || 1000,
              }),
            },
          );

          if (response.ok) {
            const data = await response.json();
            _chargePanda(COSTS.SEND_MESSAGE);

            return {
              success: true,
              messageId: data.key?.id || `wa_${Date.now()}`,
              to: phone,
              cost: COSTS.SEND_MESSAGE,
            };
          }
        } catch (error) {
          return { success: false, error: error.message };
        }
      }

      // Mock mode
      await _delay(300);
      return {
        success: true,
        messageId: `wa_mock_${Date.now()}`,
        to: phone,
        cost: COSTS.SEND_MESSAGE,
        mock: true,
      };
    },

    /**
     * Send media (image, video, audio, document)
     */
    async sendMedia(to, mediaUrl, options = {}) {
      const phone = _normalizePhone(to);
      const mediaType = options.type || _detectMediaType(mediaUrl);

      if (state.backend === "evolution" && CONFIG.evolutionApiKey) {
        const endpoint = `message/send${_capitalizeFirst(mediaType)}`;

        try {
          const response = await fetch(
            `${CONFIG.evolutionUrl}/${endpoint}/${state.instanceId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: CONFIG.evolutionApiKey,
              },
              body: JSON.stringify({
                number: phone,
                [mediaType]: mediaUrl,
                caption: options.caption || "",
              }),
            },
          );

          if (response.ok) {
            const data = await response.json();
            _chargePanda(COSTS.SEND_MEDIA);

            return {
              success: true,
              messageId: data.key?.id,
              to: phone,
              mediaType,
              cost: COSTS.SEND_MEDIA,
            };
          }
        } catch (error) {
          return { success: false, error: error.message };
        }
      }

      // Mock
      await _delay(500);
      return {
        success: true,
        messageId: `wa_media_${Date.now()}`,
        to: phone,
        mediaType,
        cost: COSTS.SEND_MEDIA,
        mock: true,
      };
    },

    /**
     * Send bulk messages with rate limiting
     */
    async sendBulk(numbers, message, options = {}) {
      const results = [];
      const delay = options.delay || CONFIG.rateLimit.bulkDelay;

      for (let i = 0; i < numbers.length; i++) {
        const result = await this.sendMessage(numbers[i], message, options);
        results.push({ phone: numbers[i], ...result });

        // Rate limit
        if (i < numbers.length - 1) {
          await _delay(delay);
        }

        // Progress callback
        if (options.onProgress) {
          options.onProgress({
            current: i + 1,
            total: numbers.length,
            percent: Math.round(((i + 1) / numbers.length) * 100),
          });
        }
      }

      const successful = results.filter((r) => r.success).length;

      return {
        success: true,
        sent: successful,
        failed: results.length - successful,
        total: results.length,
        results,
        cost: successful * COSTS.SEND_BULK,
      };
    },

    /**
     * AI Chatbot response (integrates with Brain)
     */
    async chatbotRespond(conversationId, userMessage, options = {}) {
      let response;

      // Use Brain Gemini if available
      if (window.Panda?.Brain?.Gemini?.chat) {
        const gem = options.gem || "writer";
        const result = await window.Panda.Brain.Gemini.chat(userMessage, {
          gem,
        });

        response = result.text || result.error || "Desculpe, tente novamente.";
      } else {
        // Fallback mock
        await _delay(800);
        response = `[AI Mock] Processando: ${userMessage.slice(0, 50)}...`;
      }

      _chargePanda(COSTS.CHATBOT_RESPONSE);

      return {
        success: true,
        response,
        conversationId,
        cost: COSTS.CHATBOT_RESPONSE,
      };
    },

    /**
     * Generate message template with AI
     */
    async generateTemplate(context) {
      if (window.Panda?.Brain?.Gemini?.write) {
        const result = await window.Panda.Brain.Gemini.chat(
          `Crie um template de WhatsApp para: ${context.objective}. 
          Público: ${context.audience || "geral"}. 
          Tom: ${context.tone || "profissional"}.
          Use variáveis como {{nome}}, {{produto}}.`,
          { gem: "writer" },
        );

        _chargePanda(COSTS.TEMPLATE_AI);

        return {
          success: true,
          template: result.text,
          variables: _extractVariables(result.text),
          cost: COSTS.TEMPLATE_AI,
        };
      }

      // Mock
      await _delay(1200);
      return {
        success: true,
        template: `Olá {{nome}}! ${context.objective || "Confira nossa oferta"}...`,
        variables: ["nome"],
        cost: COSTS.TEMPLATE_AI,
        mock: true,
      };
    },

    /**
     * Create scheduled campaign
     */
    async createCampaign(config) {
      await _delay(500);

      const campaign = {
        id: `camp_${Date.now()}`,
        name: config.name || "Nova Campanha",
        message: config.message,
        recipients: config.recipients || [],
        scheduledAt: config.scheduledAt || null,
        status: config.scheduledAt ? "scheduled" : "draft",
        createdAt: Date.now(),
      };

      // Store campaign (would save to Panda.Data in production)
      if (window.Panda?.Data?.save) {
        await window.Panda.Data.save("whatsapp_campaigns", campaign);
      }

      _chargePanda(COSTS.CAMPAIGN);

      return {
        success: true,
        campaign,
        cost: COSTS.CAMPAIGN,
      };
    },

    /**
     * Handle incoming webhook
     */
    handleWebhook(payload, signature = null) {
      // Verify signature if configured
      if (CONFIG.webhookSecret && signature) {
        // TODO: Implement HMAC verification
      }

      const event = payload.event || payload.action;
      const data = payload.data || payload;

      // Emit event for listeners
      if (window.Panda?.emit) {
        window.Panda.emit(`whatsapp:${event}`, data);
      }

      log(`Webhook received: ${event}`);

      return { success: true, event, processed: true };
    },

    /**
     * Disconnect instance
     */
    async disconnect() {
      if (state.backend === "evolution" && CONFIG.evolutionApiKey) {
        try {
          await fetch(
            `${CONFIG.evolutionUrl}/instance/logout/${state.instanceId}`,
            {
              method: "DELETE",
              headers: { apikey: CONFIG.evolutionApiKey },
            },
          );
        } catch (error) {
          // Ignore disconnect errors
        }
      }

      state.connected = false;
      state.qrCode = null;
      log("Disconnected");

      return { success: true };
    },

    /**
     * Get status summary
     */
    getStatus() {
      return {
        connected: state.connected,
        backend: state.backend,
        instanceId: state.instanceId,
        qrRequired: !state.connected && state.backend !== "mock",
        lastSync: state.lastSync,
        costs: COSTS,
      };
    },

    /**
     * Check if configured
     */
    isConfigured() {
      return !!CONFIG.evolutionApiKey || state.backend === "mock";
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function log(message) {
    console.log(`📱 [Social/${CHILD_ID}] ${message}`);
    TM?.log?.("info", `${PARENT}:${CHILD_ID}`, message);
  }

  const _delay = (ms) => new Promise((r) => setTimeout(r, ms));

  function _normalizePhone(phone) {
    // Remove non-digits except +
    let normalized = phone.replace(/[^\d+]/g, "");

    // Add Brazil code if needed
    if (!normalized.startsWith("+") && !normalized.startsWith("55")) {
      normalized = "55" + normalized;
    }

    return normalized.replace("+", "");
  }

  function _detectMediaType(url) {
    const ext = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["mp4", "mov", "avi", "webm"].includes(ext)) return "video";
    if (["mp3", "ogg", "wav", "aac"].includes(ext)) return "audio";
    return "document";
  }

  function _capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function _extractVariables(template) {
    const matches = template.match(/\{\{([^}]+)\}\}/g) || [];
    return matches.map((m) => m.replace(/[{}]/g, ""));
  }

  async function _chargePanda(cost) {
    if (window.Panda?.Wallet?.charge && cost > 0) {
      await window.Panda.Wallet.charge(cost, `SOCIAL_WHATSAPP`);
    }
  }

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  const register = () => {
    if (window.SocialParent) {
      window.SocialParent.registerChild(CHILD_ID, WhatsAppAPI);
      log("✓ WhatsApp child ready (Evolution API + Mock)");
    } else {
      setTimeout(register, 100);
    }
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register);
  }

  // Direct export
  window.Panda = window.Panda || {};
  window.Panda.Social = window.Panda.Social || {};
  window.Panda.Social.WhatsApp = WhatsAppAPI;
  window.WhatsAppChild = WhatsAppAPI;
})(window);
