/**
 * 🐼 Brain Child - Gemini Integration
 * ====================================
 * Child do Brain Tentacle para Google Gemini API
 *
 * 6 GEMs disponíveis:
 * - writer: Redação, copywriting
 * - analyst: Análise de dados, pesquisa
 * - coder: Código, debug, review
 * - designer: Design, prompts visuais
 * - planner: Planejamento, estratégia
 * - researcher: Pesquisa aprofundada
 */

(function (window) {
  "use strict";

  const PARENT = "brain";
  const CHILD_ID = "Gemini";
  const TM = window.TentacleMonitor;

  // ==========================================
  // 🔧 CONFIGURATION
  // ==========================================
  const CONFIG = {
    apiBase: "https://generativelanguage.googleapis.com/v1beta",
    defaultModel: "gemini-2.0-flash",
    models: {
      flash: "gemini-2.0-flash",
      pro: "gemini-2.0-pro",
      thinking: "gemini-2.0-flash-thinking",
    },
    maxTokens: 8192,
    temperature: 0.7,
  };

  // ==========================================
  // 💎 6 GEMS (Specialized Personas)
  // ==========================================
  const GEMS = {
    writer: {
      name: "Writer",
      icon: "✍️",
      systemPrompt: `Você é um copywriter profissional. Seu trabalho é criar textos persuasivos, 
criativos e otimizados. Sempre forneça opções e variações. Use técnicas de copywriting como 
AIDA, PAS, storytelling. Adapte o tom conforme o público.`,
      temperature: 0.8,
    },
    analyst: {
      name: "Analyst",
      icon: "📊",
      systemPrompt: `Você é um analista de dados sênior. Seu trabalho é analisar informações,
identificar padrões, extrair insights e criar relatórios claros. Seja objetivo e baseado em dados.
Use tabelas e listas quando apropriado.`,
      temperature: 0.3,
    },
    coder: {
      name: "Coder",
      icon: "💻",
      systemPrompt: `Você é um desenvolvedor full-stack sênior. Escreva código limpo, 
documentado e seguindo best practices. Explique decisões técnicas. Use o padrão do projeto
Panda Factory quando relevante (IIFE, async/await, JSDoc).`,
      temperature: 0.5,
    },
    designer: {
      name: "Designer",
      icon: "🎨",
      systemPrompt: `Você é um designer UI/UX sênior. Crie designs modernos, acessíveis e 
esteticamente agradáveis. Descreva layouts, cores, tipografia e interações. Quando pedido
prompts para IA visual, seja detalhado e específico.`,
      temperature: 0.9,
    },
    planner: {
      name: "Planner",
      icon: "📋",
      systemPrompt: `Você é um gerente de projetos e estrategista. Crie planos detalhados,
cronogramas, divida tarefas complexas em etapas menores. Identifique riscos e dependências.
Seja pragmático e orientado a resultados.`,
      temperature: 0.4,
    },
    researcher: {
      name: "Researcher",
      icon: "🔬",
      systemPrompt: `Você é um pesquisador acadêmico. Faça pesquisas aprofundadas,
cite fontes quando possível, apresente múltiplas perspectivas. Seja rigoroso com fatos
e diferencie opinião de evidência.`,
      temperature: 0.6,
    },
  };

  // ==========================================
  // 🔑 API KEY MANAGEMENT
  // ==========================================
  let apiKey = null;

  function setApiKey(key) {
    apiKey = key;
    localStorage.setItem("panda_gemini_key", key);
    log("API key configured");
  }

  function loadApiKey() {
    apiKey = localStorage.getItem("panda_gemini_key");
    return !!apiKey;
  }

  function hasApiKey() {
    return !!apiKey;
  }

  // ==========================================
  // 💬 CHAT API
  // ==========================================
  const GeminiAPI = {
    /**
     * Send chat message
     * @param {string} message - User message
     * @param {object} options - { gem, model, temperature, history }
     * @returns {Promise<{text, tokens, model}>}
     */
    async chat(message, options = {}) {
      if (!apiKey) {
        return {
          error: "API key not configured. Use Panda.Brain.Gemini.setApiKey()",
        };
      }

      const gem = options.gem ? GEMS[options.gem] : null;
      const model = options.model || CONFIG.defaultModel;
      const temp =
        options.temperature ?? gem?.temperature ?? CONFIG.temperature;

      const contents = [];

      // Add system prompt if using a GEM
      if (gem) {
        contents.push({
          role: "user",
          parts: [{ text: `[System: ${gem.systemPrompt}]` }],
        });
        contents.push({
          role: "model",
          parts: [{ text: "Entendido, vou atuar como " + gem.name + "." }],
        });
      }

      // Add history if provided
      if (options.history?.length) {
        contents.push(...options.history);
      }

      // Add current message
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      try {
        const response = await fetch(
          `${CONFIG.apiBase}/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: temp,
                maxOutputTokens: CONFIG.maxTokens,
              },
            }),
          },
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || "API Error");
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const tokens = data.usageMetadata?.totalTokenCount || 0;

        // Charge PC if Wallet available
        if (window.Panda?.Wallet?.charge) {
          const cost = Math.ceil(tokens / 1000); // 1 PC per 1k tokens
          await window.Panda.Wallet.charge(
            cost,
            `BRAIN_${gem?.name?.toUpperCase() || "CHAT"}`,
          );
        }

        return {
          text,
          tokens,
          model,
          gem: gem?.name,
        };
      } catch (error) {
        log("ERROR: " + error.message);
        return { error: error.message };
      }
    },

    /**
     * Analyze data with Analyst GEM
     */
    async analyze(data, question = "Analise estes dados") {
      const prompt =
        typeof data === "string"
          ? `${question}\n\nDados:\n${data}`
          : `${question}\n\nDados:\n${JSON.stringify(data, null, 2)}`;

      return this.chat(prompt, { gem: "analyst" });
    },

    /**
     * Generate code with Coder GEM
     */
    async code(task, language = "javascript") {
      return this.chat(`Tarefa: ${task}\nLinguagem: ${language}`, {
        gem: "coder",
      });
    },

    /**
     * Write content with Writer GEM
     */
    async write(topic, format = "post") {
      return this.chat(`Escreva um ${format} sobre: ${topic}`, {
        gem: "writer",
      });
    },

    /**
     * Generate design prompt with Designer GEM
     */
    async design(concept) {
      return this.chat(
        `Crie um prompt detalhado para gerar uma imagem de: ${concept}`,
        { gem: "designer" },
      );
    },

    /**
     * Plan project with Planner GEM
     */
    async plan(objective) {
      return this.chat(`Crie um plano detalhado para: ${objective}`, {
        gem: "planner",
      });
    },

    /**
     * Research topic with Researcher GEM
     */
    async research(topic) {
      return this.chat(`Pesquise sobre: ${topic}`, { gem: "researcher" });
    },

    // ==========================================
    // 🖼️ IMAGE GENERATION
    // ==========================================

    /**
     * Generate image with Gemini Image API
     */
    async generateImage(prompt, options = {}) {
      if (!apiKey) {
        return { error: "API key not configured" };
      }

      const model = "gemini-2.0-flash";

      try {
        const response = await fetch(
          `${CONFIG.apiBase}/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: `Generate an image: ${prompt}` }],
                },
              ],
              generationConfig: {
                responseModalities: ["image", "text"],
              },
            }),
          },
        );

        const data = await response.json();

        const parts = data.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find((p) => p.inlineData);

        if (imagePart) {
          return {
            success: true,
            image: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
          };
        }

        const textPart = parts.find((p) => p.text);
        return {
          success: false,
          description: textPart?.text,
          error: "Image generation not available",
        };
      } catch (error) {
        return { error: error.message };
      }
    },

    // ==========================================
    // UTILITIES
    // ==========================================
    setApiKey,
    hasApiKey,
    getGems: () => Object.entries(GEMS).map(([id, g]) => ({ id, ...g })),
    getModels: () => CONFIG.models,
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function log(message) {
    console.log(`🧠 [Brain/${CHILD_ID}] ${message}`);
    TM?.log?.("info", `${PARENT}:${CHILD_ID}`, message);
  }

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  loadApiKey();

  const register = () => {
    if (window.BrainParent) {
      window.BrainParent.registerChild(CHILD_ID, GeminiAPI);
      log("✓ Gemini child ready with 6 GEMs");
    } else {
      setTimeout(register, 100);
    }
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register);
  }

  window.Panda = window.Panda || {};
  window.Panda.Brain = window.Panda.Brain || {};
  window.Panda.Brain.Gemini = GeminiAPI;
  window.GeminiChild = GeminiAPI;
})(window);
