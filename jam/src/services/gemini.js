/**
 * 🐼 Gemini Service - Google AI Integration
 * SDK: @google/genai (Biblioteca Recomendada)
 *
 * Modelos:
 * - gemini-3-flash-preview: Chat rápido (FREE)
 * - gemini-3-pro-preview: Análises complexas
 * - gemini-3-pro-image-preview: Geração de imagens
 *
 * Features:
 * - Thinking Levels (minimal, low, medium, high)
 * - Native Tools (googleSearch, urlContext, codeExecution)
 * - Function Calling
 * - MCP Integration
 */

// Model configurations
export const AI_MODELS = {
  flash: {
    id: "gemini-3-flash-preview",
    name: "Flash",
    icon: "⚡",
    description: "Rápido e eficiente",
    free: true,
    thinkingLevels: ["minimal", "low", "medium", "high"],
    defaultThinking: "low",
  },
  pro: {
    id: "gemini-3-pro-preview",
    name: "Pro",
    icon: "🧠",
    description: "Análises complexas",
    free: false,
    thinkingLevels: ["low", "high"],
    defaultThinking: "high",
  },
  thinking: {
    id: "gemini-3-flash-preview",
    name: "Think",
    icon: "🤔",
    description: "Raciocínio profundo",
    free: true,
    thinkingLevels: ["high"],
    defaultThinking: "high",
  },
  research: {
    id: "deep-research-pro-preview-12-2025",
    name: "Research",
    icon: "🔬",
    description: "Pesquisa aprofundada",
    free: false,
    isAgent: true,
  },
  imagen: {
    id: "gemini-3-pro-image-preview",
    name: "Imagen",
    icon: "🎨",
    description: "Gerar imagens",
    free: false,
    isImageModel: true,
  },
};

// Billing rates (PC per 1k tokens)
const RATES = {
  "gemini-3-flash-preview": { in: 0, out: 0 },
  "gemini-3-pro-preview": { in: 0.015, out: 0.06 },
  "gemini-3-pro-image-preview": { perImage: 50 },
  "deep-research-pro-preview-12-2025": { in: 0.04, out: 0.16 },
};

/**
 * GeminiService - Main class for Gemini API interaction
 */
class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.conversationHistory = [];
    this.isInitialized = false;
    this.ai = null;
  }

  /**
   * Initialize the GoogleGenAI client
   * Lazy initialization to avoid import issues
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Dynamic import for browser compatibility
      const { GoogleGenAI } = await import("@google/genai");
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Gemini:", error);
      throw new Error(
        "Gemini SDK not available. Install with: npm install @google/genai",
      );
    }
  }

  /**
   * Send a chat message
   * @param {string} message - User message
   * @param {object} options - Configuration options
   * @returns {Promise<object>} - Response with text, usage, cost
   */
  async chat(message, options = {}) {
    await this.init();

    const {
      model = "flash",
      thinkingLevel,
      tools = [],
      useSearch = false,
      useUrlContext = false,
      keepHistory = true,
    } = options;

    const modelConfig = AI_MODELS[model] || AI_MODELS.flash;
    const modelId = modelConfig.id;
    const thinking = thinkingLevel || modelConfig.defaultThinking;

    // Build contents with history
    const contents = keepHistory
      ? [
          ...this.conversationHistory,
          { role: "user", parts: [{ text: message }] },
        ]
      : [{ role: "user", parts: [{ text: message }] }];

    // Build tools array
    const configTools = [...tools];
    if (useSearch) configTools.push({ googleSearch: {} });
    if (useUrlContext) configTools.push({ urlContext: {} });

    // Build config
    const config = {
      thinkingConfig: {
        thinkingLevel: thinking,
      },
    };

    if (configTools.length > 0) {
      config.tools = configTools;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: modelId,
        contents,
        config,
      });

      const responseText = response.text || "";
      const usage = response.usageMetadata || {};

      // Update history
      if (keepHistory) {
        this.conversationHistory.push({
          role: "user",
          parts: [{ text: message }],
        });
        this.conversationHistory.push({
          role: "model",
          parts: [{ text: responseText }],
        });
      }

      return {
        text: responseText,
        model: modelId,
        modelName: modelConfig.name,
        modelIcon: modelConfig.icon,
        usage: {
          inputTokens: usage.promptTokenCount || 0,
          outputTokens: usage.candidatesTokenCount || 0,
          thinkingTokens: usage.thoughtsTokenCount || 0,
          totalTokens: usage.totalTokenCount || 0,
        },
        costPC: this.calculateCost(modelId, usage),
      };
    } catch (error) {
      console.error("Gemini chat error:", error);
      throw error;
    }
  }

  /**
   * Generate an image
   * @param {string} prompt - Image description
   * @param {object} options - Image config
   * @returns {Promise<object>} - Base64 image data
   */
  async generateImage(prompt, options = {}) {
    await this.init();

    const {
      aspectRatio = "1:1",
      imageSize = "2K",
      useSearch = false,
    } = options;

    const config = {
      imageConfig: {
        aspectRatio,
        imageSize,
      },
    };

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    try {
      const response = await this.ai.models.generateContent({
        model: AI_MODELS.imagen.id,
        contents: prompt,
        config,
      });

      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData,
      );

      return {
        base64: imagePart?.inlineData?.data || null,
        mimeType: imagePart?.inlineData?.mimeType || "image/png",
        usage: response.usageMetadata,
        costPC: RATES["gemini-3-pro-image-preview"].perImage,
      };
    } catch (error) {
      console.error("Gemini image error:", error);
      throw error;
    }
  }

  /**
   * Start a deep research task
   * @param {string} topic - Research topic
   * @returns {Promise<object>} - Research result
   */
  async research(topic, options = {}) {
    await this.init();

    try {
      // Deep Research uses interactions API with background=true
      const response = await this.ai.interactions.create({
        input: topic,
        agent: AI_MODELS.research.id,
        background: true,
      });

      return {
        id: response.id,
        status: response.status,
        poll: async () => {
          const result = await this.ai.interactions.get(response.id);
          return {
            status: result.status,
            text: result.outputs?.[result.outputs.length - 1]?.text,
            usage: result.usage,
          };
        },
      };
    } catch (error) {
      console.error("Gemini research error:", error);
      throw error;
    }
  }

  /**
   * Calculate cost in Panda Coins
   * @param {string} model - Model ID
   * @param {object} usage - Usage metadata
   * @returns {number} - Cost in PC
   */
  calculateCost(model, usage) {
    const rate = RATES[model] || RATES["gemini-3-flash-preview"];

    if (rate.perImage) {
      return rate.perImage;
    }

    const inputTokens = usage.promptTokenCount || 0;
    const outputTokens = usage.candidatesTokenCount || 0;
    const thinkingTokens = usage.thoughtsTokenCount || 0;

    return (
      (inputTokens / 1000) * rate.in +
      (outputTokens / 1000) * rate.out +
      (thinkingTokens / 1000) * rate.in * 2 // Thinking costs 2x
    );
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get available models
   * @returns {array} - List of model configs
   */
  static getModels() {
    return Object.entries(AI_MODELS).map(([key, config]) => ({
      key,
      ...config,
    }));
  }
}

export default GeminiService;
