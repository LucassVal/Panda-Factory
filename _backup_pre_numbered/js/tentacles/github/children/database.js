/**
 * 🐼 GitHub Child - Database (JSON as DB)
 * ========================================
 * Usa JSON files no repo como banco de dados
 *
 * Features:
 * - CRUD completo via commits
 * - Collections = Pastas
 * - Documents = JSON files
 * - Versionado automaticamente (git history)
 * - Busca/Filtros client-side
 *
 * CUSTO: $0
 */

(function (window) {
  "use strict";

  const PARENT = "github";
  const CHILD_ID = "DB";
  const TM = window.TentacleMonitor;

  // ==========================================
  // 🔧 DATABASE API
  // ==========================================
  const GitHubDB = {
    id: CHILD_ID,
    name: "GitHub Database",
    icon: "🗄️",

    // Cache para evitar requests repetidos
    _cache: new Map(),
    _cacheTTL: 60000, // 1 minuto

    /**
     * Get document by ID
     * @param {string} collection - Collection name (folder)
     * @param {string} id - Document ID
     */
    async get(collection, id) {
      const path = this._getPath(collection, id);

      // Check cache
      const cached = this._getFromCache(path);
      if (cached) return cached;

      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      const result = await parent.getFile(path);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      try {
        const data = JSON.parse(result.content);
        this._setCache(path, data);
        return { success: true, data, id, _sha: result.sha };
      } catch (e) {
        return { success: false, error: "Invalid JSON" };
      }
    },

    /**
     * List all documents in collection
     * @param {string} collection - Collection name
     * @param {object} options - { where, orderBy, limit }
     */
    async list(collection, options = {}) {
      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      const dirPath = `data/${collection}`;
      const listing = await parent.listDir(dirPath);

      if (!listing.success) {
        return { success: false, error: listing.error, data: [] };
      }

      // Load all documents
      const documents = [];
      for (const file of listing.files) {
        if (file.type === "file" && file.name.endsWith(".json")) {
          const id = file.name.replace(".json", "");
          const doc = await this.get(collection, id);
          if (doc.success) {
            documents.push({ id, ...doc.data, _sha: doc._sha });
          }
        }
      }

      // Apply filters
      let filtered = documents;

      // Where clauses
      if (options.where) {
        for (const [field, operator, value] of options.where) {
          filtered = filtered.filter((doc) => {
            const docValue = doc[field];
            switch (operator) {
              case "==":
                return docValue === value;
              case "!=":
                return docValue !== value;
              case ">":
                return docValue > value;
              case ">=":
                return docValue >= value;
              case "<":
                return docValue < value;
              case "<=":
                return docValue <= value;
              case "contains":
                return docValue?.includes?.(value);
              case "in":
                return value?.includes?.(docValue);
              default:
                return true;
            }
          });
        }
      }

      // Order by
      if (options.orderBy) {
        const [field, direction = "asc"] = options.orderBy;
        filtered.sort((a, b) => {
          const aVal = a[field];
          const bVal = b[field];
          const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return direction === "desc" ? -cmp : cmp;
        });
      }

      // Limit
      if (options.limit) {
        filtered = filtered.slice(0, options.limit);
      }

      return { success: true, data: filtered, count: filtered.length };
    },

    /**
     * Save document (create or update)
     * @param {string} collection
     * @param {object} data - Must have 'id' field for update
     */
    async save(collection, data) {
      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      // Generate ID if not provided
      const id = data.id || this._generateId();
      const path = this._getPath(collection, id);

      // Add metadata
      const doc = {
        ...data,
        id,
        _updatedAt: new Date().toISOString(),
        _createdAt: data._createdAt || new Date().toISOString(),
      };

      const result = await parent.saveFile(
        path,
        JSON.stringify(doc, null, 2),
        `DB: Save ${collection}/${id}`,
      );

      if (result.success) {
        this._invalidateCache(path);
        _log(`Saved: ${collection}/${id}`);
        return { success: true, id, data: doc };
      }

      return { success: false, error: result.error };
    },

    /**
     * Delete document
     */
    async delete(collection, id) {
      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      const path = this._getPath(collection, id);
      const result = await parent.deleteFile(
        path,
        `DB: Delete ${collection}/${id}`,
      );

      if (result.success) {
        this._invalidateCache(path);
        _log(`Deleted: ${collection}/${id}`);
      }

      return result;
    },

    /**
     * Count documents in collection
     */
    async count(collection, where = null) {
      const result = await this.list(collection, { where });
      return result.success ? result.count : 0;
    },

    /**
     * Check if document exists
     */
    async exists(collection, id) {
      const result = await this.get(collection, id);
      return result.success;
    },

    /**
     * Batch save
     */
    async batchSave(collection, documents) {
      const results = [];
      for (const doc of documents) {
        const result = await this.save(collection, doc);
        results.push(result);
      }
      return results;
    },

    /**
     * Clear collection
     */
    async clearCollection(collection) {
      const list = await this.list(collection);
      if (!list.success) return list;

      for (const doc of list.data) {
        await this.delete(collection, doc.id);
      }

      return { success: true, deleted: list.count };
    },

    /**
     * Get all collections
     */
    async getCollections() {
      const parent = window.GitHubParent?.api || window.Panda?.GitHub;
      if (!parent) {
        return { success: false, error: "GitHub not initialized" };
      }

      const listing = await parent.listDir("data");
      if (!listing.success) {
        return { success: false, error: listing.error };
      }

      return {
        success: true,
        collections: listing.files
          .filter((f) => f.type === "dir")
          .map((f) => f.name),
      };
    },

    // ==========================================
    // PRIVATE METHODS
    // ==========================================

    _getPath(collection, id) {
      return `data/${collection}/${id}.json`;
    },

    _generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },

    _getFromCache(path) {
      const cached = this._cache.get(path);
      if (cached && Date.now() - cached.time < this._cacheTTL) {
        return { success: true, data: cached.data, fromCache: true };
      }
      return null;
    },

    _setCache(path, data) {
      this._cache.set(path, { data, time: Date.now() });
    },

    _invalidateCache(path) {
      this._cache.delete(path);
    },

    clearCache() {
      this._cache.clear();
      _log("Cache cleared");
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function _log(message) {
    console.log(`🗄️ [GitHub/DB] ${message}`);
    TM?.log?.("info", `${PARENT}:${CHILD_ID}`, message);
  }

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  const register = () => {
    if (window.GitHubParent) {
      window.GitHubParent.registerChild(CHILD_ID, GitHubDB);
      _log("✓ GitHub DB ready");
    } else {
      setTimeout(register, 100);
    }
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register);
  }

  // Expose for Panda.Data compatibility
  window.Panda = window.Panda || {};
  window.Panda.GitHub = window.Panda.GitHub || {};
  window.Panda.GitHub.DB = GitHubDB;

  // Also alias as Panda.Data for beta mode
  window.Panda.Data = GitHubDB;

  window.GitHubDB = GitHubDB;
})(window);
