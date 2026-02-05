/**
 * 🐼 PANDA SOCIAL - YouTube Hub Plugin
 * =====================================
 * Plugin vendável separadamente na loja Panda
 *
 * @version 1.0.0
 * @marketplace TRUE
 * @price 4999 (49.99 BRL ou PC)
 * @requires pf.social-core.js
 *
 * FEATURES:
 * - SEO Optimizer (títulos, descrições)
 * - Thumbnail Generator (IA)
 * - Caption/Subtitles
 * - Script Generator
 * - Analytics Overview
 * - Shorts Generator
 */

(function (window) {
  "use strict";

  const PLUGIN_ID = "social-youtube";

  // ============================================================================
  // TOKEN COSTS
  // ============================================================================

  const COSTS = {
    SEO_TITLE: 10,
    SEO_DESCRIPTION: 15,
    THUMBNAIL_AI: 50,
    CAPTIONS_PER_MIN: 20,
    SCRIPT_SHORT: 30,
    SCRIPT_LONG: 80,
    ANALYTICS: 5,
    SHORTS_SCRIPT: 25,
  };

  // ============================================================================
  // YOUTUBE HUB
  // ============================================================================

  const YouTubeHub = {
    id: PLUGIN_ID,
    name: "YouTube Hub",
    icon: "📺",

    // ==========================================
    // SEO TOOLS
    // ==========================================

    SEO: {
      /**
       * Gera título otimizado para YouTube
       * @param {string} topic - Assunto do vídeo
       * @param {string} style - clickbait, informativo, tutorial
       */
      async generateTitle(topic, style = "informativo") {
        await _charge(COSTS.SEO_TITLE, "YT_SEO_TITLE");

        const prompt = `Crie 5 títulos de vídeo YouTube sobre: ${topic}
Estilo: ${style}
Regras:
- Máximo 60 caracteres
- Incluir número se possível
- Palavras-chave no início
- Gerar curiosidade
Formato: Lista numerada`;

        return await _brain(prompt);
      },

      /**
       * Gera descrição otimizada
       */
      async generateDescription(topic, keywords = []) {
        await _charge(COSTS.SEO_DESCRIPTION, "YT_SEO_DESC");

        const prompt = `Crie uma descrição de vídeo YouTube sobre: ${topic}
Keywords: ${keywords.join(", ")}
Incluir:
- Resumo do vídeo (2 linhas)
- Timestamps exemplo
- CTA para inscrição
- Links placeholder
- Hashtags relevantes`;

        return await _brain(prompt);
      },

      /**
       * Sugere tags/keywords
       */
      async suggestTags(topic, count = 15) {
        await _charge(5, "YT_TAGS");

        const prompt = `Sugira ${count} tags YouTube para: ${topic}
Mix de: alta competição + nicho + long-tail
Formato: Lista separada por vírgula`;

        const response = await _brain(prompt);
        return response.split(",").map((t) => t.trim());
      },
    },

    // ==========================================
    // THUMBNAIL
    // ==========================================

    Thumbnail: {
      /**
       * Gera prompt para thumbnail
       */
      async generatePrompt(topic, style = "bold") {
        await _charge(10, "YT_THUMB_PROMPT");

        const styles = {
          bold: "cores vibrantes, texto grande, expressão facial dramática",
          minimal: "fundo limpo, pouco texto, paleta suave",
          tutorial: "screenshot com setas, passo a passo",
          vlog: "foto pessoal, filtro lifestyle, autêntico",
        };

        const prompt = `Crie um prompt para gerar thumbnail YouTube:
Tema: ${topic}
Estilo: ${styles[style] || styles.bold}
Resolução: 1280x720
Formato: Prompt detalhado para Gemini Image`;

        return await _brain(prompt);
      },

      /**
       * Gera thumbnail com IA (usa Gemini Image)
       */
      async generate(topic, style = "bold") {
        await _charge(COSTS.THUMBNAIL_AI, "YT_THUMBNAIL");

        const thumbPrompt = await this.generatePrompt(topic, style);

        // Chamar Gemini Image via Brain
        const result = await window.Panda?.Brain?.generate?.("image", {
          prompt: thumbPrompt,
          aspectRatio: "16:9",
          resolution: "1280x720",
        });

        return result;
      },
    },

    // ==========================================
    // CAPTIONS / SUBTITLES
    // ==========================================

    Captions: {
      /**
       * Transcreve áudio (usa Whisper via Rust Agent ou Cloud)
       */
      async transcribe(audioUrl, language = "pt") {
        const duration = await _getAudioDuration(audioUrl);
        const cost = Math.ceil(duration * COSTS.CAPTIONS_PER_MIN);
        await _charge(cost, "YT_TRANSCRIBE");

        // Tentar Rust Agent local primeiro
        if (window.Panda?.Bridge?.isConnected?.()) {
          return await window.Panda.Bridge.transcribe(audioUrl, language);
        }

        // Fallback para cloud
        return await window.Panda?.Brain?.transcribe?.(audioUrl, language);
      },

      /**
       * Formata legendas para SRT
       */
      formatToSRT(transcription) {
        // transcription = [{ start, end, text }, ...]
        return transcription
          .map(
            (seg, i) =>
              `${i + 1}\n${_formatTime(seg.start)} --> ${_formatTime(seg.end)}\n${seg.text}\n`,
          )
          .join("\n");
      },
    },

    // ==========================================
    // SCRIPT GENERATOR
    // ==========================================

    Script: {
      /**
       * Gera script completo para vídeo
       */
      async generate(topic, duration = "short", style = "educativo") {
        const cost =
          duration === "short" ? COSTS.SCRIPT_SHORT : COSTS.SCRIPT_LONG;
        await _charge(cost, "YT_SCRIPT");

        const durations = {
          short: "5-8 minutos",
          medium: "10-15 minutos",
          long: "20-30 minutos",
        };

        const prompt = `Crie um script de vídeo YouTube:
Tema: ${topic}
Duração: ${durations[duration] || durations.short}
Estilo: ${style}

Estrutura:
1. Hook (primeiros 30 segundos)
2. Intro
3. Conteúdo principal (dividido em seções)
4. CTA
5. Encerramento

Formato: Script profissional com indicações de corte e B-roll`;

        return await _brain(prompt);
      },

      /**
       * Gera script para Shorts
       */
      async generateShort(topic, hook = null) {
        await _charge(COSTS.SHORTS_SCRIPT, "YT_SHORT");

        const prompt = `Crie um script para YouTube Shorts (60 segundos):
Tema: ${topic}
${hook ? `Hook inicial: ${hook}` : ""}

Regras:
- Vertical (9:16)
- Hook nos primeiros 3 segundos
- Conteúdo denso e rápido
- CTA rápido no final`;

        return await _brain(prompt);
      },
    },

    // ==========================================
    // ANALYTICS (Overview)
    // ==========================================

    Analytics: {
      /**
       * Analisa performance de canal (precisa API key do usuário)
       */
      async analyzeChannel(channelId) {
        await _charge(COSTS.ANALYTICS, "YT_ANALYTICS");

        // Placeholder - precisa integração com YouTube Data API
        return {
          status: "SETUP_REQUIRED",
          message:
            "Configure sua YouTube API Key em Configurações > Integrações",
          docsUrl: "https://developers.google.com/youtube/v3",
        };
      },

      /**
       * Sugere melhorias baseado em métricas
       */
      async suggestImprovements(metrics) {
        await _charge(COSTS.ANALYTICS, "YT_SUGGEST");

        const prompt = `Analise estas métricas YouTube e sugira melhorias:
${JSON.stringify(metrics, null, 2)}

Foque em:
- CTR (click-through rate)
- Retenção média
- Engagement (likes, comments)
- Crescimento de inscritos`;

        return await _brain(prompt);
      },
    },
  };

  // ============================================================================
  // HELPERS
  // ============================================================================

  async function _charge(amount, reason) {
    const result = await window.Panda?.Wallet?.charge(amount, reason);
    if (!result?.success) {
      throw new Error(`Saldo insuficiente. Necessário: ${amount} PC`);
    }
    return result;
  }

  async function _brain(prompt) {
    const response = await window.Panda?.Brain?.chat(prompt, { gem: "writer" });
    return response?.text || response?.response || response;
  }

  async function _getAudioDuration(url) {
    // Placeholder - retorna estimativa
    return 5; // 5 minutos default
  }

  function _formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
  }

  // ============================================================================
  // REGISTER PLUGIN
  // ============================================================================

  if (window.Panda?.Social) {
    window.Panda.Social.registerPlugin(PLUGIN_ID, YouTubeHub);
    console.log("[Social] 📺 YouTube Hub plugin loaded");
  } else {
    console.warn("[Social] Core not loaded. YouTube Hub waiting...");
    window.addEventListener("social:ready", () => {
      window.Panda.Social.registerPlugin(PLUGIN_ID, YouTubeHub);
    });
  }

  // Expose directly too
  window.Panda = window.Panda || {};
  window.Panda.YouTube = YouTubeHub;
})(window);
