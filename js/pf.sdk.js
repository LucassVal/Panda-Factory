/**
 * 🐼 Panda SDK v0.9.0 (Enterprise Mock)
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
    version: "0.9.0",
    debug: true,
    agentConnected: false, // Simula se Rust Agent está online
    mockDelay: { min: 300, max: 1200 },

    // 🔗 GAS BACKEND CONNECTION
    useMock: true, // false = real GAS API
    GAS_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
  };

  // ==========================================
  // 🔗 GAS API CALLER (Real Backend)
  // ==========================================
  const callGAS = async (action, payload = {}) => {
    if (Config.useMock) {
      log("GAS", `[MOCK] Would call: ${action}`, payload);
      await fakeDelay();
      return null; // Return null to indicate mock mode
    }

    try {
      const response = await fetch(Config.GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await response.json();
      log("GAS", `[REAL] ${action}`, data);
      return data;
    } catch (error) {
      console.error(`[GAS ERROR] ${action}:`, error);
      throw error;
    }
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

    /**
     * 🔐 3-LAYER ACCESS SYSTEM (Master Tools)
     * FOUNDER (1): Full access - PAT, Constitution
     * DEV (2): DevTools - Console, API, MCP
     * USER (3): Basic UI only
     */
    ROLES: Object.freeze({
      FOUNDER: 1,
      DEV: 2,
      USER: 3,
    }),

    /**
     * Get current user's role level (1-3)
     * @returns {number} 1=Founder, 2=Dev, 3=User
     */
    getRole: () => {
      if (!_currentUser) return 3; // Guest = User
      if (_currentUser.role === "FOUNDER") return 1;
      if (_currentUser.role === "ADMIN" || _currentUser.role === "DEV")
        return 2;
      return 3;
    },

    /**
     * Check if user can access a feature by minimum role
     * @param {number} minRole - Minimum role required (1, 2, or 3)
     * @returns {boolean}
     */
    canAccess: (minRole) => {
      const userRole = Auth.getRole();
      return userRole <= minRole;
    },

    /**
     * 🔐 Ed25519 Founder Authentication (PRONTO - NÃO ATIVO)
     * Assina um comando com a chave privada do Founder via Rust Agent.
     * @param {object} payload - O comando a ser assinado
     * @returns {Promise<{payload, signature, timestamp, signer}>}
     */
    signCommand: async (payload) => {
      log("AUTH", `[CRYPTO] Signing command...`, payload);

      // Verifica se Agent está conectado
      if (!Config.agentConnected) {
        console.warn(
          "⚠️ signCommand requer Rust Agent conectado. Retornando mock.",
        );
        await fakeDelay(200);
        return {
          payload,
          signature: "MOCK_SIGNATURE_" + Date.now().toString(16),
          timestamp: Date.now(),
          signer: "MOCK_FOUNDER",
          _mockWarning: "Agent offline - signature is not real",
        };
      }

      // Em produção: Delega ao Rust Agent para assinar com chave do OS Keychain
      await fakeDelay(500);
      return {
        payload,
        signature: "ed25519_" + Date.now().toString(16) + "_signed",
        timestamp: Date.now(),
        signer: "FOUNDER",
      };
    },

    /**
     * Verifica se o usuário atual é o Founder (requer signCommand).
     * @returns {boolean}
     */
    isFounder: () => _currentUser?.role === "FOUNDER",

    /**
     * 📋 Retorna permissões do plugin atual (v1 Alpha)
     * @returns {string[]} Array de permissões concedidas
     */
    getPermissions: () => {
      log("AUTH", "Getting plugin permissions...");
      // Mock: Retorna permissões padrão
      return ["auth.read", "wallet.read", "storage.read", "ui.window"];
    },
  };

  // ==========================================
  // 🔐 CRYPTO (Ed25519 - PRONTO, NÃO ATIVO)
  // Prepared for Ed25519 signature verification
  // ==========================================
  const Crypto = {
    /**
     * Chave pública do Founder (PLACEHOLDER)
     * Em produção: Substituir pelo hex real da public key.
     */
    FOUNDER_PUBLIC_KEY: "PLACEHOLDER_ED25519_PUBLIC_KEY_HEX_64_CHARS",

    /**
     * Verifica assinatura Ed25519 (MOCK).
     * Em produção: Usa TweetNaCl.js para verificação real.
     * @param {string} message - Mensagem original
     * @param {string} signature - Assinatura em hex
     * @returns {boolean}
     */
    verify: async (message, signature) => {
      log("CRYPTO", `[MOCK] Verifying signature...`);
      await fakeDelay(100);

      // Mock: Aceita qualquer assinatura que comece com "ed25519_"
      if (signature.startsWith("ed25519_") || signature.startsWith("MOCK_")) {
        log("CRYPTO", "✅ Signature VALID (mock mode)");
        return true;
      }

      log("CRYPTO", "❌ Signature INVALID");
      return false;
    },

    /**
     * Gera hash SHA-256 de um payload (para integridade).
     * @param {object} payload
     * @returns {string} Hash em hex
     */
    hash: async (payload) => {
      log("CRYPTO", "Hashing payload...");
      const message = JSON.stringify(payload);

      // Usa Web Crypto API se disponível
      if (window.crypto?.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      }

      // Fallback: Simple hash mock
      return "mock_hash_" + message.length.toString(16);
    },

    /**
     * Status do módulo crypto.
     */
    status: () => ({
      enabled: false, // NÃO ATIVO em produção
      version: "0.1.0",
      algorithm: "Ed25519",
      library: "TweetNaCl (pending)",
      founderKeySet: false,
    }),
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

    /**
     * 🔄 Força sincronização com a nuvem (v1 Alpha)
     * @returns {Promise<{synced: boolean, timestamp: number}>}
     */
    sync: async () => {
      log("STORAGE", "Forcing cloud sync...");
      await fakeDelay(1000);
      Events.emit("storage:sync", { status: "complete" });
      return { synced: true, timestamp: Date.now() };
    },

    /**
     * 📊 Retorna quota de armazenamento (v1 Alpha)
     * @returns {Promise<{used: number, available: number, total: number}>}
     */
    getQuota: async () => {
      log("STORAGE", "Getting storage quota...");
      await fakeDelay(300);
      return {
        used: 1024 * 1024 * 50, // 50MB
        available: 1024 * 1024 * 950, // 950MB
        total: 1024 * 1024 * 1000, // 1GB
        unit: "bytes",
      };
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

    /**
     * 💳 Solicita pagamento ao usuário (v1 Alpha)
     * Abre modal de autorização antes de debitar.
     * ⚡ INCLUI SPLIT AUTOMÁTICO (Art 7: 95% Host, 5% Platform)
     *
     * @param {number} amount - Quantidade de Panda Coins
     * @param {string} reason - Motivo do pagamento
     * @param {object} options - { sellerId, skipModal }
     * @returns {Promise<{success: boolean, txId?: string, split?: object}>}
     */
    requestPayment: async (amount, reason, options = {}) => {
      log("WALLET", `Request payment: ${amount} PC for "${reason}"`);

      // Skip modal for micropayments < 10 PC (opcional)
      const skipModal = options.skipModal && amount < 10;

      if (!skipModal) {
        // Abre modal de confirmação
        const result = await UI.modal({
          title: "💳 Confirmar Pagamento",
          message: `Autorizar débito de ${amount} PC?\n\nMotivo: ${reason}`,
          type: "confirm",
          buttons: ["Cancelar", "Pagar"],
        });

        if (!result.confirmed) {
          return { success: false, reason: "Pagamento cancelado pelo usuário" };
        }
      }

      // 💰 APLICA SPLIT AUTOMÁTICO (Art 7 da Constituição)
      // P2P Off-chain: 95% Host, 1% Fund, 4% Ops, 0% Founder
      const SPLIT = {
        host: 0.95, // 95% vai pro vendedor
        fund: 0.01, // 1% pro Panda Fund
        ops: 0.04, // 4% pra operações
        founder: 0.0, // 0% (já incluso em outras taxas)
      };

      const split = {
        total: amount,
        toHost: Math.floor(amount * SPLIT.host),
        toFund: Math.floor(amount * SPLIT.fund),
        toOps: Math.ceil(amount * SPLIT.ops), // ceil pra garantir 100%
        sellerId: options.sellerId || "unknown",
      };

      log(
        "WALLET",
        `[SPLIT] Total: ${amount} → Host: ${split.toHost}, Fund: ${split.toFund}, Ops: ${split.toOps}`,
      );

      // Processa pagamento
      try {
        await _WalletInternal.charge(amount, reason);

        const txId = "tx_" + Date.now().toString(16);

        // Emite evento de split para backend processar
        Events.emit("wallet:split", {
          txId,
          split,
          reason,
          timestamp: Date.now(),
        });

        return {
          success: true,
          txId,
          newBalance: _walletBalance,
          split, // Retorna breakdown do split
        };
      } catch (e) {
        return { success: false, reason: e.message };
      }
    },

    /**
     * ✅ Verifica se usuário pode pagar valor (v1 Alpha)
     * @param {number} amount - Quantidade a verificar
     * @returns {boolean}
     */
    checkBalance: (amount) => {
      log("WALLET", `Check balance for ${amount} PC`);
      return _walletBalance >= amount;
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

    /**
     * 🧩 Carrega módulo WebAssembly (v1 Alpha)
     * @param {string} wasmUrl - URL do arquivo .wasm
     * @returns {Promise<{instance: object, exports: object}>}
     */
    loadModule: async (wasmUrl) => {
      log("BRIDGE", `Loading Wasm module: ${wasmUrl}`);

      if (!Config.agentConnected) {
        // Mock mode
        await fakeDelay(500);
        return {
          instance: { mock: true },
          exports: {
            init: () => log("WASM", "[Mock] init() called"),
            process: (data) => ({ result: "mock", input: data }),
            cleanup: () => log("WASM", "[Mock] cleanup() called"),
          },
          _mockWarning: "Wasm not actually loaded - mock mode",
        };
      }

      // Real Wasm loading
      try {
        const response = await fetch(wasmUrl);
        const bytes = await response.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(bytes);
        log("BRIDGE", "Wasm module loaded", {
          exports: Object.keys(instance.exports),
        });
        return { instance, exports: instance.exports };
      } catch (error) {
        console.error("[BRIDGE] Wasm load failed:", error);
        throw error;
      }
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
      {
        id: 13,
        name: "Developer First",
        rule: "Desconto 10% (2.5x→2.25x) quando sustentável OU deflação>2%",
      },
      {
        id: 14,
        name: "Buyback Automático",
        rule: "PAT compra tokens quando inflação>5% (dual-mode: PIX/Solana)",
      },
    ],
    splits: {
      primary: { devHost: 55, fund: 22, ops: 15, founder: 5, gateway: 3 },
      p2pPreChain: { host: 95, fund: 1, ops: 4, founder: 0, gateway: 0 },
      p2pOnChain: { host: 95, fund: 1, ops: 1, founder: 0, gas: 3 },
    },
    fundAllocation: { labs: 25, growth: 65, reserve: 10 },

    // 🎫 LICENSE TIERS (§9.4 - Hardcoded)
    licenseTiers: {
      FOUNDER: {
        id: "FOUNDER_001",
        multiplier: 1.03, // Custo + 3% overhead
        maxLicenses: 1,
        split: { owner: 0.6, fund: 0.25, ops: 0.15 },
        microtx: 0.05, // 5% igual a todos
        verification: "ed25519",
        description: "Founder tier - minimal cost, custom split",
      },
      BETA_FOUNDER: {
        prefix: "BETA_",
        multiplier: 1.25, // 50% off do padrão (2.5x)
        maxLicenses: 100,
        discount: 0.5,
        lifetime: true,
        transferable: false,
        split: "standard", // Usa split padrão
        description: "100 early supporters - 50% off vitalício",
      },
      STANDARD: {
        multiplier: 2.5, // Padrão do mercado
        maxLicenses: Infinity,
        split: {
          dev: 0.55,
          fund: 0.22,
          ops: 0.15,
          founder: 0.05,
          gateway: 0.03,
        },
        description: "Standard tier - full price",
      },
    },
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

    // ==========================================
    // 🎫 LICENSE TIER MANAGEMENT (§9.4)
    // ==========================================

    /**
     * Lista de Beta Founders registrados (user IDs)
     * @private
     */
    _betaFounders: [],
    _betaFounderCount: 0,

    /**
     * Retorna o tier de licença de um usuário.
     * @param {string} userId - ID do usuário
     * @returns {'FOUNDER' | 'BETA_FOUNDER' | 'STANDARD'}
     */
    getLicenseTier: (userId) => {
      // Check Founder (via Ed25519 ou ID hardcoded)
      if (userId === "FOUNDER_001" || Auth.isFounder()) {
        return "FOUNDER";
      }

      // Check Beta Founder
      if (Governance._betaFounders.includes(userId)) {
        return "BETA_FOUNDER";
      }

      return "STANDARD";
    },

    /**
     * Calcula custo de tokens baseado no tier do usuário.
     * @param {number} baseCost - Custo base em PC
     * @param {string} userId - ID do usuário (opcional, usa current user se não fornecido)
     * @returns {{ cost: number, tier: string, multiplier: number, discount: number }}
     */
    calculateTokenCost: (baseCost, userId = null) => {
      const uid = userId || _currentUser?.uid || "anonymous";
      const tier = Governance.getLicenseTier(uid);
      const tierConfig = _CONSTITUTION.licenseTiers[tier];

      const multiplier = tierConfig.multiplier;
      const cost = Math.ceil(baseCost * multiplier);
      const standardCost = Math.ceil(baseCost * 2.5);
      const discount =
        standardCost > 0 ? Math.round((1 - cost / standardCost) * 100) : 0;

      log(
        "GOVERNANCE",
        `Token cost: ${baseCost} base → ${cost} PC (${tier}, ${multiplier}x, ${discount}% off)`,
      );

      return {
        cost,
        tier,
        multiplier,
        discount,
        baseCost,
        standardCost,
      };
    },

    /**
     * Registra um Beta Founder (máximo 100).
     * @param {string} userId - ID do usuário
     * @param {string} code - Código promocional (BETA_XXXXXX)
     * @returns {{ success: boolean, message: string, remaining?: number }}
     */
    registerBetaFounder: async (userId, code) => {
      log(
        "GOVERNANCE",
        `Registering Beta Founder: ${userId} with code ${code}`,
      );

      const maxLicenses = _CONSTITUTION.licenseTiers.BETA_FOUNDER.maxLicenses;

      // Validate code format
      if (!code || !code.startsWith("BETA_")) {
        return {
          success: false,
          message: "Código inválido. Use formato BETA_XXXXXX",
        };
      }

      // Check limit
      if (Governance._betaFounderCount >= maxLicenses) {
        return {
          success: false,
          message: `Limite de ${maxLicenses} licenças beta atingido.`,
        };
      }

      // Check if already registered
      if (Governance._betaFounders.includes(userId)) {
        return { success: false, message: "Usuário já é Beta Founder." };
      }

      // Register
      Governance._betaFounders.push(userId);
      Governance._betaFounderCount++;

      const remaining = maxLicenses - Governance._betaFounderCount;

      Events.emit("governance:beta_registered", { userId, remaining });

      return {
        success: true,
        message: `🌟 Bem-vindo, Beta Founder! Você tem 50% de desconto vitalício.`,
        tier: "BETA_FOUNDER",
        remaining,
      };
    },

    /**
     * Retorna quantas licenças beta ainda estão disponíveis.
     * @returns {{ total: number, used: number, available: number }}
     */
    getBetaLicenseStatus: () => {
      const total = _CONSTITUTION.licenseTiers.BETA_FOUNDER.maxLicenses;
      const used = Governance._betaFounderCount;
      return {
        total,
        used,
        available: total - used,
      };
    },

    /**
     * Retorna todos os tiers de licença configurados.
     */
    getLicenseTiers: () => {
      return { ..._CONSTITUTION.licenseTiers };
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

    /**
     * 🪟 Pop-out: Abre um elemento ou tool em janela separada (Picture-in-Picture)
     * Suporta múltiplos monitores.
     *
     * @param {string} toolId - ID da ferramenta (console, mcp, api, etc)
     * @param {object} options - { width, height, title }
     * @returns {Promise<Window>} - Referência à janela PiP
     *
     * @example
     * const win = await Panda.UI.popout('console', { width: 600, height: 400 });
     */
    popout: async (toolId, options = {}) => {
      log("UI", `Popout: ${toolId}`, options);

      // Delegate to PandaDevTools if available
      if (window.PandaDevTools?.popout) {
        return window.PandaDevTools.popout(toolId);
      }

      // Fallback: basic window.open
      const width = options.width || 600;
      const height = options.height || 500;
      const title = options.title || `🐼 ${toolId}`;

      const win = window.open(
        "",
        `panda_popout_${toolId}`,
        `width=${width},height=${height},menubar=no,toolbar=no`,
      );

      if (win) {
        win.document.title = title;
        win.document.body.innerHTML = `
          <div style="padding:20px; font-family: sans-serif;">
            <h2>${title}</h2>
            <p>Tool: ${toolId}</p>
            <p style="opacity:0.5">PandaDevTools não carregado. Carregue pf.devtools.js para funcionalidade completa.</p>
          </div>
        `;
      }

      Events.emit("ui:popout", { toolId, window: win });
      return win;
    },

    /**
     * 🪟 Retorna Map de janelas pop-out ativas
     * @returns {Map<string, Window>}
     */
    getPopouts: () => {
      if (window.PandaDevTools?.getActiveWindows) {
        return window.PandaDevTools.getActiveWindows();
      }
      return new Map();
    },

    /**
     * 🪟 Fecha uma janela pop-out
     * @param {string} toolId
     */
    closePopout: (toolId) => {
      log("UI", `Close popout: ${toolId}`);
      const popouts = window.PandaDevTools?.getActiveWindows?.();
      if (popouts?.has(toolId)) {
        popouts.get(toolId).close();
      }
    },

    /**
     * 📌 Registra item de menu (v1 Alpha - Hooks)
     * @param {'appdock' | 'contextmenu' | 'mainmenu'} location - Onde adicionar
     * @param {string} label - Texto do botão
     * @param {Function} action - Callback ao clicar
     * @param {object} options - { icon, order, pluginId }
     * @returns {string} menuItemId
     */
    registerMenu: (location, label, action, options = {}) => {
      const id = `menu_${location}_${Date.now()}`;
      log("UI", `Register menu: ${location} → "${label}"`, { id, options });

      // Armazena em registry global
      if (!window._pandaMenuRegistry) {
        window._pandaMenuRegistry = new Map();
      }

      window._pandaMenuRegistry.set(id, {
        location,
        label,
        action,
        icon: options.icon || "🔌",
        order: options.order || 999,
        pluginId: options.pluginId || "unknown",
      });

      Events.emit("ui:menu:register", { id, location, label });
      return id;
    },

    /**
     * 🗑️ Remove item de menu registrado
     * @param {string} menuItemId
     */
    unregisterMenu: (menuItemId) => {
      log("UI", `Unregister menu: ${menuItemId}`);
      window._pandaMenuRegistry?.delete(menuItemId);
      Events.emit("ui:menu:unregister", { id: menuItemId });
    },

    /**
     * 📋 Lista todos os menus registrados
     * @param {string} location - Filtrar por location
     * @returns {Array}
     */
    getMenuItems: (location) => {
      const items = [];
      window._pandaMenuRegistry?.forEach((item, id) => {
        if (!location || item.location === location) {
          items.push({ id, ...item });
        }
      });
      return items.sort((a, b) => a.order - b.order);
    },
  };

  // ==========================================
  // 🌍 POLYGLOT (Tradução Global - NLLB-200)
  // 200 idiomas via Rust Agent (offline)
  // ==========================================
  const _polyglotSettings = {
    enabled: false,
    preferredLang: "pt",
    scope: "all", // all | messages | ai | manual
  };

  const SUPPORTED_LANGUAGES = [
    "pt",
    "en",
    "es",
    "fr",
    "de",
    "it",
    "ja",
    "ko",
    "zh",
    "ar",
    "ru",
    "hi",
    "nl",
    "pl",
    "tr",
    "vi",
    "th",
    "id",
    "ms",
    "tl",
    "uk",
    "cs",
    "el",
    "he",
    "hu",
    "ro",
    "sv",
    "da",
    "no",
    "fi",
  ];

  const Polyglot = {
    /**
     * Traduz texto entre idiomas.
     * @param {string} text - Texto a traduzir
     * @param {string} from - Código do idioma origem (ex: 'en')
     * @param {string} to - Código do idioma destino (ex: 'pt')
     * @returns {Promise<string>}
     */
    translate: async (text, from, to) => {
      log(
        "POLYGLOT",
        `Translating: "${text.substring(0, 30)}..." (${from} → ${to})`,
      );

      if (!Config.agentConnected) {
        // Mock: retorna texto com prefixo do idioma
        await fakeDelay(500);
        return `[${to.toUpperCase()}] ${text}`;
      }

      // Em produção: chama Rust Agent com NLLB-200
      await fakeDelay(1000);
      return `[${to.toUpperCase()}] ${text} (translated via NLLB-200)`;
    },

    /**
     * Tradução em streaming (tempo real).
     * @param {AsyncIterable<string>} stream - Stream de texto
     * @param {string} to - Idioma destino
     * @returns {AsyncIterable<string>}
     */
    translateStream: async function* (stream, to) {
      log("POLYGLOT", `Stream translation to ${to}...`);
      for await (const chunk of stream) {
        await fakeDelay(100);
        yield `[${to.toUpperCase()}] ${chunk}`;
      }
    },

    /**
     * Detecta o idioma de um texto.
     * @param {string} text
     * @returns {Promise<{lang: string, confidence: number}>}
     */
    detectLanguage: async (text) => {
      log("POLYGLOT", `Detecting language: "${text.substring(0, 30)}..."`);
      await fakeDelay(300);

      // Mock: detecta baseado em caracteres comuns
      if (/[ãõçé]/.test(text)) return { lang: "pt", confidence: 0.95 };
      if (/[ñ¿¡]/.test(text)) return { lang: "es", confidence: 0.92 };
      if (/[àâêî]/.test(text)) return { lang: "fr", confidence: 0.88 };
      if (/[äöüß]/.test(text)) return { lang: "de", confidence: 0.9 };
      return { lang: "en", confidence: 0.85 };
    },

    /**
     * Retorna lista de idiomas suportados.
     * @returns {string[]}
     */
    getSupportedLanguages: () => {
      return [...SUPPORTED_LANGUAGES];
    },

    /**
     * Aplica tradução na UI (integra com pf.i18n.js).
     * @param {string} langCode
     */
    localizeUI: (langCode) => {
      log("POLYGLOT", `Localizing UI to: ${langCode}`);
      _polyglotSettings.preferredLang = langCode;
      localStorage.setItem("pandaTranslationLang", langCode);

      // Delega para i18n se disponível
      if (window.PandaI18n?.setLanguage) {
        window.PandaI18n.setLanguage(langCode);
      }

      Events.emit("polyglot:locale", { lang: langCode });
    },

    /**
     * 🎤 Transcreve áudio para texto (Whisper).
     * @param {Blob|File} audioBlob
     * @returns {Promise<string>}
     */
    transcribe: async (audioBlob) => {
      log("POLYGLOT", `Transcribing audio (${audioBlob.size} bytes)...`);

      if (!Config.agentConnected) {
        await fakeDelay(1500);
        return "[Mock transcription] Audio content would be transcribed here via Whisper.";
      }

      await fakeDelay(2000);
      return "[Whisper] Transcribed audio content from Rust Agent.";
    },

    /**
     * Obtém configurações atuais.
     */
    getSettings: () => ({ ..._polyglotSettings }),

    /**
     * Atualiza configurações.
     * @param {object} settings
     */
    setSettings: (settings) => {
      Object.assign(_polyglotSettings, settings);
      log("POLYGLOT", "Settings updated", _polyglotSettings);
    },

    /**
     * Status do módulo.
     */
    status: () => ({
      enabled: _polyglotSettings.enabled,
      model: "NLLB-200",
      modelSize: "600MB",
      whisper: "Whisper Base",
      whisperSize: "140MB",
      agentRequired: true,
      agentConnected: Config.agentConnected,
      languages: SUPPORTED_LANGUAGES.length,
    }),
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

    // Criptografia (Ed25519 - PRONTO, NÃO ATIVO)
    Crypto,

    // Tradução Global (NLLB-200 via Rust)
    Polyglot,

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
  Object.freeze(Panda.Crypto);
  Object.freeze(Panda.Polyglot);

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
