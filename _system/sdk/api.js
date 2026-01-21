/**
 * 🐼 PANDA SDK v1.0.0
 * Panda Fabrics Developer Kit
 *
 * Simplifica o desenvolvimento de apps no ecossistema Panda.
 * Uso: import Panda from './panda-sdk.js'
 */

const Panda = {
  version: "1.0.0",

  // ============================================
  // 📦 DATABASE MODULE
  // Abstração para IndexedDB/Google Sheets
  // ============================================
  Database: {
    _db: null,

    async init(dbName = "PandaDB") {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          this._db = request.result;
          resolve(this._db);
        };
        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains("data")) {
            db.createObjectStore("data", {
              keyPath: "id",
              autoIncrement: true,
            });
          }
        };
      });
    },

    async save(storeName, data) {
      if (!this._db) await this.init();
      return new Promise((resolve, reject) => {
        const tx = this._db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const request = store.put(data);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    },

    async find(storeName, query = {}) {
      if (!this._db) await this.init();
      return new Promise((resolve, reject) => {
        const tx = this._db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => {
          let results = request.result;
          // Filter by query
          Object.keys(query).forEach((key) => {
            results = results.filter((item) => item[key] === query[key]);
          });
          resolve(results);
        };
        request.onerror = () => reject(request.error);
      });
    },

    async delete(storeName, id) {
      if (!this._db) await this.init();
      return new Promise((resolve, reject) => {
        const tx = this._db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const request = store.delete(id);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    },
  },

  // ============================================
  // 🧠 AI MODULE
  // Integração com Gemini via Panda Brain
  // ============================================
  AI: {
    endpoint: null,

    configure(endpoint) {
      this.endpoint = endpoint;
    },

    async ask(prompt, context = null) {
      if (!this.endpoint) throw new Error("AI endpoint not configured");

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CHAT",
          prompt,
          context,
        }),
      });
      return response.json();
    },

    async analyze(data) {
      if (!this.endpoint) throw new Error("AI endpoint not configured");

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ANALYZE",
          data,
        }),
      });
      return response.json();
    },
  },

  // ============================================
  // 💰 WALLET MODULE
  // Gerenciamento de Panda Coins
  // ============================================
  Wallet: {
    _balance: 0,

    async getBalance() {
      // TODO: Integrate with Panda Core backend
      return this._balance;
    },

    async charge(amount, reason = "") {
      if (this._balance < amount) {
        throw new Error("Insufficient Panda Coins");
      }
      this._balance -= amount;
      console.log(`🐼 Charged ${amount} PC: ${reason}`);
      return this._balance;
    },

    async credit(amount, source = "") {
      this._balance += amount;
      console.log(`🐼 Credited ${amount} PC: ${source}`);
      return this._balance;
    },
  },

  // ============================================
  // 🎨 UI MODULE
  // Componentes visuais padrão
  // ============================================
  UI: {
    toast(message, type = "info", duration = 3000) {
      const colors = {
        success: "#10b981",
        error: "#ef4444",
        warning: "#f59e0b",
        info: "#3b82f6",
      };

      const toast = document.createElement("div");
      toast.innerHTML = message;
      toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-family: var(--font-sans, sans-serif);
        font-size: 14px;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), duration);
    },

    confirm(message) {
      return window.confirm(message);
    },

    prompt(message, defaultValue = "") {
      return window.prompt(message, defaultValue);
    },
  },

  // ============================================
  // 🔌 AGENT MODULE
  // Conexão com Panda Agent Local (WebSocket)
  // ============================================
  Agent: {
    socket: null,
    connected: false,
    callbacks: {},

    connect(port = 9999) {
      return new Promise((resolve, reject) => {
        try {
          this.socket = new WebSocket(`ws://localhost:${port}`);

          this.socket.onopen = () => {
            this.connected = true;
            console.log("🐼 Panda Agent connected!");
            resolve(true);
          };

          this.socket.onclose = () => {
            this.connected = false;
            console.log("🐼 Panda Agent disconnected");
          };

          this.socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.requestId && this.callbacks[data.requestId]) {
              this.callbacks[data.requestId](data);
              delete this.callbacks[data.requestId];
            }
          };

          this.socket.onerror = (e) => {
            console.error("🐼 Agent connection error:", e);
            reject(e);
          };
        } catch (e) {
          reject(e);
        }
      });
    },

    execute(action, params = {}) {
      return new Promise((resolve, reject) => {
        if (!this.connected) {
          reject(new Error("Agent not connected"));
          return;
        }

        const requestId = Date.now().toString();
        this.callbacks[requestId] = resolve;

        this.socket.send(
          JSON.stringify({
            requestId,
            action,
            ...params,
          }),
        );

        // Timeout after 30s
        setTimeout(() => {
          if (this.callbacks[requestId]) {
            delete this.callbacks[requestId];
            reject(new Error("Agent request timeout"));
          }
        }, 30000);
      });
    },

    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
        this.connected = false;
      }
    },
  },

  // ============================================
  // 🔧 UTILS
  // Funções utilitárias
  // ============================================
  Utils: {
    generateId() {
      return `panda_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    formatCurrency(value, currency = "BRL") {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency,
      }).format(value);
    },

    formatDate(date, format = "short") {
      const d = new Date(date);
      if (format === "short") {
        return d.toLocaleDateString("pt-BR");
      }
      return d.toLocaleString("pt-BR");
    },

    debounce(func, wait = 300) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
  },
};

// Export for ES6 modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = Panda;
}

// Global export for browser
if (typeof window !== "undefined") {
  window.Panda = Panda;
}

console.log("🐼 Panda SDK v1.0.0 loaded");
