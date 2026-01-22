/**
 * 🐼 Panda SDK v0.5 (Enterprise Mock - Code Frozen)
 * ==================================================
 * Módulos: Auth, Events, Data, Storage, Wallet, Brain, GPU, Bridge, UI
 *
 * Este é o SDK Mock definitivo para desenvolvimento de UI.
 * Todas as chamadas simulam latência e retornam dados fake.
 *
 * @author Panda Fabrics
 * @version 0.5.0
 */

(function (window) {
  "use strict";

  // ==========================================
  // ⚙️ CONFIGURAÇÃO GLOBAL
  // ==========================================
  const Config = {
    mode: "CLOUD", // 'LOCAL' (Rust) ou 'CLOUD' (GAS)
    version: "0.6.0",
    debug: true,
    agentConnected: false, // Simula se Rust Agent está online
    mockDelay: { min: 300, max: 1200 },
  };

  // Delay aleatório para simular latência real
  const fakeDelay = (ms) =>
    new Promise((r) =>
      setTimeout(
        r,
        ms || randomBetween(Config.mockDelay.min, Config.mockDelay.max),
      ),
    );
  const randomBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const log = (module, msg, data) => {
    if (Config.debug)
      console.log(
        `%c[${module}] ${msg}`,
        "color: #6d5dfc; font-weight: bold;",
        data || "",
      );
  };

  // ==========================================
  // 📢 EVENT BUS (Sistema Nervoso Central)
  // ==========================================
  const _listeners = {};

  const Events = {
    on: (event, callback) => {
      if (!_listeners[event]) _listeners[event] = [];
      _listeners[event].push(callback);
      log("EVENTS", `Subscribed to "${event}"`);
    },

    off: (event, callback) => {
      if (!_listeners[event]) return;
      _listeners[event] = _listeners[event].filter((cb) => cb !== callback);
      log("EVENTS", `Unsubscribed from "${event}"`);
    },

    emit: (event, data) => {
      log("EVENTS", `⚡ Emitting "${event}"`, data);
      if (_listeners[event]) {
        _listeners[event].forEach((cb) => {
          try {
            cb(data);
          } catch (e) {
            console.error(`Event handler error for "${event}":`, e);
          }
        });
      }
    },
  };

  // SIMULAÇÃO: Eventos aleatórios do "Backend" (Descomente para testar Toasts)
  // setInterval(() => {
  //     if (Math.random() > 0.85) {
  //         Events.emit('notification', { title: 'Sistema', msg: 'Sync automático concluído.', type: 'success' });
  //     }
  // }, 8000);

  // ==========================================
  // 🔐 AUTH (Identidade & Sessão)
  // Persistência via LocalStorage para conveniência no dev
  // ==========================================
  const STORAGE_KEY = "panda_mock_user";
  let _currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;

  // Emite estado inicial se já logado (para listeners registrados depois)
  if (_currentUser) {
    setTimeout(() => Events.emit("auth:change", _currentUser), 100);
  }

  const Auth = {
    /**
     * Simula login. Use password='erro' para testar falha.
     */
    login: async (email, password) => {
      log("AUTH", `Attempting login for ${email}...`);
      await fakeDelay(1000);

      if (password === "erro") {
        throw new Error("Credenciais inválidas. Tente novamente.");
      }

      // Simula diferentes roles para testar UI
      const isAdmin = email.includes("admin");

      _currentUser = {
        uid: "user_" + Date.now(),
        name: isAdmin ? "Administrador" : "Usuário Comum",
        email: email,
        role: isAdmin ? "ADMIN" : "VIEWER",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        tenant_id: "tenant_001",
        quota: { tokens: 100000, used: 15000 },
      };

      // Persiste no LocalStorage para sobreviver ao F5
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_currentUser));

      Events.emit("auth:change", _currentUser);
      log("AUTH", `Login successful`, _currentUser);
      return _currentUser;
    },

    logout: async () => {
      log("AUTH", "Logging out...");
      await fakeDelay(500);
      _currentUser = null;
      localStorage.removeItem(STORAGE_KEY); // Limpa persistência
      Events.emit("auth:change", null);
      return true;
    },

    getUser: () => _currentUser,

    isAdmin: () => _currentUser?.role === "ADMIN",

    isLoggedIn: () => _currentUser !== null,
  };

  // ==========================================
  // 💾 DATA (Banco Estruturado - Sheets/JSON)
  // ==========================================
  const _mockDB = {
    clients: [
      { id: 1, name: "Empresa Alpha", status: "Ativo" },
      { id: 2, name: "Loja Beta", status: "Inativo" },
    ],
    products: [{ id: 1, name: "Produto X", price: 99.9 }],
  };

  const Data = {
    get: async (collection, id) => {
      log("DATA", `GET ${collection}/${id}`);
      await fakeDelay();
      const item = _mockDB[collection]?.find((i) => i.id === id);
      return item || null;
    },

    list: async (collection, filter = {}) => {
      log("DATA", `LIST ${collection}`, filter);
      await fakeDelay();
      return _mockDB[collection] || [];
    },

    save: async (collection, data) => {
      log("DATA", `SAVE to ${collection}`, data);
      await fakeDelay();
      if (!_mockDB[collection]) _mockDB[collection] = [];
      const newItem = { id: Date.now(), ...data };
      _mockDB[collection].push(newItem);
      Events.emit("data:change", { collection, action: "save", item: newItem });
      return newItem;
    },

    delete: async (collection, id) => {
      log("DATA", `DELETE ${collection}/${id}`);
      await fakeDelay();
      if (_mockDB[collection]) {
        _mockDB[collection] = _mockDB[collection].filter((i) => i.id !== id);
        Events.emit("data:change", { collection, action: "delete", id });
      }
      return true;
    },
  };

  // ==========================================
  // 📂 STORAGE (Arquivos/Drive/FS)
  // ==========================================
  const Storage = {
    upload: async (file, onProgress) => {
      log("STORAGE", `Uploading ${file.name || "file"}...`);

      // Simula progresso de upload
      for (let percent = 0; percent <= 100; percent += 20) {
        await fakeDelay(200);
        if (onProgress) onProgress(percent);
        Events.emit("storage:progress", { file: file.name, percent });
      }

      const result = {
        url: `https://drive.panda.dev/files/${Date.now()}_${file.name || "upload"}`,
        size: file.size || 1024,
        type: file.type || "application/octet-stream",
      };

      log("STORAGE", "Upload complete", result);
      return result;
    },

    download: async (url) => {
      log("STORAGE", `Downloading ${url}...`);
      await fakeDelay(1500);
      return new Blob(["Mock file content"], { type: "text/plain" });
    },

    delete: async (url) => {
      log("STORAGE", `Deleting ${url}...`);
      await fakeDelay();
      return true;
    },
  };

  // ==========================================
  // 💰 WALLET (Economia/Tokens)
  // ⚠️ SEGURANÇA: charge/credit são INTERNOS, não expostos publicamente
  // ==========================================
  let _walletBalance = 1000;
  let _walletHistory = [];

  // 🔒 MÉTODOS INTERNOS (usados pelo SDK, não pelo dev)
  const _WalletInternal = {
    charge: async (amount, reason) => {
      log("WALLET", `[INTERNAL] Charging ${amount} PC for: ${reason}`);
      await fakeDelay(200);
      if (_walletBalance < amount) throw new Error("Saldo insuficiente");
      _walletBalance -= amount;
      _walletHistory.push({
        type: "DEBIT",
        amount,
        reason,
        timestamp: Date.now(),
      });
      Events.emit("wallet:change", {
        balance: _walletBalance,
        charged: amount,
      });
      return { success: true, newBalance: _walletBalance };
    },

    credit: async (amount, reason) => {
      log("WALLET", `[INTERNAL] Crediting ${amount} PC for: ${reason}`);
      await fakeDelay(200);
      _walletBalance += amount;
      _walletHistory.push({
        type: "CREDIT",
        amount,
        reason,
        timestamp: Date.now(),
      });
      Events.emit("wallet:change", {
        balance: _walletBalance,
        credited: amount,
      });
      return { success: true, newBalance: _walletBalance };
    },
  };

  // ✅ MÉTODOS PÚBLICOS (read-only para a UI)
  const Wallet = {
    /**
     * Retorna o saldo atual do usuário.
     */
    getBalance: async () => {
      log("WALLET", "Fetching balance...");
      await fakeDelay(500);
      return { coins: _walletBalance, currency: "PC" };
    },

    /**
     * Retorna histórico de transações (últimas 50).
     */
    getHistory: async () => {
      log("WALLET", "Fetching history...");
      await fakeDelay(300);
      return _walletHistory.slice(-50);
    },

    /**
     * @deprecated Use Panda.Brain.chat() ou Panda.GPU.process() que cobram automaticamente.
     * Método exposto APENAS para debug no Mock. Em produção, não existe.
     */
    _mockCharge: async (amount, reason) => {
      console.warn(
        "⚠️ Wallet._mockCharge é apenas para DEBUG. Não use em produção!",
      );
      return _WalletInternal.charge(amount, reason);
    },
  };

  // ==========================================
  // 🧠 BRAIN (IA/Chat)
  // ==========================================
  const Brain = {
    chat: async (message, options = {}) => {
      log("BRAIN", `Chat: "${message.substring(0, 50)}..."`);
      await fakeDelay(1500);

      // Mock de resposta inteligente
      const responses = [
        `Analisando sua pergunta sobre "${message.split(" ").slice(0, 3).join(" ")}..."`,
        `Com base nos dados disponíveis, sugiro verificar o módulo correspondente.`,
        `Posso ajudar com mais detalhes. O que gostaria de saber especificamente?`,
      ];

      return {
        response: responses[randomBetween(0, responses.length - 1)],
        model: options.model || "gemini-flash",
        tokens: { input: message.length, output: 150 },
      };
    },

    analyze: async (data) => {
      log("BRAIN", "Analyzing data...", data);
      await fakeDelay(2000);
      return {
        sentiment: "positive",
        confidence: 0.85,
        summary: "Dados parecem consistentes.",
      };
    },
  };

  // ==========================================
  // ⚡ GPU (Processamento Local)
  // ==========================================
  const GPU = {
    isAvailable: async () => {
      log("GPU", "Checking availability...");
      await fakeDelay(300);
      return Config.agentConnected; // Depende do Rust Agent
    },

    process: async (model, input) => {
      log("GPU", `Processing with model "${model}"...`);
      if (!Config.agentConnected) {
        throw new Error(
          "GPU requer Panda Agent instalado. Modo Cloud será usado.",
        );
      }
      await fakeDelay(2000);
      return {
        result: "Mock GPU Result",
        device: "NVIDIA RTX 3080 (Mock)",
        elapsed_ms: 1847,
      };
    },
  };

  // ==========================================
  // 🦀 BRIDGE (Comunicação com Rust Agent)
  // ==========================================
  const Bridge = {
    /**
     * Executa uma tool MCP no Rust Agent local.
     * @param {string} tool - Nome da tool (fs_read, gpu_process, etc)
     * @param {object} params - Parâmetros da tool
     */
    execute: async (tool, params = {}) => {
      log("BRIDGE", `Executing tool "${tool}"`, params);

      if (!Config.agentConnected) {
        log("BRIDGE", "Agent OFFLINE - Simulating cloud fallback");
        await fakeDelay(1000);
        return {
          success: true,
          source: "cloud_fallback",
          data: { mock: true },
        };
      }

      await fakeDelay(800);

      // Mock de tools específicas
      const mockResponses = {
        fs_read: { content: "Mock file content from local filesystem." },
        fs_write: { success: true, path: params.path || "/mock/path.txt" },
        gpu_check: {
          available: true,
          device: "NVIDIA RTX 3080",
          memory: "10GB",
        },
        screen_capture: {
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        },
        notify: { sent: true },
      };

      return {
        success: true,
        source: "rust_agent",
        tool: tool,
        data: mockResponses[tool] || { mock: true, tool },
      };
    },

    /**
     * Verifica se o Agent está online.
     */
    isConnected: () => Config.agentConnected,

    /**
     * Simula conexão/desconexão do Agent (para testes).
     */
    _mockConnect: (connected) => {
      Config.agentConnected = connected;
      Events.emit("agent:status", { connected });
      log("BRIDGE", `Agent ${connected ? "CONNECTED" : "DISCONNECTED"}`);
    },
  };

  // ==========================================
  // 🏛️ GOVERNANCE (Constituição & Regras Hardcoded)
  // A Camada 1 - Imutável. Validação de ações.
  // ==========================================
  const _CONSTITUTION = {
    articles: [
      { id: 1, name: "Teto Inflação", rule: "Max 5% ao ano" },
      { id: 2, name: "Panda Labs", rule: "25% do Fundo → Educação" },
      { id: 3, name: "Reserva Ops", rule: "20% do Lucro Ops → Caixa" },
      { id: 4, name: "Crescimento", rule: "65% do Fundo → Ação" },
      { id: 5, name: "Piso Preço", rule: "2.5x (Min 1.25x)" },
      { id: 6, name: "Founder Fee", rule: "5% Bruto Eterno" },
      { id: 7, name: "Garantia Host", rule: "90% a 95% (Taxa P2P 5-10%)" },
      { id: 8, name: "Reserva Fundo", rule: "Max 10% (Excedente = Reinveste)" },
      {
        id: 9,
        name: "Bill of Rights",
        rule: "Free Speech, Non-Expulsion, Rust Law",
      },
      { id: 10, name: "Arbitragem", rule: "IA → Founder" },
      { id: 11, name: "Leis Pétreas", rule: "Imutável" },
      { id: 12, name: "Emergência", rule: "Failover Agent" },
    ],
    splits: {
      primary: { devHost: 55, fund: 22, ops: 15, founder: 5, gateway: 3 },
      p2pPreChain: { host: 95, fund: 1, ops: 4, founder: 0, gateway: 0 },
      p2pOnChain: { host: 95, fund: 1, ops: 1, founder: 0, gas: 3 },
    },
    fundAllocation: { labs: 25, growth: 65, reserve: 10 },
  };

  const Governance = {
    /**
     * Retorna a Constituição completa (12 Artigos).
     */
    getConstitution: () => {
      log("GOVERNANCE", "Fetching Constitution...");
      return { ..._CONSTITUTION };
    },

    /**
     * Retorna um Artigo específico.
     */
    getArticle: (id) => {
      log("GOVERNANCE", `Fetching Article ${id}...`);
      return _CONSTITUTION.articles.find((a) => a.id === id) || null;
    },

    /**
     * Retorna os Splits de Receita configurados.
     */
    getSplits: () => {
      log("GOVERNANCE", "Fetching Splits...");
      return { ..._CONSTITUTION.splits };
    },

    /**
     * Valida se uma ação é permitida pela Constituição.
     * @param {string} action - Tipo de ação (ex: 'set_inflation', 'expel_user')
     * @param {object} params - Parâmetros da ação
     * @returns {{ allowed: boolean, reason: string, article?: number }}
     */
    validate: async (action, params = {}) => {
      log("GOVERNANCE", `Validating action: ${action}`, params);
      await fakeDelay(200);

      // Regras de Validação Hardcoded (Mock)
      const rules = {
        set_inflation: (p) => {
          if (p.rate > 5)
            return {
              allowed: false,
              reason: "Viola Art 1: Teto 5%",
              article: 1,
            };
          return { allowed: true, reason: "Dentro do limite." };
        },
        expel_user: () => ({
          allowed: false,
          reason: "Viola Art 9.2: Non-Expulsion. Banimento impossível.",
          article: 9,
        }),
        change_founder_fee: () => ({
          allowed: false,
          reason: "Viola Art 11: Leis Pétreas. Constituição imutável.",
          article: 11,
        }),
        set_host_fee: (p) => {
          if (p.fee > 10)
            return {
              allowed: false,
              reason: "Viola Art 7: Taxa P2P máx 10%",
              article: 7,
            };
          if (p.fee < 5)
            return {
              allowed: false,
              reason: "Viola Art 7: Taxa P2P mín 5%",
              article: 7,
            };
          return { allowed: true, reason: "Taxa dentro do range 5-10%." };
        },
        allocate_fund: (p) => {
          const total = (p.labs || 0) + (p.growth || 0) + (p.reserve || 0);
          if (total !== 100)
            return {
              allowed: false,
              reason: "Alocação deve somar 100%.",
              article: 2,
            };
          if ((p.labs || 0) < 25)
            return {
              allowed: false,
              reason: "Viola Art 2: Labs mín 25%",
              article: 2,
            };
          if ((p.growth || 0) < 65)
            return {
              allowed: false,
              reason: "Viola Art 4: Growth mín 65%",
              article: 4,
            };
          return { allowed: true, reason: "Alocação válida." };
        },
      };

      if (rules[action]) {
        return rules[action](params);
      }

      // Default: Permitido se não há regra específica
      return { allowed: true, reason: "Ação não restrita pela Constituição." };
    },
  };

  // ==========================================
  // 💎 PAT (Panda AI Treasury - Banco Central)
  // Camada 3 - Política Monetária gerida pela IA
  // ==========================================
  const _treasuryState = {
    inflation: 1.5, // % a.a. atual
    reserve: 12, // % do Fundo em Reserva (acima de 10% = reinveste)
    deflation: 0.0, // % deflação (se > 2% = acelerar)
    totalBurned: 0, // Total de tokens queimados (PC)
    totalReinvested: 0, // Total reinvestido (PC)
  };

  const PAT = {
    /**
     * Retorna o status atual da economia.
     */
    getStatus: async () => {
      log("PAT", "Fetching Treasury Status...");
      await fakeDelay(300);
      return { ..._treasuryState };
    },

    /**
     * Simula execução de uma ferramenta do PAT.
     * @param {'reinvest' | 'accelerate' | 'vesting' | 'burn'} tool
     */
    execute: async (tool, params = {}) => {
      log("PAT", `Executing tool: ${tool}`, params);
      await fakeDelay(500);

      const actions = {
        reinvest: () => {
          if (_treasuryState.reserve > 10) {
            const excess = _treasuryState.reserve - 10;
            _treasuryState.reserve = 10;
            _treasuryState.totalReinvested += excess * 1000; // Mock: 1% = 1000 PC
            return {
              success: true,
              action: "Reinvestido",
              amount: excess * 1000,
            };
          }
          return { success: false, reason: "Reserva não excede 10%." };
        },
        accelerate: () => {
          if (_treasuryState.deflation > 2) {
            _treasuryState.deflation -= 1;
            return {
              success: true,
              action: "Grants aumentados",
              newDeflation: _treasuryState.deflation,
            };
          }
          return { success: false, reason: "Deflação não crítica." };
        },
        burn: () => {
          if (_treasuryState.inflation > 5) {
            const burned = (_treasuryState.inflation - 5) * 10000;
            _treasuryState.inflation = 4.5;
            _treasuryState.totalBurned += burned;
            return {
              success: true,
              action: "Tokens queimados",
              amount: burned,
            };
          }
          return { success: false, reason: "Inflação dentro do teto." };
        },
        vesting: () => {
          return { success: true, action: "Vesting aplicado", params };
        },
      };

      if (actions[tool]) {
        return actions[tool]();
      }
      return { success: false, reason: `Tool "${tool}" desconhecida.` };
    },

    /**
     * Simula alteração de estado para testes.
     */
    _mockSetState: (key, value) => {
      if (_treasuryState.hasOwnProperty(key)) {
        _treasuryState[key] = value;
        log("PAT", `[MOCK] ${key} set to ${value}`);
        Events.emit("pat:change", { ..._treasuryState });
      }
    },
  };

  // ==========================================
  // 🎨 UI (Helpers de Interface)
  // ==========================================
  const UI = {
    /**
     * Exibe um Toast/Notificação.
     */
    toast: (message, type = "info", duration = 3000) => {
      log("UI", `Toast [${type}]: ${message}`);
      Events.emit("ui:toast", { message, type, duration });

      // Fallback se nenhum listener estiver registrado
      if (!_listeners["ui:toast"]?.length) {
        console.log(
          `%c[TOAST ${type.toUpperCase()}] ${message}`,
          `background: ${type === "error" ? "#ff4444" : type === "success" ? "#00C851" : "#33b5e5"}; color: white; padding: 4px 8px; border-radius: 4px;`,
        );
      }
    },

    /**
     * Exibe um Modal e aguarda resposta do usuário.
     *
     * ⚠️ CONTRATO IMPORTANTE:
     * A UI que renderizar o modal DEVE chamar:
     *   Panda.emit('ui:modal:response', { confirmed: true/false, data: ... })
     * Caso contrário, a Promise nunca resolve (memory leak).
     *
     * @param {object} options - { title, message, type, buttons }
     * @returns {Promise<object>} Resultado do modal
     *
     * @example
     * const result = await Panda.UI.modal({ title: 'Confirmar', message: 'Deletar?' });
     * if (result.confirmed) { ... }
     */
    modal: (options) => {
      log("UI", "Opening modal", options);
      Events.emit("ui:modal", options);

      // Retorna Promise para aguardar resposta do modal
      return new Promise((resolve) => {
        const handler = (result) => {
          Events.off("ui:modal:response", handler);
          resolve(result);
        };
        Events.on("ui:modal:response", handler);

        // Timeout de segurança (30s) para evitar Promise pendente eterna
        setTimeout(() => {
          Events.off("ui:modal:response", handler);
          resolve({ confirmed: false, timeout: true });
        }, 30000);
      });
    },

    /**
     * Exibe indicador de Loading global.
     */
    loading: (show, message = "Carregando...") => {
      log("UI", `Loading ${show ? "ON" : "OFF"}: ${message}`);
      Events.emit("ui:loading", { show, message });
    },
  };

  // ==========================================
  // 🐼 OBJETO PÚBLICO PANDA
  // ==========================================
  const Panda = {
    // Módulos Principais
    Auth,
    Data,
    Storage,
    Wallet,
    Brain,
    GPU,
    Bridge,
    UI,

    // Módulos de Governança (Constituição)
    Governance,
    PAT,

    // Event Bus (Atalhos)
    on: Events.on,
    off: Events.off,
    emit: Events.emit,

    // Configuração
    Config,

    // Helpers
    version: () => Config.version,
    setMode: (mode) => {
      Config.mode = mode;
      log("CONFIG", `Mode set to ${mode}`);
    },
  };

  // Freeze para evitar modificações acidentais
  Object.freeze(Panda.Auth);
  Object.freeze(Panda.Data);
  Object.freeze(Panda.Storage);
  Object.freeze(Panda.Wallet);
  Object.freeze(Panda.Brain);
  Object.freeze(Panda.GPU);
  Object.freeze(Panda.Bridge);
  Object.freeze(Panda.UI);
  Object.freeze(Panda.Governance);
  Object.freeze(Panda.PAT);

  // Exporta para o window
  window.Panda = Panda;

  // Log de inicialização
  console.log(
    `%c🐼 Panda SDK v${Config.version} (Mock Mode) %c ${Config.mode} `,
    "background: linear-gradient(90deg, #6d5dfc, #00d4aa); color: white; padding: 8px 12px; border-radius: 4px 0 0 4px; font-weight: bold;",
    `background: ${Config.mode === "LOCAL" ? "#00C851" : "#33b5e5"}; color: white; padding: 8px 12px; border-radius: 0 4px 4px 0;`,
  );

  // Instruções para Dev
  if (Config.debug) {
    console.log("%c📖 Quick Reference:", "color: #888; font-weight: bold;");
    console.log(
      '  Panda.Auth.login("admin@test.com", "123") → Login como Admin',
    );
    console.log(
      '  Panda.Auth.login("user@test.com", "123")  → Login como Viewer',
    );
    console.log(
      '  Panda.Data.list("clients")                → Lista clientes mock',
    );
    console.log(
      "  Panda.Bridge._mockConnect(true)           → Simula Agent Online",
    );
    console.log(
      '  Panda.UI.toast("Teste!", "success")       → Toast de sucesso',
    );
  }
})(window);
