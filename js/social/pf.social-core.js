/**
 * 🐼 PANDA SOCIAL CORE - Engine Base
 * ===================================
 * Sistema modular de Social Media Hub
 *
 * @version 1.0.0
 * @marketplace TRUE - Vendido na loja Panda
 *
 * PLUGINS DISPONÍVEIS (compra separada):
 * - pf.social-youtube.js
 * - pf.social-tiktok.js
 * - pf.social-meta.js
 * - pf.social-twitter.js
 * - pf.social-whatsapp.js
 */

(function (window) {
  "use strict";

  // ============================================================================
  // PLUGIN REGISTRY
  // ============================================================================

  const PLUGIN_CATALOG = {
    "social-youtube": {
      id: "social-youtube",
      name: "YouTube Hub",
      icon: "📺",
      price: 4999, // 49.99 BRL em centavos ou PC
      description: "SEO, Thumbnails, Legendas, Scripts",
      features: ["seo", "thumbnails", "captions", "scripts", "analytics"],
    },
    "social-tiktok": {
      id: "social-tiktok",
      name: "TikTok Hub",
      icon: "🎵",
      price: 3999,
      description: "Trends, Hashtags, Captions, Sounds",
      features: ["trends", "hashtags", "captions", "sounds"],
    },
    "social-meta": {
      id: "social-meta",
      name: "Meta Hub (FB + IG)",
      icon: "📱",
      price: 4999,
      description: "Posts, Stories, Reels, Carousel",
      features: ["posts", "stories", "reels", "carousel", "ads"],
    },
    "social-twitter": {
      id: "social-twitter",
      name: "Twitter/X Hub",
      icon: "🐦",
      price: 2999,
      description: "Threads, Viral Hooks, Spaces",
      features: ["threads", "hooks", "spaces", "replies"],
    },
    "social-whatsapp": {
      id: "social-whatsapp",
      name: "WhatsApp Grey",
      icon: "💬",
      price: 5999,
      description: "Broadcast, Auto-Responder, CRM",
      features: ["broadcast", "autoresponder", "crm", "leads"],
    },
  };

  // ============================================================================
  // INSTALLED PLUGINS
  // ============================================================================

  const _installedPlugins = {};
  const _pluginHandlers = {};

  // ============================================================================
  // SOCIAL CORE
  // ============================================================================

  const SocialCore = {
    version: "1.0.0",

    // ==========================================
    // PLUGIN MANAGEMENT
    // ==========================================

    /**
     * Lista plugins disponíveis na loja
     */
    getCatalog() {
      return Object.values(PLUGIN_CATALOG);
    },

    /**
     * Verifica se plugin está instalado
     */
    isInstalled(pluginId) {
      return !!_installedPlugins[pluginId];
    },

    /**
     * Instala plugin (após compra na loja)
     */
    async install(pluginId) {
      const plugin = PLUGIN_CATALOG[pluginId];
      if (!plugin) {
        throw new Error(`Plugin não encontrado: ${pluginId}`);
      }

      // Verificar se já está instalado
      if (_installedPlugins[pluginId]) {
        console.log(`[Social] ${plugin.name} já instalado`);
        return true;
      }

      // Carregar script do plugin
      try {
        await this._loadScript(`js/social/pf.${pluginId}.js`);
        _installedPlugins[pluginId] = {
          ...plugin,
          installedAt: new Date().toISOString(),
        };

        console.log(`[Social] ✅ ${plugin.name} instalado com sucesso`);
        window.Panda?.Events?.emit("social:plugin:installed", plugin);
        return true;
      } catch (e) {
        console.error(`[Social] ❌ Erro ao instalar ${plugin.name}:`, e);
        throw e;
      }
    },

    /**
     * Remove plugin
     */
    uninstall(pluginId) {
      if (_installedPlugins[pluginId]) {
        delete _installedPlugins[pluginId];
        delete _pluginHandlers[pluginId];
        window.Panda?.Events?.emit("social:plugin:uninstalled", {
          id: pluginId,
        });
        return true;
      }
      return false;
    },

    /**
     * Lista plugins instalados
     */
    getInstalled() {
      return Object.values(_installedPlugins);
    },

    /**
     * Registra handler de plugin (chamado pelo plugin ao carregar)
     */
    registerPlugin(pluginId, handler) {
      _pluginHandlers[pluginId] = handler;
      console.log(`[Social] Plugin registrado: ${pluginId}`);
    },

    /**
     * Obtém handler de plugin
     */
    getPlugin(pluginId) {
      return _pluginHandlers[pluginId];
    },

    // ==========================================
    // SHARED FEATURES (FREE)
    // ==========================================

    /**
     * Caption Generator - Funciona com qualquer plugin
     * @param {string} platform - youtube, tiktok, meta, twitter
     * @param {string} topic - Assunto do post
     * @param {string} tone - Casual, profissional, humorado
     * @returns {Promise<string>}
     */
    async generateCaption(platform, topic, tone = "casual") {
      const cost = 5; // 5 PC

      // Debitar wallet
      const wallet = await window.Panda?.Wallet?.charge(cost, "SOCIAL_CAPTION");
      if (!wallet?.success) {
        throw new Error("Saldo insuficiente");
      }

      // Chamar Brain com Gem adequado
      const prompt = `Crie uma caption para ${platform} sobre: ${topic}
Tom: ${tone}
Formato: Texto pronto para postar, com emojis e hashtags relevantes.`;

      const response = await window.Panda?.Brain?.chat(prompt, {
        gem: "writer",
      });
      return response?.text || response;
    },

    /**
     * Hashtag Generator - Universal
     */
    async generateHashtags(platform, topic, count = 10) {
      const cost = 3;
      await window.Panda?.Wallet?.charge(cost, "SOCIAL_HASHTAGS");

      const prompt = `Gere ${count} hashtags para ${platform} sobre: ${topic}
Formato: Lista de hashtags, incluindo mix de populares e nicho.`;

      const response = await window.Panda?.Brain?.chat(prompt);
      return (
        response?.text?.split(/\s+/).filter((h) => h.startsWith("#")) || []
      );
    },

    /**
     * Best Time to Post - Analytics
     */
    async getBestTime(platform, timezone = "America/Sao_Paulo") {
      // Dados baseados em estudos de mercado
      const bestTimes = {
        youtube: { weekday: "14:00-16:00", weekend: "10:00-12:00" },
        tiktok: { weekday: "19:00-21:00", weekend: "11:00-13:00" },
        instagram: { weekday: "11:00-13:00", weekend: "10:00-11:00" },
        twitter: { weekday: "09:00-11:00", weekend: "09:00-10:00" },
        facebook: { weekday: "13:00-16:00", weekend: "12:00-13:00" },
      };
      return bestTimes[platform] || bestTimes.instagram;
    },

    // ==========================================
    // CRM (Built-in)
    // ==========================================

    CRM: {
      _contacts: [],
      _leads: [],

      async addContact(contact) {
        contact.id = contact.id || `contact_${Date.now()}`;
        contact.createdAt = new Date().toISOString();
        this._contacts.push(contact);
        await this._sync();
        return contact;
      },

      async addLead(lead) {
        lead.id = lead.id || `lead_${Date.now()}`;
        lead.createdAt = new Date().toISOString();
        lead.status = lead.status || "new";
        this._leads.push(lead);
        await this._sync();
        return lead;
      },

      getContacts(filter = {}) {
        return this._contacts.filter((c) => {
          if (filter.platform && c.platform !== filter.platform) return false;
          if (filter.tag && !c.tags?.includes(filter.tag)) return false;
          return true;
        });
      },

      getLeads(status = null) {
        return status
          ? this._leads.filter((l) => l.status === status)
          : this._leads;
      },

      async _sync() {
        // Sync com storage
        await window.Panda?.Storage?.set("social_crm_contacts", this._contacts);
        await window.Panda?.Storage?.set("social_crm_leads", this._leads);
      },

      async load() {
        this._contacts =
          (await window.Panda?.Storage?.get("social_crm_contacts")) || [];
        this._leads =
          (await window.Panda?.Storage?.get("social_crm_leads")) || [];
      },
    },

    // ==========================================
    // AGENDA (Built-in)
    // ==========================================

    Agenda: {
      _scheduled: [],

      async schedule(post) {
        post.id = post.id || `post_${Date.now()}`;
        post.status = "scheduled";
        this._scheduled.push(post);
        await this._sync();
        return post;
      },

      getScheduled(platform = null) {
        return platform
          ? this._scheduled.filter((p) => p.platform === platform)
          : this._scheduled;
      },

      async cancel(postId) {
        this._scheduled = this._scheduled.filter((p) => p.id !== postId);
        await this._sync();
      },

      async _sync() {
        await window.Panda?.Storage?.set("social_agenda", this._scheduled);
      },

      async load() {
        this._scheduled =
          (await window.Panda?.Storage?.get("social_agenda")) || [];
      },
    },

    // ==========================================
    // HELPERS
    // ==========================================

    async _loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load: ${src}`));
        document.head.appendChild(script);
      });
    },

    // ==========================================
    // INIT
    // ==========================================

    async init() {
      console.log("[Social] 🐼 Panda Social Core initializing...");

      // Carregar dados salvos
      await this.CRM.load();
      await this.Agenda.load();

      // Verificar plugins instalados no storage
      const installed =
        (await window.Panda?.Storage?.get("social_installed_plugins")) || [];
      for (const pluginId of installed) {
        try {
          await this.install(pluginId);
        } catch (e) {
          console.warn(`[Social] Plugin ${pluginId} não pôde ser carregado`);
        }
      }

      console.log("[Social] ✅ Core inicializado");
      window.Panda?.Events?.emit("social:ready");
    },
  };

  // ============================================================================
  // EXPOSE TO WINDOW
  // ============================================================================

  window.Panda = window.Panda || {};
  window.Panda.Social = SocialCore;

  // Auto-init quando Panda estiver pronto
  if (window.Panda?.Events) {
    window.Panda.Events.on("sdk:ready", () => SocialCore.init());
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => SocialCore.init(), 1000);
    });
  }
})(window);
