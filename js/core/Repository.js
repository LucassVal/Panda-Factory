/**
 * REPOSITORY PATTERN - CORE MIGRATION v1.0
 *
 * Responsabilidade: Abstrair a camada de dados (IndexedDB)
 * Garante:
 * 1. Performance (IndexedDB assíncrono)
 * 2. Segurança (Ghost Columns automáticas)
 * 3. Escalabilidade (Idempotência e preparação p/ Backend)
 */

class Repository {
  constructor() {
    this.dbName = "TitanGestaoDB";
    this.dbVersion = 1;
    this.db = null;
    this.STORE_ID_PADRAO = "1"; // Single-tenant por enquanto

    // BACKEND CONFIG
    this.API_URL =
      "https://script.google.com/macros/s/AKfycbxPx18ed1gP8cR08dRxEInmVheihSoSkqiucXp2icFmF5dZO_ccM6c3Q6LMvjeE2VcM/exec";
    this.lastSync = localStorage.getItem("crm_last_sync") || 0;
    this.isSyncing = false;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.error);
        reject("Erro ao abrir banco de dados");
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Store: Clientes
        if (!db.objectStoreNames.contains("clientes")) {
          const store = db.createObjectStore("clientes", { keyPath: "id" });
          store.createIndex("nome", "nome", { unique: false });
          store.createIndex("status", "status", { unique: false });
          store.createIndex("_id_loja", "_id_loja", { unique: false });
        }

        // Store: Vendas (PDV)
        if (!db.objectStoreNames.contains("vendas")) {
          const store = db.createObjectStore("vendas", { keyPath: "id" });
          store.createIndex("data", "data", { unique: false });
          store.createIndex("_id_loja", "_id_loja", { unique: false });
        }

        // Store: Produtos (Estoque)
        if (!db.objectStoreNames.contains("produtos")) {
          const store = db.createObjectStore("produtos", { keyPath: "id" });
          store.createIndex("nome", "nome", { unique: false });
          store.createIndex("_id_loja", "_id_loja", { unique: false });
        }

        // Store: Logs (Imutáveis) - SYS_LOGS
        if (!db.objectStoreNames.contains("sys_logs")) {
          const store = db.createObjectStore("sys_logs", {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log("✅ Repository (IndexedDB) inicializado com sucesso!");

        // Iniciar Processos de Fundo
        this.startKeepAlive();
        this.startSyncLoop();

        resolve(this.db);
      };
    });
  }

  // --- SYNC ENGINE (BACKEND CONNECT) ---

  startKeepAlive() {
    // Ping a cada 2 min para manter Apps Script acordado
    setInterval(
      () => {
        fetch(`${this.API_URL}?action=ping`, { mode: "no-cors" }).catch(
          () => {},
        );
      },
      2 * 60 * 1000,
    );
  }

  startSyncLoop() {
    // Tenta sincronizar a cada 10 segundos se houver internet
    setInterval(() => {
      if (navigator.onLine && !this.isSyncing) {
        this.sync();
      }
    }, 10000); // 10s
  }

  async sync() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    console.log("🔄 Iniciando Sincronização...");

    try {
      // 1. PUSH: Enviar mudanças locais (queue)
      // Na v1.0 simples, vamos enviar tudo que foi alterado recentemente ou usar flag _dirty
      // Para simplificar "Cirurgia Cardíaca", vamos focar no PULL (backup) primeiro?
      // Não, o CODEX exige sync real.
      // Vamos implementar um flag simples: _dirty = true

      const unsyncedItems = await this.getUnsyncedItems("clientes");
      if (unsyncedItems.length > 0) {
        await this.pushChanges(unsyncedItems, "clientes");
      }

      // 2. PULL: Baixar novidades da nuvem
      await this.pullChanges();

      this.lastSync = Date.now();
      localStorage.setItem("crm_last_sync", this.lastSync);
      console.log("✅ Sincronização concluída.");
    } catch (e) {
      console.error("Erro na sync:", e);
    } finally {
      this.isSyncing = false;
    }
  }

  async getUnsyncedItems(storeName) {
    // Pega itens editados depois da última sync ou marcados como sujos
    // v1.0 Simplificada: Pega tudo com _updated_at > lastSync
    // Mas e se falhou o envio anterior? Melhor ter flag _synced_at

    return new Promise((resolve) => {
      const transaction = this.db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => {
        const all = request.result;
        const pending = all.filter((i) => {
          return (
            !i._synced_at || new Date(i._updated_at) > new Date(i._synced_at)
          );
        });
        resolve(pending);
      };
    });
  }

  async pushChanges(items, table) {
    console.log(`⬆️ Enviando ${items.length} itens de ${table}...`);

    const payload = {
      action: "SYNC_PUSH",
      storeId: this.STORE_ID_PADRAO,
      changes: items.map((i) => ({ table: table, data: i })),
    };

    const res = await fetch(this.API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (json.status === "success") {
      // Marcar como syncados localmente
      const tx = this.db.transaction([table], "readwrite");
      const store = tx.objectStore(table);
      items.forEach((item) => {
        item._synced_at = new Date().toISOString();
        store.put(item);
      });
    }
  }

  async pullChanges() {
    // Implementação Pull (Backup Nuvem -> Local)
    // v1.0: Traz tudo se lastSync == 0
    // TODO: Implementar PULL detalhado no futuro
  }

  // --- GENERIC METHODS ---

  async getAll(storeName, filterStoreId = true) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        let results = request.result;
        // Filtro Multi-Loja (Lógico)
        if (filterStoreId) {
          results = results.filter(
            (item) => item._id_loja === this.STORE_ID_PADRAO,
          );
        }
        // Filtro Soft Delete (padrão)
        results = results.filter((item) => item._ativo !== false);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async save(storeName, item) {
    return new Promise((resolve, reject) => {
      // 🛡️ REGRAS DE OURO (GHOST COLUMNS)
      item._id_loja = item._id_loja || this.STORE_ID_PADRAO;
      item._updated_at = new Date().toISOString();
      if (!item._created_at) item._created_at = new Date().toISOString();
      if (item._ativo === undefined) item._ativo = true;

      // Metadados Fiscais (Futuro)
      if (!item._metadata_fiscal) item._metadata_fiscal = {};

      const transaction = this.db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(item); // PUT = Insert ou Update

      request.onsuccess = () => {
        // Log de Auditoria (Sombra)
        this._logAudit("SAVE", storeName, item.id);
        resolve(item);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async softDelete(storeName, id) {
    return new Promise(async (resolve, reject) => {
      try {
        // 1. Buscar item atual
        const item = await this.getById(storeName, id);
        if (!item) return resolve(false);

        // 2. Marcar como inativo (NUNCA DELETAR)
        item._ativo = false;
        item._deleted_at = new Date().toISOString();

        // 3. Salvar
        await this.save(storeName, item);

        // 4. Log
        this._logAudit("SOFT_DELETE", storeName, id);

        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }

  async getById(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // --- INTERNAL HELPERS ---

  _logAudit(action, table, recordId) {
    // Log "fire and forget" - não bloqueia UI
    const log = {
      action: action,
      table: table,
      recordId: recordId,
      timestamp: new Date().toISOString(),
      _id_loja: this.STORE_ID_PADRAO,
    };

    const transaction = this.db.transaction(["sys_logs"], "readwrite");
    transaction.objectStore("sys_logs").add(log);
  }
}

// Singleton Global
window.Repo = new Repository();
