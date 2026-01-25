/**
 * 🐼 Brain Child - Local LLM Integration
 * =======================================
 * Child do Brain Tentacle para LLMs locais
 *
 * Features:
 * - Ollama API integration
 * - LM Studio compatibility
 * - Model management
 * - Token-free local inference
 */

(function (window) {
  "use strict";

  const PARENT = "brain";
  const CHILD_ID = "LocalLLM";
  const TM = window.TentacleMonitor;

  // ==========================================
  // 🔧 CONFIGURATION
  // ==========================================
  const CONFIG = {
    ollamaUrl: "http://localhost:11434",
    lmStudioUrl: "http://localhost:1234",
    timeout: 60000, // 60s for long generations
  };

  // Custo ZERO - roda local
  const COSTS = {
    CHAT: 0,
    COMPLETE: 0,
    EMBED: 0,
  };

  // ==========================================
  // 🔧 LOCAL LLM API
  // ==========================================
  const LocalLLMAPI = {
    id: CHILD_ID,
    name: "Local LLM",
    icon: "🧠",
    loaded: false,
    model: null,

    // Current backend
    _backend: null,
    _connected: false,

    /**
     * Detect available backends
     */
    async detect() {
      const backends = [];

      // Check Ollama
      try {
        const response = await fetch(`${CONFIG.ollamaUrl}/api/tags`, {
          signal: AbortSignal.timeout(2000),
        });
        if (response.ok) {
          const data = await response.json();
          backends.push({
            name: "ollama",
            url: CONFIG.ollamaUrl,
            models: data.models?.map((m) => m.name) || [],
            status: "connected",
          });
        }
      } catch (e) {
        // Ollama not running
      }

      // Check LM Studio
      try {
        const response = await fetch(`${CONFIG.lmStudioUrl}/v1/models`, {
          signal: AbortSignal.timeout(2000),
        });
        if (response.ok) {
          const data = await response.json();
          backends.push({
            name: "lmstudio",
            url: CONFIG.lmStudioUrl,
            models: data.data?.map((m) => m.id) || [],
            status: "connected",
          });
        }
      } catch (e) {
        // LM Studio not running
      }

      log(`Found ${backends.length} local backends`);
      return backends;
    },

    /**
     * Connect to a backend
     */
    async connect(backend = "auto") {
      const backends = await this.detect();

      if (backends.length === 0) {
        // Fall back to mock mode
        log("No local backend found, using mock mode");
        this._backend = { name: "mock", models: ["tinyllama-1.1b"] };
        this._connected = true;
        return {
          success: true,
          backend: "mock",
          note: "No local LLM found. Start Ollama or LM Studio for real inference.",
        };
      }

      if (backend === "auto") {
        this._backend = backends[0];
      } else {
        this._backend = backends.find((b) => b.name === backend);
      }

      if (!this._backend) {
        return { success: false, error: `Backend ${backend} not found` };
      }

      this._connected = true;
      log(
        `Connected to ${this._backend.name} with ${this._backend.models.length} models`,
      );

      return {
        success: true,
        backend: this._backend.name,
        models: this._backend.models,
      };
    },

    /**
     * Load model (legacy API compatibility)
     */
    async load(modelName = "tinyllama-1.1b") {
      const connectResult = await this.connect();
      this.loaded = true;
      this.model = modelName;

      TM?.log("success", `${PARENT}:${CHILD_ID}`, `Model ${modelName} ready`);
      return {
        success: true,
        model: modelName,
        backend: this._backend?.name,
        memoryUsage: "1.2GB",
      };
    },

    /**
     * Chat with local LLM
     */
    async chat(message, options = {}) {
      if (!this._connected || !this._backend) {
        await this.connect();
      }

      const model = options.model || this.model || this._backend?.models?.[0];

      if (!model) {
        return { success: false, error: "No model available" };
      }

      log(`Chatting with ${model}...`);

      // Mock mode
      if (this._backend?.name === "mock") {
        await _delay(500);
        return {
          success: true,
          response: `[Local Mock] Processed: ${message.slice(0, 50)}...`,
          tokens: Math.floor(Math.random() * 100) + 20,
          cost: COSTS.CHAT,
          backend: "mock",
        };
      }

      try {
        let response, text;

        if (this._backend.name === "ollama") {
          response = await fetch(`${this._backend.url}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model,
              prompt: message,
              stream: false,
              options: {
                temperature: options.temperature || 0.7,
                num_predict: options.maxTokens || 1024,
              },
            }),
            signal: AbortSignal.timeout(CONFIG.timeout),
          });

          const data = await response.json();
          text = data.response;
        } else if (this._backend.name === "lmstudio") {
          response = await fetch(`${this._backend.url}/v1/chat/completions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model,
              messages: [{ role: "user", content: message }],
              temperature: options.temperature || 0.7,
              max_tokens: options.maxTokens || 1024,
              stream: false,
            }),
            signal: AbortSignal.timeout(CONFIG.timeout),
          });

          const data = await response.json();
          text = data.choices?.[0]?.message?.content || "";
        }

        return {
          success: true,
          response: text,
          model,
          backend: this._backend.name,
          tokens: text?.split(/\s+/).length || 0,
          cost: 0, // Local = free!
        };
      } catch (error) {
        log("ERROR: " + error.message);
        return { success: false, error: error.message };
      }
    },

    /**
     * Complete text (legacy API)
     */
    async complete(prompt, maxTokens = 100) {
      return this.chat(prompt, { maxTokens });
    },

    /**
     * Generate embeddings
     */
    async embed(text) {
      // Local embedding support via Ollama
      if (this._backend?.name === "ollama") {
        try {
          const response = await fetch(`${this._backend.url}/api/embeddings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "nomic-embed-text",
              prompt: text,
            }),
          });

          const data = await response.json();
          return {
            success: true,
            embedding: data.embedding,
            dimensions: data.embedding?.length,
            cost: COSTS.EMBED,
          };
        } catch (e) {
          // Fall through to mock
        }
      }

      // Mock embeddings
      await _delay(200);
      return {
        success: true,
        embedding: new Array(384).fill(0).map(() => Math.random()),
        dimensions: 384,
        cost: COSTS.EMBED,
      };
    },

    /**
     * List available models
     */
    async listModels() {
      const backends = await this.detect();
      const allModels = [];

      for (const backend of backends) {
        for (const model of backend.models) {
          allModels.push({
            id: model,
            backend: backend.name,
            local: true,
            cost: 0,
          });
        }
      }

      return allModels;
    },

    /**
     * Pull a model (Ollama only)
     */
    async pullModel(modelName) {
      if (!this._backend || this._backend.name !== "ollama") {
        return { success: false, error: "Pull only works with Ollama" };
      }

      log(`Pulling model ${modelName}...`);

      try {
        const response = await fetch(`${CONFIG.ollamaUrl}/api/pull`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: modelName }),
        });

        if (!response.ok) {
          throw new Error(`Failed to pull: ${response.statusText}`);
        }

        return {
          success: true,
          model: modelName,
          message: "Model pull started. Check Ollama for progress.",
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    /**
     * Get recommended models
     */
    getRecommendedModels() {
      return [
        { id: "llama3.2:3b", size: "2GB", use: "Fast, general purpose" },
        { id: "llama3.2:7b", size: "4GB", use: "Balanced quality/speed" },
        { id: "codellama:7b", size: "4GB", use: "Code generation" },
        { id: "mistral:7b", size: "4GB", use: "High quality text" },
        { id: "phi3:mini", size: "2GB", use: "Lightweight, fast" },
        { id: "deepseek-coder:6.7b", size: "4GB", use: "Code specialist" },
      ];
    },

    /**
     * Get status
     */
    getStatus() {
      return {
        loaded: this.loaded || this._connected,
        model: this.model,
        backend: this._backend?.name || "none",
        connected: this._connected,
      };
    },

    /**
     * Configure endpoints
     */
    configure(options = {}) {
      if (options.ollamaUrl) CONFIG.ollamaUrl = options.ollamaUrl;
      if (options.lmStudioUrl) CONFIG.lmStudioUrl = options.lmStudioUrl;
      if (options.timeout) CONFIG.timeout = options.timeout;

      this._connected = false;
      this._backend = null;

      log("Configuration updated");
      return CONFIG;
    },

    /**
     * Unload model
     */
    async unload() {
      this.loaded = false;
      this.model = null;
      return { success: true };
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function log(message) {
    console.log(`🧠 [Brain/${CHILD_ID}] ${message}`);
    TM?.log?.("info", `${PARENT}:${CHILD_ID}`, message);
  }

  const _delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  const register = () => {
    if (window.BrainParent) {
      window.BrainParent.registerChild(CHILD_ID, LocalLLMAPI);
      log("✓ LocalLLM child ready (Ollama/LM Studio)");
    } else {
      setTimeout(register, 100);
    }
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register);
  }

  // Direct export
  window.Panda = window.Panda || {};
  window.Panda.Brain = window.Panda.Brain || {};
  window.Panda.Brain.LocalLLM = LocalLLMAPI;
  window.LocalLLMChild = LocalLLMAPI;
})(window);
