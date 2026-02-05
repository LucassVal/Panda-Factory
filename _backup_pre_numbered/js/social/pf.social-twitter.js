/**
 * 🐼 PANDA SOCIAL - Twitter/X Hub Plugin
 * =======================================
 * @version 1.0.0
 * @marketplace TRUE
 * @price 2999
 * @requires pf.social-core.js
 */

(function (window) {
  "use strict";

  const PLUGIN_ID = "social-twitter";

  const COSTS = { THREAD: 20, HOOK: 10, REPLY: 2, SPACE: 50 };

  const TwitterHub = {
    id: PLUGIN_ID,
    name: "Twitter/X Hub",
    icon: "🐦",

    async generateThread(topic, tweets = 7) {
      await _charge(COSTS.THREAD, "TW_THREAD");
      return await _brain(`Thread Twitter ${tweets} tweets sobre: ${topic}
Estrutura:
1. Hook forte
2-${tweets - 1}. Conteúdo com valor
${tweets}. CTA + como conseguir mais
Cada tweet max 280 chars`);
    },

    async generateViralHook(topic) {
      await _charge(COSTS.HOOK, "TW_HOOK");
      return await _brain(`5 hooks virais Twitter sobre: ${topic}
Formatos: Pergunta, Estatística, Polêmica, História, Promessa
Max 100 chars cada`);
    },

    async generateReply(tweet, tone = "witty") {
      await _charge(COSTS.REPLY, "TW_REPLY");
      return await _brain(`Resposta ${tone} para: "${tweet}"
Max 200 chars, engajante`);
    },

    async summarizeSpace(transcript) {
      await _charge(COSTS.SPACE, "TW_SPACE");
      return await _brain(
        `Resuma este Twitter Space: ${transcript.substring(0, 5000)}`,
      );
    },

    /**
     * Gera tweet único otimizado
     */
    async generateTweet(topic, style = "informativo") {
      await _charge(5, "TW_SINGLE");
      return await _brain(`Tweet sobre: ${topic}
Estilo: ${style}
Max 280 chars, emojis relevantes`);
    },

    /**
     * Gera quote tweet
     */
    async generateQuote(originalTweet, angle = "agree") {
      await _charge(COSTS.REPLY, "TW_QUOTE");
      return await _brain(`Quote tweet para: "${originalTweet}"
Ângulo: ${angle} (agree/disagree/expand/humor)
Max 240 chars para deixar espaço`);
    },

    /**
     * Analisa melhor horário para postar
     */
    async getBestPostTime(niche = "tech") {
      await _charge(5, "TW_TIME");
      return await _brain(`Melhores horários para postar no Twitter/X
Nicho: ${niche}
Fuso: Brasil (BRT)
Formato: Lista com dias e horários`);
    },

    /**
     * Gera bio otimizada
     */
    async generateBio(profile) {
      await _charge(10, "TW_BIO");
      return await _brain(`Crie uma bio Twitter profissional:
${JSON.stringify(profile)}
Max 160 chars, emojis, link placeholder`);
    },

    /**
     * Estratégia de engajamento
     */
    async getEngagementStrategy(goals) {
      await _charge(15, "TW_STRATEGY");
      return await _brain(`Estratégia Twitter/X para: ${goals}
Inclua: frequência posts, tipos conteúdo, hashtags, interações`);
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
    window.Panda.Social.registerPlugin(PLUGIN_ID, TwitterHub);
  window.Panda = window.Panda || {};
  window.Panda.Twitter = TwitterHub;
})(window);
