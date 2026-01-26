/**
 * 🐼 PANDA SOCIAL - WhatsApp Grey Plugin
 * =======================================
 * @version 1.0.0
 * @marketplace TRUE
 * @price 5999
 * @requires pf.social-core.js
 *
 * NOTA: "Grey" = Área cinza, automações permitidas via Business API
 */

(function (window) {
  "use strict";

  const PLUGIN_ID = "social-whatsapp";

  const COSTS = {
    BROADCAST: 5,
    AUTO_REPLY: 3,
    LEAD_CAPTURE: 10,
    TEMPLATE: 15,
    FLOW: 30,
  };

  const WhatsAppHub = {
    id: PLUGIN_ID,
    name: "WhatsApp Grey",
    icon: "💬",

    /**
     * Gera mensagem de broadcast
     */
    async generateBroadcast(topic, audience) {
      await _charge(COSTS.BROADCAST, "WA_BROADCAST");
      return await _brain(`Mensagem broadcast WhatsApp:
Tema: ${topic}
Público: ${audience}
Máximo 1000 caracteres, com emojis`);
    },

    /**
     * Gera respostas automáticas
     */
    async generateAutoReplies(triggers) {
      await _charge(COSTS.AUTO_REPLY, "WA_AUTO");
      return await _brain(`Crie respostas automáticas para:
${triggers.join("\n")}
Formato JSON: { trigger: "...", response: "..." }`);
    },

    /**
     * Gera template de lead capture
     */
    async generateLeadTemplate(product) {
      await _charge(COSTS.LEAD_CAPTURE, "WA_LEAD");
      return await _brain(`Fluxo de captura de lead WhatsApp para: ${product}
Incluir: Saudação, Qualificação, CTA`);
    },

    /**
     * Gera mensagens de template (aprovável pela Meta)
     */
    async generateTemplate(type, content) {
      await _charge(COSTS.TEMPLATE, "WA_TEMPLATE");
      return await _brain(`Template WhatsApp Business (tipo ${type}):
Conteúdo: ${content}
Regras da Meta: sem promoções diretas, linguagem neutra`);
    },

    /**
     * Cria fluxo de conversa
     */
    async generateFlow(objective, steps = 5) {
      await _charge(COSTS.FLOW, "WA_FLOW");
      return await _brain(`Fluxo WhatsApp ${steps} passos:
Objetivo: ${objective}
Formato: Árvore de decisão`);
    },

    // ==========================================
    // CRM INTEGRATION
    // ==========================================

    /**
     * Salva lead capturado no CRM
     */
    async saveLead(phone, name, source = "whatsapp") {
      return await window.Panda?.Social?.CRM?.addLead({
        phone,
        name,
        source,
        platform: "whatsapp",
        capturedAt: new Date().toISOString(),
      });
    },
  };

  async function _charge(a, r) {
    const res = await window.Panda?.Wallet?.charge(a, r);
    if (!res?.success) throw new Error(`Saldo insuficiente: ${a} PC`);
  }
  async function _brain(p) {
    return (await window.Panda?.Brain?.chat(p))?.text;
  }

  if (window.Panda?.Social)
    window.Panda.Social.registerPlugin(PLUGIN_ID, WhatsAppHub);
  window.Panda = window.Panda || {};
  window.Panda.WhatsApp = WhatsAppHub;
})(window);
