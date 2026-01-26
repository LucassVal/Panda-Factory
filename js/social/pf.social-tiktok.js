/**
 * 🐼 PANDA SOCIAL - TikTok Hub Plugin
 * ====================================
 * @version 1.0.0
 * @marketplace TRUE
 * @price 3999
 * @requires pf.social-core.js
 */

(function (window) {
  "use strict";

  const PLUGIN_ID = "social-tiktok";

  const COSTS = {
    TRENDS: 15,
    CAPTION: 5,
    HASHTAGS: 5,
    SOUND_FIND: 10,
    SCRIPT: 20,
    HOOK: 8,
  };

  const TikTokHub = {
    id: PLUGIN_ID,
    name: "TikTok Hub",
    icon: "🎵",

    /**
     * Analisa trends atuais
     */
    async analyzeTrends(niche = "geral") {
      await _charge(COSTS.TRENDS, "TT_TRENDS");

      const prompt = `Analise as trends atuais do TikTok para o nicho: ${niche}
Inclua:
- Top 5 formatos em alta
- Sons/áudios populares
- Hashtags trending
- Ideias de conteúdo`;

      return await _brain(prompt);
    },

    /**
     * Gera caption viral
     */
    async generateCaption(topic, style = "viral") {
      await _charge(COSTS.CAPTION, "TT_CAPTION");

      const prompt = `Crie uma caption TikTok sobre: ${topic}
Estilo: ${style}
Regras:
- Máximo 150 caracteres
- Hook forte
- Emojis relevantes
- CTA sutil`;

      return await _brain(prompt);
    },

    /**
     * Sugere hashtags otimizadas
     */
    async getHashtags(topic, count = 8) {
      await _charge(COSTS.HASHTAGS, "TT_HASH");

      const prompt = `Sugira ${count} hashtags TikTok para: ${topic}
Mix: #FYP + nicho + trending
Formato: Lista de hashtags`;

      return await _brain(prompt);
    },

    /**
     * Encontra sons/áudios relevantes
     */
    async findSounds(mood, trending = true) {
      await _charge(COSTS.SOUND_FIND, "TT_SOUND");

      const prompt = `Sugira sons/áudios TikTok para mood: ${mood}
${trending ? "Apenas sons trending" : "Mix de trending e clássicos"}
Formato: Lista com nome do som e descrição`;

      return await _brain(prompt);
    },

    /**
     * Gera script para TikTok
     */
    async generateScript(topic, duration = 30) {
      await _charge(COSTS.SCRIPT, "TT_SCRIPT");

      const prompt = `Crie um script TikTok:
Tema: ${topic}
Duração: ${duration} segundos
Formato vertical 9:16

Estrutura:
- Hook (3s)
- Conteúdo rápido
- CTA/twist final`;

      return await _brain(prompt);
    },

    /**
     * Gera hooks virais
     */
    async generateHooks(topic, count = 5) {
      await _charge(COSTS.HOOK, "TT_HOOKS");

      const prompt = `Crie ${count} hooks virais para TikTok sobre: ${topic}
Tipos: Pergunta, Polêmica, Curiosidade, Urgência, Dor
Máximo 10 palavras cada`;

      return await _brain(prompt);
    },
  };

  async function _charge(amount, reason) {
    const result = await window.Panda?.Wallet?.charge(amount, reason);
    if (!result?.success) throw new Error(`Saldo insuficiente: ${amount} PC`);
    return result;
  }

  async function _brain(prompt) {
    const response = await window.Panda?.Brain?.chat(prompt, { gem: "writer" });
    return response?.text || response;
  }

  // Register plugin
  if (window.Panda?.Social) {
    window.Panda.Social.registerPlugin(PLUGIN_ID, TikTokHub);
  }
  window.Panda = window.Panda || {};
  window.Panda.TikTok = TikTokHub;
})(window);
