/**
 * 🧠 Panda Brain Service - AI Core Level 2
 *
 * ARQUITETURA AI CORES:
 * - Nível 1: PAT (Founder Only) - Governança, Decisões Estratégicas
 * - Nível 2: Panda.Brain (Este) - API para Devs/Users + 6 GEMs
 * - Nível 3: Antigravity - BYOL para Devs
 *
 * 6 GEMs (Especialistas):
 * - ✍️ Writer: Escrita criativa, copywriting
 * - 📊 Analyst: Análise de dados, insights
 * - 💻 Coder: Programação, debug
 * - 🎨 Designer: UI/UX, design visual
 * - 📋 Planner: Planejamento, roadmaps
 * - 🔬 Researcher: Pesquisa aprofundada
 *
 * SDK: @google/genai (Gemini 3)
 */

import GeminiService, { AI_MODELS } from "./gemini.js";

// ==========================================
// 6 GEMs - Especialistas de IA
// ==========================================

export const GEMS = {
  writer: {
    id: "writer",
    name: "Writer",
    icon: "✍️",
    description: "Escrita criativa, copywriting, textos",
    systemPrompt: `Você é um escritor profissional especializado em:
- Copywriting persuasivo
- Artigos e blog posts
- Storytelling
- Scripts e roteiros
- Tradução e adaptação

Sempre escreva com clareza, engajamento e propósito. Use técnicas de copywriting quando apropriado.`,
    model: "flash",
    thinkingLevel: "low",
  },

  analyst: {
    id: "analyst",
    name: "Analyst",
    icon: "📊",
    description: "Análise de dados, insights, métricas",
    systemPrompt: `Você é um analista de dados especializado em:
- Análise estatística
- Interpretação de métricas
- Visualização de dados
- Insights acionáveis
- Relatórios executivos

Forneça análises precisas, objetivas e com recomendações práticas.`,
    model: "pro",
    thinkingLevel: "high",
  },

  coder: {
    id: "coder",
    name: "Coder",
    icon: "💻",
    description: "Programação, debug, arquitetura",
    systemPrompt: `Você é um desenvolvedor sênior especializado em:
- JavaScript/TypeScript, React, Node.js
- Python, Rust
- Arquitetura de software
- Debug e otimização
- Best practices e clean code

Escreva código limpo, documentado e testável. Explique decisões de design.`,
    model: "pro",
    thinkingLevel: "high",
  },

  designer: {
    id: "designer",
    name: "Designer",
    icon: "🎨",
    description: "UI/UX, design visual, branding",
    systemPrompt: `Você é um designer UI/UX e visual especializado em:
- Design de interfaces
- Experiência do usuário
- Branding e identidade visual
- Design systems
- Acessibilidade

Forneça feedback visual, sugestões de cores, tipografia e layout.`,
    model: "flash",
    thinkingLevel: "low",
  },

  planner: {
    id: "planner",
    name: "Planner",
    icon: "📋",
    description: "Planejamento, roadmaps, estratégia",
    systemPrompt: `Você é um estrategista e planejador especializado em:
- Planejamento de projetos
- Roadmaps e milestones
- OKRs e métricas
- Gestão de riscos
- Priorização

Crie planos claros, acionáveis e com prazos realistas.`,
    model: "pro",
    thinkingLevel: "high",
  },

  researcher: {
    id: "researcher",
    name: "Researcher",
    icon: "🔬",
    description: "Pesquisa aprofundada, análise de mercado",
    systemPrompt: `Você é um pesquisador especializado em:
- Pesquisa de mercado
- Análise competitiva
- Tendências e inovação
- Due diligence
- Síntese de informações

Forneça pesquisas objetivas, com fontes quando possível, e conclusões fundamentadas.`,
    model: "research",
    thinkingLevel: "high",
    useSearch: true,
  },
};

// ==========================================
// PandaBrain Class
// ==========================================

class PandaBrain {
  constructor(config = {}) {
    this.apiKey = config.apiKey || null;
    this.gemini = null;
    this.activeGem = null;
    this.userId = config.userId || null;
    this.userTier = config.userTier || "free"; // "free" | "pro" | "founder"
    this.conversationHistory = [];
  }

  /**
   * Initialize with API key
   */
  async init(apiKey) {
    this.apiKey = apiKey;
    this.gemini = new GeminiService(apiKey);
    await this.gemini.init();
  }

  /**
   * Check if initialized
   */
  isReady() {
    return this.gemini !== null && this.gemini.isInitialized;
  }

  // ==========================================
  // Core Chat Methods
  // ==========================================

  /**
   * Simple chat with model selection
   */
  async chat(message, options = {}) {
    if (!this.isReady()) {
      throw new Error("PandaBrain not initialized. Call init() first.");
    }

    const {
      model = "flash",
      gem = null,
      useSearch = false,
      keepHistory = true,
    } = options;

    // If GEM is specified, use GEM config
    if (gem && GEMS[gem]) {
      return this.useGem(gem, message, options);
    }

    // Direct model chat
    const response = await this.gemini.chat(message, {
      model,
      useSearch,
      keepHistory,
    });

    // Add billing info
    response.billing = this.calculateBilling(response);

    return response;
  }

