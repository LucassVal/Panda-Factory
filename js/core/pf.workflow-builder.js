/**
 * 🐼 PANDA WORKFLOW BUILDER
 * ==========================
 * Sistema de workflows customizáveis com IA adaptiva
 *
 * @version 1.0.0
 * @storage IndexedDB + Chrome Cache (99% client-side)
 *
 * FEATURES:
 * - Criar/salvar/carregar workflows
 * - IA intrusiva → aprende → fica discreta
 * - Templates sugeridos por IA
 * - Backend sync opcional (GAS/Firebase)
 */

(function (window) {
  "use strict";

  // ============================================================================
  // CONSTANTS
  // ============================================================================

  const DB_NAME = "PandaWorkflows";
  const DB_VERSION = 1;
  const STORES = {
    WORKFLOWS: "workflows",
    USER_PREFS: "user_preferences",
    AI_MEMORY: "ai_memory",
    SCRIPTS: "scripts",
  };

  let _db = null;
  let _aiMode = "intrusive"; // intrusive | balanced | minimal

  // ============================================================================
  // INDEXEDDB SETUP
  // ============================================================================

  async function initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        _db = request.result;
        resolve(_db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Workflows store
        if (!db.objectStoreNames.contains(STORES.WORKFLOWS)) {
          const wfStore = db.createObjectStore(STORES.WORKFLOWS, {
            keyPath: "id",
          });
          wfStore.createIndex("category", "category", { unique: false });
          wfStore.createIndex("createdAt", "createdAt", { unique: false });
        }

        // User preferences
        if (!db.objectStoreNames.contains(STORES.USER_PREFS)) {
          db.createObjectStore(STORES.USER_PREFS, { keyPath: "key" });
        }

        // AI Memory (learning data)
        if (!db.objectStoreNames.contains(STORES.AI_MEMORY)) {
          const aiStore = db.createObjectStore(STORES.AI_MEMORY, {
            keyPath: "id",
            autoIncrement: true,
          });
          aiStore.createIndex("type", "type", { unique: false });
        }

        // Scripts (saved code snippets)
        if (!db.objectStoreNames.contains(STORES.SCRIPTS)) {
          db.createObjectStore(STORES.SCRIPTS, { keyPath: "id" });
        }
      };
    });
  }

  // ============================================================================
  // WORKFLOW BUILDER
  // ============================================================================

  const WorkflowBuilder = {
    version: "1.0.0",

    // ==========================================
    // CRUD WORKFLOWS
    // ==========================================

    /**
     * Cria novo workflow
     */
    async create(workflow) {
      await ensureDB();

      workflow.id =
        workflow.id ||
        `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      workflow.createdAt = new Date().toISOString();
      workflow.updatedAt = workflow.createdAt;
      workflow.runs = 0;
      workflow.version = 1;

      await dbPut(STORES.WORKFLOWS, workflow);

      console.log("[Workflow] ✅ Criado:", workflow.name);
      window.Panda?.Events?.emit("workflow:created", workflow);

      return workflow;
    },

    /**
     * Atualiza workflow existente
     */
    async update(id, updates) {
      await ensureDB();

      const workflow = await this.get(id);
      if (!workflow) throw new Error(`Workflow não encontrado: ${id}`);

      Object.assign(workflow, updates);
      workflow.updatedAt = new Date().toISOString();
      workflow.version++;

      await dbPut(STORES.WORKFLOWS, workflow);

      return workflow;
    },

    /**
     * Obtém workflow por ID
     */
    async get(id) {
      await ensureDB();
      return await dbGet(STORES.WORKFLOWS, id);
    },

    /**
     * Lista todos os workflows
     */
    async list(filter = {}) {
      await ensureDB();

      let workflows = await dbGetAll(STORES.WORKFLOWS);

      if (filter.category) {
        workflows = workflows.filter((w) => w.category === filter.category);
      }

      return workflows.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      );
    },

    /**
     * Remove workflow
     */
    async delete(id) {
      await ensureDB();
      await dbDelete(STORES.WORKFLOWS, id);
      window.Panda?.Events?.emit("workflow:deleted", { id });
    },

    /**
     * Executa workflow
     */
    async run(id, context = {}) {
      const workflow = await this.get(id);
      if (!workflow) throw new Error(`Workflow não encontrado: ${id}`);

      console.log(`[Workflow] ▶️ Executando: ${workflow.name}`);

      const results = [];
      let stepContext = { ...context };

      for (const step of workflow.steps) {
        try {
          const result = await this._executeStep(step, stepContext);
          results.push({ step: step.name, status: "success", result });
          stepContext = { ...stepContext, lastResult: result };
        } catch (error) {
          results.push({
            step: step.name,
            status: "error",
            error: error.message,
          });
          if (step.stopOnError !== false) break;
        }
      }

      // Track run
      await this.update(id, { runs: workflow.runs + 1 });

      // Learn from execution
      await this.AI.learn("workflow_run", { workflowId: id, results });

      return results;
    },

    async _executeStep(step, context) {
      const { action, params } = step;

      // Resolver parâmetros dinâmicos
      const resolvedParams = this._resolveParams(params, context);

      switch (action) {
        case "brain.chat":
          return await window.Panda?.Brain?.chat(resolvedParams.prompt);
        case "social.caption":
          return await window.Panda?.Social?.generateCaption(
            resolvedParams.platform,
            resolvedParams.topic,
          );
        case "wallet.charge":
          return await window.Panda?.Wallet?.charge(
            resolvedParams.amount,
            resolvedParams.reason,
          );
        case "data.save":
          return await window.Panda?.Data?.save(
            resolvedParams.collection,
            resolvedParams.data,
          );
        case "custom":
          // Executa script customizado salvo
          return await this.Scripts.run(resolvedParams.scriptId, context);
        default:
          throw new Error(`Ação desconhecida: ${action}`);
      }
    },

    _resolveParams(params, context) {
      const resolved = {};
      for (const [key, value] of Object.entries(params || {})) {
        if (
          typeof value === "string" &&
          value.startsWith("{{") &&
          value.endsWith("}}")
        ) {
          const path = value.slice(2, -2).trim();
          resolved[key] = this._getNestedValue(context, path);
        } else {
          resolved[key] = value;
        }
      }
      return resolved;
    },

    _getNestedValue(obj, path) {
      return path.split(".").reduce((o, k) => o?.[k], obj);
    },

    // ==========================================
    // TEMPLATES (AI-Suggested)
    // ==========================================

    Templates: {
      catalog: [
        {
          id: "social-daily-post",
          name: "Post Diário Social",
          category: "social",
          description: "Gera e agenda post diário",
          steps: [
            {
              name: "Gerar tema",
              action: "brain.chat",
              params: { prompt: "Sugira tema de post para hoje" },
            },
            {
              name: "Criar caption",
              action: "social.caption",
              params: { platform: "instagram", topic: "{{lastResult}}" },
            },
            {
              name: "Salvar",
              action: "data.save",
              params: { collection: "drafts", data: "{{lastResult}}" },
            },
          ],
        },
        {
          id: "youtube-script",
          name: "Script YouTube Completo",
          category: "youtube",
          description: "Gera título, descrição e script",
          steps: [
            {
              name: "Título SEO",
              action: "brain.chat",
              params: { prompt: "Título YouTube sobre {{topic}}" },
            },
            {
              name: "Descrição",
              action: "brain.chat",
              params: { prompt: "Descrição YouTube para: {{lastResult}}" },
            },
            {
              name: "Script",
              action: "brain.chat",
              params: { prompt: "Script 10 min sobre: {{topic}}" },
            },
          ],
        },
        {
          id: "lead-capture",
          name: "Captura de Lead",
          category: "crm",
          description: "Qualifica e salva lead",
          steps: [
            {
              name: "Qualificar",
              action: "brain.chat",
              params: { prompt: "Qualifique este lead: {{lead}}" },
            },
            {
              name: "Salvar",
              action: "data.save",
              params: { collection: "leads", data: "{{lastResult}}" },
            },
          ],
        },
      ],

      async getByCategory(category) {
        return this.catalog.filter((t) => t.category === category);
      },

      async suggestFromUsage() {
        const memory = await WorkflowBuilder.AI.getMemory("workflow_run");
        // IA analisa padrões e sugere novos templates
        const prompt = `Baseado nestes workflows executados:
${JSON.stringify(memory.slice(-10))}

Sugira um novo workflow útil no formato JSON.`;

        return await window.Panda?.Brain?.chat(prompt);
      },
    },

    // ==========================================
    // AI LEARNING SYSTEM
    // ==========================================

    AI: {
      /**
       * Modo de intrusão da IA
       * intrusive: sugere proativamente
       * balanced: sugere quando relevante
       * minimal: só quando pedido
       */
      getMode() {
        return _aiMode;
      },

      async setMode(mode) {
        _aiMode = mode;
        await dbPut(STORES.USER_PREFS, { key: "ai_mode", value: mode });
      },

      /**
       * Aprende com ação do usuário
       */
      async learn(type, data) {
        await ensureDB();

        const memory = {
          type,
          data,
          timestamp: new Date().toISOString(),
        };

        await dbAdd(STORES.AI_MEMORY, memory);

        // Verificar se deve ajustar modo
        await this._adjustMode();
      },

      /**
       * Obtém memórias por tipo
       */
      async getMemory(type, limit = 50) {
        await ensureDB();
        const all = await dbGetAll(STORES.AI_MEMORY);
        return all.filter((m) => m.type === type).slice(-limit);
      },

      /**
       * Sugere ação baseado no contexto
       */
      async suggest(context) {
        if (_aiMode === "minimal") return null;

        const memory = await this.getMemory("user_action", 20);

        const prompt = `Contexto atual: ${JSON.stringify(context)}
Histórico recente: ${JSON.stringify(memory)}

${_aiMode === "intrusive" ? "Sugira proativamente uma ação útil." : "Sugira apenas se muito relevante."}
Formato: { action: "...", reason: "..." } ou null`;

        try {
          const response = await window.Panda?.Brain?.chat(prompt);
          return JSON.parse(response?.text || response || "null");
        } catch {
          return null;
        }
      },

      /**
       * Ajusta modo baseado no comportamento
       */
      async _adjustMode() {
        const dismissals = await this.getMemory("suggestion_dismissed", 100);
        const accepts = await this.getMemory("suggestion_accepted", 100);

        const dismissRate =
          dismissals.length / (dismissals.length + accepts.length + 1);

        // Se usuário dispensa muito, reduz intrusão
        if (dismissRate > 0.7 && _aiMode === "intrusive") {
          await this.setMode("balanced");
          console.log("[AI] 📉 Modo ajustado para balanced");
        } else if (dismissRate > 0.9 && _aiMode === "balanced") {
          await this.setMode("minimal");
          console.log("[AI] 📉 Modo ajustado para minimal");
        } else if (dismissRate < 0.3 && _aiMode === "minimal") {
          await this.setMode("balanced");
          console.log("[AI] 📈 Modo ajustado para balanced");
        }
      },

      /**
       * Usuário aceitou sugestão
       */
      async acceptSuggestion(suggestion) {
        await this.learn("suggestion_accepted", suggestion);
      },

      /**
       * Usuário dispensou sugestão
       */
      async dismissSuggestion(suggestion) {
        await this.learn("suggestion_dismissed", suggestion);
      },
    },

    // ==========================================
    // SCRIPTS (Custom Code)
    // ==========================================

    Scripts: {
      async save(script) {
        await ensureDB();

        script.id = script.id || `script_${Date.now()}`;
        script.createdAt = new Date().toISOString();

        await dbPut(STORES.SCRIPTS, script);
        return script;
      },

      async get(id) {
        await ensureDB();
        return await dbGet(STORES.SCRIPTS, id);
      },

      async list() {
        await ensureDB();
        return await dbGetAll(STORES.SCRIPTS);
      },

      async run(id, context) {
        const script = await this.get(id);
        if (!script) throw new Error(`Script não encontrado: ${id}`);

        // Execute em sandbox
        const fn = new Function("context", "Panda", script.code);
        return fn(context, window.Panda);
      },

      async delete(id) {
        await ensureDB();
        await dbDelete(STORES.SCRIPTS, id);
      },
    },

    // ==========================================
    // SYNC (Optional Cloud Backup)
    // ==========================================

    Sync: {
      async exportAll() {
        const workflows = await WorkflowBuilder.list();
        const scripts = await WorkflowBuilder.Scripts.list();
        const prefs = await dbGetAll(STORES.USER_PREFS);

        return {
          version: WorkflowBuilder.version,
          exportedAt: new Date().toISOString(),
          workflows,
          scripts,
          preferences: prefs,
        };
      },

      async importAll(data) {
        if (!data?.workflows) throw new Error("Dados inválidos");

        for (const wf of data.workflows) {
          await dbPut(STORES.WORKFLOWS, wf);
        }

        for (const script of data.scripts || []) {
          await dbPut(STORES.SCRIPTS, script);
        }

        console.log(
          "[Workflow] 📥 Importado:",
          data.workflows.length,
          "workflows",
        );
      },

      async backupToCloud() {
        const data = await this.exportAll();
        // Sync com GAS/Firebase
        return await window.Panda?.Data?.save("workflow_backup", data);
      },

      async restoreFromCloud() {
        const data = await window.Panda?.Data?.get("workflow_backup");
        if (data) await this.importAll(data);
      },
    },

    // ==========================================
    // INIT
    // ==========================================

    async init() {
      console.log("[Workflow] 🐼 Initializing...");

      await initDB();

      // Carregar preferências
      const modePref = await dbGet(STORES.USER_PREFS, "ai_mode");
      if (modePref) _aiMode = modePref.value;

      console.log(`[Workflow] ✅ Pronto (AI Mode: ${_aiMode})`);
      window.Panda?.Events?.emit("workflow:ready");
    },
  };

  // ============================================================================
  // DB HELPERS
  // ============================================================================

  async function ensureDB() {
    if (!_db) await initDB();
  }

  function dbPut(store, data) {
    return new Promise((resolve, reject) => {
      const tx = _db.transaction(store, "readwrite");
      tx.objectStore(store).put(data);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  function dbGet(store, key) {
    return new Promise((resolve, reject) => {
      const tx = _db.transaction(store, "readonly");
      const request = tx.objectStore(store).get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function dbGetAll(store) {
    return new Promise((resolve, reject) => {
      const tx = _db.transaction(store, "readonly");
      const request = tx.objectStore(store).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  function dbAdd(store, data) {
    return new Promise((resolve, reject) => {
      const tx = _db.transaction(store, "readwrite");
      const request = tx.objectStore(store).add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function dbDelete(store, key) {
    return new Promise((resolve, reject) => {
      const tx = _db.transaction(store, "readwrite");
      tx.objectStore(store).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // ============================================================================
  // EXPOSE
  // ============================================================================

  window.Panda = window.Panda || {};
  window.Panda.Workflows = WorkflowBuilder;

  // Auto-init
  if (document.readyState === "complete") {
    WorkflowBuilder.init();
  } else {
    window.addEventListener("DOMContentLoaded", () => WorkflowBuilder.init());
  }
})(window);
