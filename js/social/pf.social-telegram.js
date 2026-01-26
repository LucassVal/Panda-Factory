/**
 * 🐼 PANDA SOCIAL - Telegram Plugin
 * ==================================
 * @version 1.0.0
 * @marketplace TRUE
 * @price 3999
 * @requires pf.social-core.js
 *
 * Integração com Telegram Bot API
 */

(function (window) {
  "use strict";

  const PLUGIN_ID = "social-telegram";

  const COSTS = {
    BROADCAST: 5,
    BOT_SETUP: 20,
    CHANNEL_POST: 3,
    INLINE_MENU: 10,
    WEBHOOK_SETUP: 15,
  };

  const TelegramHub = {
    id: PLUGIN_ID,
    name: "Telegram Bot",
    icon: "📨",

    // ==========================================
    // BOT MANAGEMENT
    // ==========================================

    /**
     * Configura novo bot
     * @param {string} token - Token do BotFather
     * @returns {Promise<object>} Bot info
     */
    async setupBot(token) {
      await _charge(COSTS.BOT_SETUP, "TG_BOT_SETUP");

      // Valida token via Telegram API
      const botInfo = await this._callTelegram(token, "getMe");

      if (botInfo.ok) {
        // Salva token encriptado
        await window.Panda?.Data?.save("telegram_bots", {
          id: botInfo.result.id,
          username: botInfo.result.username,
          token: await this._encryptToken(token),
          createdAt: Date.now(),
        });

        return {
          success: true,
          bot: botInfo.result,
        };
      }

      throw new Error("Token inválido");
    },

    /**
     * Envia mensagem para chat
     * @param {string} chatId - ID do chat/grupo/canal
     * @param {string} text - Mensagem
     * @param {object} options - Opções (parse_mode, reply_markup, etc)
     */
    async sendMessage(chatId, text, options = {}) {
      await _charge(COSTS.CHANNEL_POST, "TG_SEND");

      const token = await this._getActiveToken();
      return await this._callTelegram(token, "sendMessage", {
        chat_id: chatId,
        text,
        parse_mode: options.parseMode || "HTML",
        reply_markup: options.replyMarkup,
      });
    },

    /**
     * Envia broadcast para múltiplos usuários
     * @param {string[]} chatIds - Lista de IDs
     * @param {string} message - Mensagem
     */
    async broadcast(chatIds, message) {
      await _charge(COSTS.BROADCAST * chatIds.length, "TG_BROADCAST");

      const results = [];
      const token = await this._getActiveToken();

      for (const chatId of chatIds) {
        try {
          const result = await this._callTelegram(token, "sendMessage", {
            chat_id: chatId,
            text: message,
            parse_mode: "HTML",
          });
          results.push({
            chatId,
            success: true,
            messageId: result.result?.message_id,
          });
        } catch (e) {
          results.push({ chatId, success: false, error: e.message });
        }

        // Rate limit: 30 msgs/sec
        await this._delay(35);
      }

      return results;
    },

    /**
     * Cria menu inline com botões
     * @param {string} chatId
     * @param {string} text
     * @param {Array<Array<{text: string, callback_data: string}>>} buttons
     */
    async sendInlineMenu(chatId, text, buttons) {
      await _charge(COSTS.INLINE_MENU, "TG_MENU");

      const token = await this._getActiveToken();
      return await this._callTelegram(token, "sendMessage", {
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: buttons,
        },
      });
    },

    /**
     * Configura webhook para receber updates
     * @param {string} webhookUrl - URL do webhook (HTTPS)
     */
    async setWebhook(webhookUrl) {
      await _charge(COSTS.WEBHOOK_SETUP, "TG_WEBHOOK");

      const token = await this._getActiveToken();
      return await this._callTelegram(token, "setWebhook", {
        url: webhookUrl,
        allowed_updates: ["message", "callback_query", "inline_query"],
      });
    },

    /**
     * Obtém info do webhook atual
     */
    async getWebhookInfo() {
      const token = await this._getActiveToken();
      return await this._callTelegram(token, "getWebhookInfo");
    },

    // ==========================================
    // CHANNEL MANAGEMENT
    // ==========================================

    /**
     * Posta em canal
     * @param {string} channelId - @username ou ID numérico
     * @param {string} content - Conteúdo
     * @param {object} options - Opções
     */
    async postToChannel(channelId, content, options = {}) {
      await _charge(COSTS.CHANNEL_POST, "TG_CHANNEL");

      const token = await this._getActiveToken();

      if (options.photo) {
        return await this._callTelegram(token, "sendPhoto", {
          chat_id: channelId,
          photo: options.photo,
          caption: content,
          parse_mode: "HTML",
        });
      }

      return await this._callTelegram(token, "sendMessage", {
        chat_id: channelId,
        text: content,
        parse_mode: "HTML",
      });
    },

    // ==========================================
    // AI CONTENT GENERATION
    // ==========================================

    /**
     * Gera post para canal
     * @param {string} topic - Tema
     * @param {string} style - Estilo (informativo, promocional, etc)
     */
    async generatePost(topic, style = "informativo") {
      await _charge(COSTS.CHANNEL_POST, "TG_GEN_POST");

      return await _brain(`Crie post Telegram estilo ${style}:
Tema: ${topic}
Formato: HTML (use <b>, <i>, <code>)
Máximo 4096 caracteres
Inclua emojis relevantes`);
    },

    /**
     * Gera sequência de posts
     * @param {string} topic
     * @param {number} count
     */
    async generatePostSequence(topic, count = 5) {
      await _charge(COSTS.CHANNEL_POST * count, "TG_GEN_SEQ");

      return await _brain(`Crie ${count} posts Telegram sobre:
Tema: ${topic}
Cada post: max 1000 chars, HTML
Retorne JSON array`);
    },

    // ==========================================
    // HELPERS
    // ==========================================

    async _callTelegram(token, method, params = {}) {
      const url = `https://api.telegram.org/bot${token}/${method}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      return await response.json();
    },

    async _getActiveToken() {
      const bots = await window.Panda?.Data?.list("telegram_bots");
      if (!bots?.length) throw new Error("Nenhum bot configurado");
      return await this._decryptToken(bots[0].token);
    },

    async _encryptToken(token) {
      // Placeholder: em produção usar crypto real
      return btoa(token);
    },

    async _decryptToken(encrypted) {
      return atob(encrypted);
    },

    _delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  };

  // ==========================================
  // HELPERS
  // ==========================================

  async function _charge(a, r) {
    const res = await window.Panda?.Wallet?.charge(a, r);
    if (!res?.success) throw new Error(`Saldo insuficiente: ${a} PC`);
  }

  async function _brain(p) {
    return (await window.Panda?.Brain?.chat(p))?.text;
  }

  // ==========================================
  // REGISTER
  // ==========================================

  if (window.Panda?.Social) {
    window.Panda.Social.registerPlugin(PLUGIN_ID, TelegramHub);
  }

  window.Panda = window.Panda || {};
  window.Panda.Telegram = TelegramHub;
})(window);