  /**
   * Chat with a specific GEM
   */
  async useGem(gemId, message, options = {}) {
    const gem = GEMS[gemId];
    if (!gem) {
      throw new Error(
        `GEM "${gemId}" not found. Available: ${Object.keys(GEMS).join(", ")}`,
      );
    }

    // Prepend system prompt to message
    const fullMessage = `${gem.systemPrompt}\n\n---\n\nUsuário: ${message}`;

    const response = await this.gemini.chat(fullMessage, {
      model: gem.model,
      thinkingLevel: gem.thinkingLevel,
      useSearch: gem.useSearch || options.useSearch,
      keepHistory: options.keepHistory ?? true,
    });

    return {
      ...response,
      gem: {
        id: gem.id,
        name: gem.name,
        icon: gem.icon,
      },
      billing: this.calculateBilling(response),
    };
  }

  // ==========================================
  // GEM Shortcuts
  // ==========================================

  /**
   * ✍️ Write content
   */
  async write(topic, format = "article") {
    const prompt = `Escreva um(a) ${format} sobre: ${topic}`;
    return this.useGem("writer", prompt);
  }

  /**
   * 📊 Analyze data
   */
  async analyze(data, question) {
    const prompt = `Analise os seguintes dados:\n${JSON.stringify(data, null, 2)}\n\nPergunta: ${question}`;
    return this.useGem("analyst", prompt);
  }

  /**
   * 💻 Generate code
   */
  async code(task, language = "javascript") {
    const prompt = `Crie código em ${language} para: ${task}`;
    return this.useGem("coder", prompt);
  }

  /**
   * 🎨 Design feedback
   */
  async design(concept, type = "UI") {
    const prompt = `Dê feedback de ${type} design para: ${concept}`;
    return this.useGem("designer", prompt);
  }

  /**
   * 📋 Create plan
   */
  async plan(objective, timeframe = "30 dias") {
    const prompt = `Crie um plano para: ${objective}\nPrazo: ${timeframe}`;
    return this.useGem("planner", prompt);
  }

  /**
   * 🔬 Research topic
   */
  async research(topic, depth = "detailed") {
    const prompt = `Pesquise sobre: ${topic}\nNível de detalhe: ${depth}`;
    return this.useGem("researcher", prompt, { useSearch: true });
  }

  // ==========================================
  // Image Generation
  // ==========================================

  /**
   * 🎨 Generate image
   */
  async generateImage(prompt, options = {}) {
    if (!this.isReady()) {
      throw new Error("PandaBrain not initialized.");
    }

    const response = await this.gemini.generateImage(prompt, options);
    response.billing = {
      costPC: response.costPC,
      free: false,
    };

    return response;
  }

  // ==========================================
  // Utilities
  // ==========================================

  /**
   * Calculate billing based on user tier
   *
   * BILLING STRUCTURE:
   * - Founder: 1.03% maintenance fee (always)
   * - Dev: Full cost (PC per token)
   * - User: Full cost (PC per token)
   * - Gas: Disabled pre-beta, enabled on beta
   */
  calculateBilling(response) {
    const { costPC = 0, model } = response;
    const modelConfig = AI_MODELS[model] || AI_MODELS.flash;

    // Gas is disabled pre-beta
    const gasEnabled = false; // TODO: Enable on beta launch
    const gasRate = gasEnabled ? 0.03 : 0; // 3% gas when enabled

    // Founder maintenance fee
    const founderFee = 0.0103; // 1.03%

    // Free tier models don't charge PC (only gas when enabled)
    if (modelConfig.free) {
      const gasAmount = costPC * gasRate;
      return {
        costPC: gasAmount,
        baseCost: 0,
        gasFee: gasAmount,
        gasEnabled,
        free: true,
        tier: this.userTier,
      };
    }

    // Calculate fees
    const baseCost = costPC;
    const gasFee = gasEnabled ? baseCost * gasRate : 0;
    const founderMaintenance = baseCost * founderFee;
    const totalCost = baseCost + gasFee;

    return {
      costPC: totalCost,
      baseCost,
      gasFee,
      gasEnabled,
      founderMaintenance, // 1.03% goes to founder
      free: false,
      tier: this.userTier,
    };
  }

  /**
   * Get available GEMs
   */
  static getGems() {
    return Object.values(GEMS);
  }

  /**
   * Get available models
   */
  static getModels() {
    return GeminiService.getModels();
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
    if (this.gemini) {
      this.gemini.clearHistory();
    }
  }
}

// ==========================================
// Singleton Instance
// ==========================================

let brainInstance = null;

export function getPandaBrain(config = {}) {
  if (!brainInstance) {
    brainInstance = new PandaBrain(config);
  }
  return brainInstance;
}

export default PandaBrain;
