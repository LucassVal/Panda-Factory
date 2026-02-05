/**
 * 🐼 PANDA SOCIAL - Meta Hub Plugin (FB + IG)
 * ============================================
 * @version 1.0.0
 * @marketplace TRUE
 * @price 4999
 * @requires pf.social-core.js
 */

(function (window) {
  "use strict";

  const PLUGIN_ID = "social-meta";

  const COSTS = {
    POST: 10,
    STORY: 15,
    REEL: 25,
    CAROUSEL: 30,
    AD_COPY: 40,
    COMMENT: 3,
  };

  const MetaHub = {
    id: PLUGIN_ID,
    name: "Meta Hub",
    icon: "📱",

    // Facebook + Instagram Posts
    async generatePost(topic, platform = "instagram") {
      await _charge(COSTS.POST, "META_POST");
      return await _brain(`Crie um post ${platform} sobre: ${topic}`);
    },

    async generateStory(topic, slides = 3) {
      await _charge(COSTS.STORY, "META_STORY");
      return await _brain(`Crie ${slides} stories Instagram sobre: ${topic}`);
    },

    async generateReelScript(topic) {
      await _charge(COSTS.REEL, "META_REEL");
      return await _brain(`Script de Reel 30s sobre: ${topic}`);
    },

    async generateCarousel(topic, slides = 5) {
      await _charge(COSTS.CAROUSEL, "META_CAROUSEL");
      return await _brain(`Carrossel ${slides} slides sobre: ${topic}`);
    },

    async generateAdCopy(product, audience) {
      await _charge(COSTS.AD_COPY, "META_AD");
      return await _brain(`Copy de anúncio Meta:
Produto: ${product}
Público: ${audience}`);
    },

    async replyToComment(comment, tone = "friendly") {
      await _charge(COSTS.COMMENT, "META_REPLY");
      return await _brain(
        `Responda este comentário (tom ${tone}): "${comment}"`,
      );
    },

    /**
     * Gera bio otimizada para Instagram
     */
    async generateBio(profile) {
      await _charge(10, "META_BIO");
      return await _brain(`Crie bio Instagram profissional:
${JSON.stringify(profile)}
Max 150 chars, emojis, CTA, link placeholder`);
    },

    /**
     * Gera hashtags otimizadas
     */
    async getHashtags(topic, count = 15) {
      await _charge(5, "META_HASH");
      const result = await _brain(`${count} hashtags Instagram para: ${topic}
Mix: alta competição + nicho + específicas
Formato: lista separada por espaço`);
      return result;
    },

    /**
     * Analisa melhor horário para postar
     */
    async getBestPostTime(niche = "geral") {
      await _charge(5, "META_TIME");
      return await _brain(`Melhores horários para postar Instagram
Nicho: ${niche}
Fuso: Brasil (BRT)
Formato: Lista com dias e horários`);
    },

    /**
     * Estratégia de conteúdo semanal
     */
    async getWeeklyStrategy(goals) {
      await _charge(20, "META_STRATEGY");
      return await _brain(`Estratégia semanal Instagram para: ${goals}
7 dias, tipos de post (feed, story, reel), horários`);
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
    window.Panda.Social.registerPlugin(PLUGIN_ID, MetaHub);
  window.Panda = window.Panda || {};
  window.Panda.Meta = MetaHub;
})(window);
