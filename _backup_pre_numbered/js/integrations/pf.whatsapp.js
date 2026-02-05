/**
 * 🐼 PANDA SDK - WhatsApp Integration Module
 * ==========================================
 * @version 1.0.0
 * @branch feat/sdk-whatsapp
 * @author Panda Fabrics
 *
 * Killer Feature: WhatsApp automation with Grey API support
 * Consumo PC: 2-20 PC por ação
 *
 * GREY MODE: Usa Baileys/whatsapp-web.js até API oficial
 */

(function (window) {
  "use strict";

  // ==========================================
  // ⚙️ CONFIGURAÇÃO
  // ==========================================
  const CONFIG = {
    // Custos em Panda Coins
    COSTS: {
      MESSAGE_SINGLE: 1, // Mensagem individual
      MESSAGE_BULK: 2, // Mensagem em massa (por msg)
      CHATBOT_CONVERSATION: 10, // Por conversa com bot
      CAMPAIGN_CREATE: 20, // Criar campanha
      TEMPLATE_GENERATE: 15, // Gerar template com IA
      FLOW_CREATE: 30, // Criar fluxo de conversa
      MEDIA_SEND: 3, // Enviar imagem/vídeo/doc
    },

    // Limites para evitar ban
    RATE_LIMITS: {
      MESSAGES_PER_MINUTE: 10,
      MESSAGES_PER_HOUR: 200,
      MESSAGES_PER_DAY: 1000,
      DELAY_BETWEEN_MS: 3000, // 3s entre mensagens
    },

    // Status de conexão
    CONNECTION_STATUS: {
      DISCONNECTED: 0,
      CONNECTING: 1,
      CONNECTED: 2,
      QR_REQUIRED: 3,
    },
  };

  // Estado interno
  let _state = {
    connected: false,
    numbers: new Map(), // Números conectados
    conversations: new Map(), // Conversas ativas
    campaigns: [],
    messageQueue: [],
    rateLimitCounter: { minute: 0, hour: 0, day: 0 },
  };

  // ==========================================
  // 💰 SISTEMA DE COBRANÇA INTERNO
  // ==========================================
  const _charge = async (amount, reason) => {
    if (window.Panda?.Config?.useMock) {
      console.log(`[WA] Mock charge: ${amount} PC for ${reason}`);
      return { success: true };
    }

    // Em produção: usa internal charge
    const result = await window.Panda?._internal?.charge?.(amount, reason);
    if (!result?.success) {
      throw new Error(`Saldo insuficiente: precisa ${amount} PC`);
    }
    return result;
  };

  // ==========================================
  // 📱 GERENCIAMENTO DE NÚMEROS
  // ==========================================
  const NumberManager = {
    /**
     * Adiciona um número ao gerenciador
     * @param {string} phoneNumber - Número com DDD (ex: 5511999999999)
     * @param {string} label - Label identificador
     * @returns {Promise<{success, qrCode?}>}
     */
    add: async (phoneNumber, label = "Principal") => {
      console.log(`[WA] Adding number: ${phoneNumber} (${label})`);

      // Mock: retorna QR code para simulação
      await _fakeDelay(500);

      const numberData = {
        phone: phoneNumber,
        label,
        status: CONFIG.CONNECTION_STATUS.QR_REQUIRED,
        addedAt: Date.now(),
        messagessSent: 0,
      };

      _state.numbers.set(phoneNumber, numberData);

      window.Panda?.emit?.("whatsapp:number:added", numberData);

      return {
        success: true,
        qrCode: "data:image/png;base64,MOCK_QR_CODE_BASE64",
        message: "Escaneie o QR Code no WhatsApp",
      };
    },

    /**
     * Remove um número
     */
    remove: async (phoneNumber) => {
      if (_state.numbers.has(phoneNumber)) {
        _state.numbers.delete(phoneNumber);
        window.Panda?.emit?.("whatsapp:number:removed", { phone: phoneNumber });
        return { success: true };
      }
      return { success: false, reason: "Número não encontrado" };
    },

    /**
     * Lista todos os números conectados
     */
    list: () => {
      return Array.from(_state.numbers.values());
    },

    /**
     * Verifica status de um número
     */
    getStatus: (phoneNumber) => {
      return _state.numbers.get(phoneNumber) || null;
    },
  };

  // ==========================================
  // 💬 ENVIO DE MENSAGENS
  // ==========================================
  const Messaging = {
    /**
     * Envia mensagem individual
     * @param {string} to - Número destino
     * @param {string} message - Texto da mensagem
     * @param {object} options - { from?, mediaUrl?, buttons? }
     */
    send: async (to, message, options = {}) => {
      await _charge(CONFIG.COSTS.MESSAGE_SINGLE, "WA_MSG_SINGLE");
      await _checkRateLimit();

      console.log(`[WA] Sending to ${to}: ${message.substring(0, 50)}...`);
      await _fakeDelay(CONFIG.RATE_LIMITS.DELAY_BETWEEN_MS);

      const result = {
        success: true,
        messageId: `msg_${Date.now()}`,
        to,
        sentAt: new Date().toISOString(),
        status: "sent",
      };

      window.Panda?.emit?.("whatsapp:message:sent", result);
      _incrementRateLimit();

      return result;
    },

    /**
     * Envio em massa (Bulk)
     * @param {string[]} recipients - Lista de números
     * @param {string} message - Mensagem (suporta {{nome}} para personalização)
     * @param {object} options - { delay?, mediaUrl? }
     */
    sendBulk: async (recipients, message, options = {}) => {
      const delay = options.delay || CONFIG.RATE_LIMITS.DELAY_BETWEEN_MS;
      const total = recipients.length;
      const cost = total * CONFIG.COSTS.MESSAGE_BULK;

      // Cobrança upfront
      await _charge(cost, `WA_BULK_${total}`);

      console.log(`[WA] Bulk send to ${total} recipients...`);

      const results = {
        total,
        sent: 0,
        failed: 0,
        details: [],
      };

      for (let i = 0; i < recipients.length; i++) {
        const to = recipients[i];
        await _checkRateLimit();

        try {
          // Personalização básica
          const personalizedMsg = message.replace(
            /\{\{nome\}\}/g,
            options.names?.[i] || "Cliente",
          );

          await _fakeDelay(delay);

          results.details.push({
            to,
            status: "sent",
            messageId: `msg_${Date.now()}_${i}`,
          });
          results.sent++;

          window.Panda?.emit?.("whatsapp:bulk:progress", {
            current: i + 1,
            total,
            percent: Math.round(((i + 1) / total) * 100),
          });
        } catch (err) {
          results.details.push({ to, status: "failed", error: err.message });
          results.failed++;
        }

        _incrementRateLimit();
      }

      window.Panda?.emit?.("whatsapp:bulk:complete", results);
      return results;
    },

    /**
     * Envia mídia (imagem, vídeo, documento)
     */
    sendMedia: async (to, mediaUrl, caption = "", type = "image") => {
      await _charge(CONFIG.COSTS.MEDIA_SEND, "WA_MEDIA");
      await _checkRateLimit();

      console.log(`[WA] Sending ${type} to ${to}`);
      await _fakeDelay(2000);

      const result = {
        success: true,
        messageId: `media_${Date.now()}`,
        to,
        type,
        sentAt: new Date().toISOString(),
      };

      window.Panda?.emit?.("whatsapp:media:sent", result);
      _incrementRateLimit();

      return result;
    },
  };

  // ==========================================
  // 🤖 CHATBOT IA
  // ==========================================
  const Chatbot = {
    /**
     * Processa mensagem recebida com IA
     * @param {string} from - Número remetente
     * @param {string} message - Mensagem recebida
     * @param {object} context - Contexto da conversa
     */
    processMessage: async (from, message, context = {}) => {
      await _charge(CONFIG.COSTS.CHATBOT_CONVERSATION, "WA_CHATBOT");

      console.log(`[WA] Chatbot processing: ${message}`);

      // Usa Panda.Brain para gerar resposta
      const prompt = `Você é um assistente de WhatsApp.
Contexto do cliente: ${JSON.stringify(context)}
Mensagem recebida: ${message}

Responda de forma amigável e objetiva (máx 500 chars).`;

      const aiResponse = await window.Panda?.Brain?.chat?.(prompt);

      const response = {
        from,
        originalMessage: message,
        reply: aiResponse?.response || "Olá! Como posso ajudar?",
        generatedAt: new Date().toISOString(),
      };

      // Atualiza conversa
      if (!_state.conversations.has(from)) {
        _state.conversations.set(from, []);
      }
      _state.conversations.get(from).push({
        role: "user",
        content: message,
        timestamp: Date.now(),
      });
      _state.conversations.get(from).push({
        role: "assistant",
        content: response.reply,
        timestamp: Date.now(),
      });

      window.Panda?.emit?.("whatsapp:chatbot:reply", response);
      return response;
    },

    /**
     * Configura auto-respostas baseadas em palavras-chave
     */
    setAutoReplies: (rules) => {
      _state.autoReplies = rules;
      console.log(`[WA] Auto-replies configured: ${rules.length} rules`);
      return { success: true, rulesCount: rules.length };
    },

    /**
     * Obtém histórico de conversa
     */
    getConversation: (phoneNumber) => {
      return _state.conversations.get(phoneNumber) || [];
    },
  };

  // ==========================================
  // 📊 CAMPANHAS
  // ==========================================
  const Campaigns = {
    /**
     * Cria uma campanha
     * @param {object} config - { name, message, recipients, scheduledAt? }
     */
    create: async (config) => {
      await _charge(CONFIG.COSTS.CAMPAIGN_CREATE, "WA_CAMPAIGN");

      const campaign = {
        id: `camp_${Date.now()}`,
        name: config.name,
        message: config.message,
        recipients: config.recipients || [],
        status: "draft",
        createdAt: new Date().toISOString(),
        scheduledAt: config.scheduledAt || null,
        stats: { sent: 0, delivered: 0, read: 0, failed: 0 },
      };

      _state.campaigns.push(campaign);
      window.Panda?.emit?.("whatsapp:campaign:created", campaign);

      return campaign;
    },

    /**
     * Executa campanha
     */
    execute: async (campaignId) => {
      const campaign = _state.campaigns.find((c) => c.id === campaignId);
      if (!campaign) throw new Error("Campanha não encontrada");

      campaign.status = "running";
      window.Panda?.emit?.("whatsapp:campaign:started", campaign);

      const results = await Messaging.sendBulk(
        campaign.recipients,
        campaign.message,
      );

      campaign.status = "completed";
      campaign.stats = {
        sent: results.sent,
        failed: results.failed,
        completedAt: new Date().toISOString(),
      };

      window.Panda?.emit?.("whatsapp:campaign:completed", campaign);
      return campaign;
    },

    /**
     * Lista campanhas
     */
    list: () => _state.campaigns,

    /**
     * Obtém estatísticas de campanha
     */
    getStats: (campaignId) => {
      const campaign = _state.campaigns.find((c) => c.id === campaignId);
      return campaign?.stats || null;
    },
  };

  // ==========================================
  // 🔧 TEMPLATES IA
  // ==========================================
  const Templates = {
    /**
     * Gera template com IA
     * @param {string} type - 'welcome' | 'promo' | 'follow_up' | 'support'
     * @param {object} context - Contexto para geração
     */
    generate: async (type, context = {}) => {
      await _charge(CONFIG.COSTS.TEMPLATE_GENERATE, "WA_TEMPLATE");

      const prompts = {
        welcome: `Mensagem de boas-vindas WhatsApp para: ${context.business || "empresa"}`,
        promo: `Mensagem promocional WhatsApp para: ${context.product || "produto"}. Desconto: ${context.discount || "10%"}`,
        follow_up: `Follow-up WhatsApp após: ${context.event || "compra"}`,
        support: `Mensagem suporte WhatsApp. Problema: ${context.issue || "gerais"}`,
      };

      const prompt = `${prompts[type] || prompts.welcome}
Regras:
- Máximo 1000 caracteres
- Inclua emojis relevantes
- Tom amigável e profissional
- Inclua CTA quando apropriado`;

      const response = await window.Panda?.Brain?.chat?.(prompt);

      return {
        type,
        template: response?.response || "Olá! Obrigado pelo contato.",
        generatedAt: new Date().toISOString(),
      };
    },

    /**
     * Biblioteca de templates prontos
     */
    library: {
      welcome: "Olá! 👋 Bem-vindo(a) à {{empresa}}! Como posso ajudar?",
      confirm_order:
        "✅ Pedido confirmado!\n\nNº: {{pedido}}\nProduto: {{produto}}\nValor: R$ {{valor}}\n\nDúvidas? Responda esta mensagem!",
      shipping:
        "📦 Boa notícia!\n\nSeu pedido {{pedido}} foi enviado!\nRastreio: {{codigo}}\n\nAcompanhe em: {{link}}",
      abandoned_cart:
        "Oi {{nome}}! 👋\n\nVi que você deixou alguns itens no carrinho...\n\n🛒 {{itens}}\n\nQuer finalizar a compra? Tenho um cupom especial! 🎁",
    },
  };

  // ==========================================
  // 🔄 CRM SYNC
  // ==========================================
  const CRM = {
    /**
     * Sincroniza contato com CRM interno
     */
    syncContact: async (phone, data = {}) => {
      const contact = {
        phone,
        name: data.name || "Novo Contato",
        source: "whatsapp",
        lastInteraction: new Date().toISOString(),
        tags: data.tags || [],
        ...data,
      };

      // Salva no Panda.Data
      await window.Panda?.Data?.save?.("wa_contacts", contact);
      window.Panda?.emit?.("whatsapp:contact:synced", contact);

      return contact;
    },

    /**
     * Obtém contatos do WhatsApp
     */
    getContacts: async (filter = {}) => {
      return await window.Panda?.Data?.list?.("wa_contacts", filter);
    },

    /**
     * Segmenta contatos por tags
     */
    segment: async (tags) => {
      const all = await CRM.getContacts();
      return all.filter((c) => tags.some((tag) => c.tags?.includes(tag)));
    },
  };

  // ==========================================
  // ⚙️ HELPERS INTERNOS
  // ==========================================
  const _fakeDelay = (ms) =>
    new Promise((r) => setTimeout(r, ms || Math.random() * 500 + 200));

  const _checkRateLimit = async () => {
    if (
      _state.rateLimitCounter.minute >= CONFIG.RATE_LIMITS.MESSAGES_PER_MINUTE
    ) {
      console.warn("[WA] Rate limit reached. Waiting...");
      await _fakeDelay(60000); // Espera 1 minuto
      _state.rateLimitCounter.minute = 0;
    }
  };

  const _incrementRateLimit = () => {
    _state.rateLimitCounter.minute++;
    _state.rateLimitCounter.hour++;
    _state.rateLimitCounter.day++;
  };

  // ==========================================
  // 📦 OBJETO PÚBLICO
  // ==========================================
  const WhatsApp = {
    // Sub-módulos
    Numbers: NumberManager,
    Messages: Messaging,
    Chatbot,
    Campaigns,
    Templates,
    CRM,

    // Atalhos comuns
    send: Messaging.send,
    sendBulk: Messaging.sendBulk,

    // Configuração
    COSTS: CONFIG.COSTS,
    RATE_LIMITS: CONFIG.RATE_LIMITS,

    // Status
    getState: () => ({
      ..._state,
      numbers: Array.from(_state.numbers.values()),
    }),
    isConnected: () => _state.connected,

    // Versão
    version: "1.0.0",
    mode: "grey", // 'grey' | 'official'
  };

  // Freeze para segurança
  Object.freeze(WhatsApp.COSTS);
  Object.freeze(WhatsApp.RATE_LIMITS);

  // Exporta para window.Panda
  if (!window.Panda) window.Panda = {};
  window.Panda.WhatsApp = WhatsApp;

  console.log(
    "%c💬 Panda.WhatsApp v1.0.0 loaded (Grey Mode)",
    "background: #25D366; color: white; padding: 4px 8px; border-radius: 4px;",
  );
})(window);
