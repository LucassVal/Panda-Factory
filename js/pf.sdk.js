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
    version: "0.5.0",
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
  // ==========================================
  let _walletBalance = 1000;

  const Wallet = {
    getBalance: async () => {
      log("WALLET", "Fetching balance...");
      await fakeDelay(500);
      return { coins: _walletBalance, currency: "PC" };
    },

    charge: async (amount, reason) => {
      log("WALLET", `Charging ${amount} PC for: ${reason}`);
      await fakeDelay();
      if (_walletBalance < amount) throw new Error("Saldo insuficiente");
      _walletBalance -= amount;
      Events.emit("wallet:change", {
        balance: _walletBalance,
        charged: amount,
      });
      return { success: true, newBalance: _walletBalance };
    },

    credit: async (amount, reason) => {
      log("WALLET", `Crediting ${amount} PC for: ${reason}`);
      await fakeDelay();
      _walletBalance += amount;
      Events.emit("wallet:change", {
        balance: _walletBalance,
        credited: amount,
      });
      return { success: true, newBalance: _walletBalance };
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
