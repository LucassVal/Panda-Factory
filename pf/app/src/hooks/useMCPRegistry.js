/**
 * 📡 useMCPRegistry.js — MCP Tool Discovery & Registry (ORCHESTRATOR)
 *
 * Dynamically loads MCP manifests from active Dock modules,
 * builds a tool registry, and injects available tools into AI context.
 *
 * Flow:
 *   1. Dock activates module → loadManifest(moduleId)
 *   2. Manifest parsed → tools[] extracted → Map updated
 *   3. AI context enriched with available tools
 *   4. Module deactivated → tools removed from registry
 *
 * NOTE: Manifests are loaded at runtime via fetch() from /manifests/
 * because 6.medusa/ sits outside Vite's project root (pf/app/).
 * During dev, manifests are resolved from localStorage cache or
 * the inline BUILTIN_TOOLS fallback (embedded at build time).
 *
 * @version 1.1.0
 * @see PF_MCP_REFERENCE.md §B.2
 */

import { useState, useCallback, useMemo } from "react";

// ── Inline tool definitions (extracted from 6.medusa/manifests/*) ──
// This avoids import() across Vite root boundary.
// When manifests are updated, regenerate this block or use runtime fetch.
const BUILTIN_TOOLS = {
  crm: {
    name: "Panda CRM",
    icon: "📱",
    tools: [
      {
        name: "crm_addContact",
        description: "Adiciona novo contato ao CRM",
        parameters: {
          name: "string (required)",
          email: "string",
          phone: "string",
          tags: "string[]",
        },
      },
      {
        name: "crm_updateContact",
        description: "Atualiza dados de um contato",
        parameters: { contactId: "string (required)", updates: "object" },
      },
      {
        name: "crm_moveContact",
        description: "Move contato para outro estágio do pipeline",
        parameters: {
          contactId: "string (required)",
          stage: "string (lead|prospect|client|inactive)",
        },
      },
      {
        name: "crm_deleteContact",
        description: "Remove contato do CRM",
        parameters: { contactId: "string (required)" },
      },
      {
        name: "crm_listContacts",
        description: "Lista contatos com filtros opcionais",
        parameters: { stage: "string (optional)", search: "string (optional)" },
      },
    ],
  },
  whatsapp: {
    name: "WhatsApp",
    icon: "💬",
    tools: [
      {
        name: "wa_sendMessage",
        description: "Envia mensagem via WhatsApp",
        parameters: {
          conversationId: "string (required)",
          message: "string (required)",
        },
      },
      {
        name: "wa_getConversations",
        description: "Lista conversas recentes",
        parameters: {},
      },
      {
        name: "wa_loadMessages",
        description: "Carrega mensagens de uma conversa",
        parameters: {
          conversationId: "string (required)",
          limit: "number (default: 50)",
        },
      },
      {
        name: "wa_toggleAutoReply",
        description: "Ativa/desativa resposta automática IA",
        parameters: { enabled: "boolean (required)" },
      },
    ],
  },
  instagram: {
    name: "Instagram DM",
    icon: "📷",
    tools: [
      {
        name: "ig_sendDM",
        description: "Envia DM no Instagram",
        parameters: {
          userId: "string (required)",
          message: "string (required)",
        },
      },
      {
        name: "ig_getInbox",
        description: "Lista inbox do Instagram",
        parameters: {},
      },
      {
        name: "ig_loadMessages",
        description: "Carrega mensagens de uma conversa",
        parameters: {
          conversationId: "string (required)",
          limit: "number (default: 50)",
        },
      },
      {
        name: "ig_toggleAutoReply",
        description: "Ativa/desativa resposta automática IA",
        parameters: { enabled: "boolean (required)" },
      },
    ],
  },
  "crm-tentacle": {
    name: "CRM Tentacle",
    icon: "🐙",
    tools: [
      {
        name: "tentacle_addContact",
        description: "Adiciona contato ao CRM Tentacle",
        parameters: {
          name: "string (required)",
          email: "string",
          phone: "string",
        },
      },
      {
        name: "tentacle_moveStage",
        description: "Move contato entre estágios do funil",
        parameters: {
          contactId: "string (required)",
          stage: "string (required)",
        },
      },
      {
        name: "tentacle_getContacts",
        description: "Lista contatos com filtros",
        parameters: {
          stage: "string (optional)",
          limit: "number (default: 50)",
        },
      },
      {
        name: "tentacle_deleteContact",
        description: "Remove contato",
        parameters: { contactId: "string (required)" },
      },
    ],
  },
  agenda: {
    name: "Panda Agenda",
    icon: "📅",
    tools: [
      {
        name: "agenda_createEvent",
        description: "Cria novo evento na agenda",
        parameters: {
          title: "string (required)",
          start: "ISO datetime (required)",
          end: "ISO datetime (required)",
          color: "string (hex)",
          status: "string (pending|confirmed|completed|cancelled)",
        },
      },
      {
        name: "agenda_updateEvent",
        description: "Atualiza evento existente",
        parameters: { eventId: "string (required)", updates: "object" },
      },
      {
        name: "agenda_deleteEvent",
        description: "Remove evento da agenda",
        parameters: { eventId: "string (required)" },
      },
      {
        name: "agenda_listEvents",
        description: "Lista eventos de um período",
        parameters: {
          startDate: "ISO date (optional)",
          endDate: "ISO date (optional)",
        },
      },
    ],
  },
  pdv: {
    name: "Panda PDV",
    icon: "🛒",
    tools: [
      {
        name: "pdv_addItem",
        description: "Adiciona item ao cardápio",
        parameters: {
          name: "string (required)",
          price: "number (required)",
          category: "string",
          description: "string",
        },
      },
      {
        name: "pdv_addToCart",
        description: "Adiciona item ao carrinho de venda",
        parameters: { itemId: "string (required)", qty: "number (default: 1)" },
      },
      {
        name: "pdv_checkout",
        description: "Finaliza venda do carrinho atual",
        parameters: { paymentMethod: "string (dinheiro|pix|cartao)" },
      },
      {
        name: "pdv_listMenu",
        description: "Lista todos os itens do cardápio",
        parameters: { category: "string (optional)" },
      },
    ],
  },
  estoque: {
    name: "Panda Estoque",
    icon: "📦",
    tools: [
      {
        name: "estoque_addItem",
        description: "Cadastra novo item no estoque",
        parameters: {
          name: "string (required)",
          sku: "string",
          unit: "string",
          minStock: "number",
          currentStock: "number",
        },
      },
      {
        name: "estoque_adjustStock",
        description: "Ajusta quantidade em estoque",
        parameters: {
          itemId: "string (required)",
          adjustment: "number (required)",
          reason: "string",
          type: "string (entrada|saida|ajuste)",
        },
      },
      {
        name: "estoque_listItems",
        description: "Lista itens do estoque",
        parameters: { lowStockOnly: "boolean (default: false)" },
      },
      {
        name: "estoque_getItem",
        description: "Busca detalhes de um item específico",
        parameters: { itemId: "string (required)" },
      },
    ],
  },
  "landing-pages": {
    name: "Landing Pages",
    icon: "🌐",
    tools: [
      {
        name: "landing_createPage",
        description: "Cria nova landing page a partir de template",
        parameters: {
          templateId: "string (saas|portfolio|product)",
          name: "string",
        },
      },
      {
        name: "landing_updateSection",
        description: "Atualiza seção de uma landing page",
        parameters: {
          pageId: "string (required)",
          sectionIndex: "number (required)",
          updates: "object",
        },
      },
      {
        name: "landing_exportHTML",
        description: "Exporta landing page como HTML puro",
        parameters: { pageId: "string (required)" },
      },
      {
        name: "landing_listPages",
        description: "Lista todas as landing pages salvas",
        parameters: {},
      },
      {
        name: "landing_deletePage",
        description: "Remove uma landing page",
        parameters: { pageId: "string (required)" },
      },
    ],
  },
  facebook: {
    name: "Facebook Messenger",
    icon: "📘",
    tools: [
      {
        name: "fb_sendMessage",
        description: "Envia mensagem via Facebook Messenger",
        parameters: {
          conversationId: "string (required)",
          message: "string (required)",
        },
      },
      {
        name: "fb_getConversations",
        description: "Lista conversas do Messenger",
        parameters: {},
      },
      {
        name: "fb_toggleAutoReply",
        description: "Ativa/desativa resposta automática IA",
        parameters: { enabled: "boolean (required)" },
      },
    ],
  },
  tiktok: {
    name: "TikTok",
    icon: "🎵",
    tools: [
      {
        name: "tiktok_sendDM",
        description: "Envia mensagem direta no TikTok",
        parameters: {
          userId: "string (required)",
          message: "string (required)",
        },
      },
      {
        name: "tiktok_getInbox",
        description: "Lista conversas do TikTok",
        parameters: {},
      },
      {
        name: "tiktok_toggleAutoReply",
        description: "Ativa/desativa resposta automática IA",
        parameters: { enabled: "boolean (required)" },
      },
    ],
  },
  twitter: {
    name: "Twitter / X",
    icon: "🐦",
    tools: [
      {
        name: "twitter_sendDM",
        description: "Envia mensagem direta no Twitter/X",
        parameters: {
          userId: "string (required)",
          message: "string (required)",
        },
      },
      {
        name: "twitter_getInbox",
        description: "Lista conversas de DM",
        parameters: {},
      },
      {
        name: "twitter_toggleAutoReply",
        description: "Ativa/desativa resposta automática IA",
        parameters: { enabled: "boolean (required)" },
      },
    ],
  },
  youtube: {
    name: "YouTube",
    icon: "▶️",
    tools: [
      {
        name: "yt_replyComment",
        description: "Responde a comentário no YouTube",
        parameters: {
          commentId: "string (required)",
          reply: "string (required)",
        },
      },
      {
        name: "yt_getComments",
        description: "Lista comentários recentes de um vídeo",
        parameters: {
          videoId: "string (required)",
          limit: "number (default: 50)",
        },
      },
      {
        name: "yt_toggleAutoReply",
        description: "Ativa/desativa resposta automática IA nos comentários",
        parameters: { enabled: "boolean (required)" },
      },
    ],
  },
};

/**
 * @returns {{
 *   registry: Map<string, Object>,
 *   tools: Array<Object>,
 *   toolCount: number,
 *   activeModules: string[],
 *   loadModule: (id: string) => void,
 *   unloadModule: (id: string) => void,
 *   syncWithDock: (dockModules: string[]) => void,
 *   getToolsForAI: () => string,
 *   getToolByName: (name: string) => Object|null,
 * }}
 */
export default function useMCPRegistry() {
  // moduleId → { name, icon, tools[] }
  const [registry, setRegistry] = useState(new Map());

  // ── Load a single module ──
  const loadModule = useCallback((moduleId) => {
    const manifest = BUILTIN_TOOLS[moduleId];
    if (!manifest) {
      console.warn(`📡 MCP: No manifest found for "${moduleId}"`);
      return;
    }

    setRegistry((prev) => {
      if (prev.has(moduleId)) return prev; // already loaded
      const next = new Map(prev);
      next.set(moduleId, manifest);
      console.log(
        `📡 MCP: Loaded ${manifest.tools.length} tools from "${manifest.name}"`,
      );
      return next;
    });
  }, []);

  // ── Unload a module ──
  const unloadModule = useCallback((moduleId) => {
    setRegistry((prev) => {
      if (!prev.has(moduleId)) return prev;
      const next = new Map(prev);
      next.delete(moduleId);
      console.log(`📡 MCP: Unloaded "${moduleId}"`);
      return next;
    });
  }, []);

  // ── Sync with Dock state (load new, unload removed) ──
  const syncWithDock = useCallback((dockModuleIds) => {
    setRegistry((prev) => {
      const currentIds = Array.from(prev.keys());
      let next = prev;
      let changed = false;

      // Load new modules
      for (const id of dockModuleIds) {
        if (!next.has(id) && BUILTIN_TOOLS[id]) {
          if (!changed) {
            next = new Map(prev);
            changed = true;
          }
          next.set(id, BUILTIN_TOOLS[id]);
          console.log(
            `📡 MCP: Loaded ${BUILTIN_TOOLS[id].tools.length} tools from "${BUILTIN_TOOLS[id].name}"`,
          );
        }
      }

      // Unload removed modules
      for (const id of currentIds) {
        if (!dockModuleIds.includes(id)) {
          if (!changed) {
            next = new Map(prev);
            changed = true;
          }
          next.delete(id);
          console.log(`📡 MCP: Unloaded "${id}"`);
        }
      }

      return changed ? next : prev;
    });
  }, []);

  // ── Derived: flat list of all tools ──
  const tools = useMemo(() => {
    const all = [];
    for (const [moduleId, manifest] of registry) {
      for (const tool of manifest.tools) {
        all.push({
          ...tool,
          moduleId,
          moduleName: manifest.name,
          moduleIcon: manifest.icon,
        });
      }
    }
    return all;
  }, [registry]);

  // ── Get a specific tool by name ──
  const getToolByName = useCallback(
    (toolName) => {
      return tools.find((t) => t.name === toolName) || null;
    },
    [tools],
  );

  // ── Format tools for AI context injection ──
  const getToolsForAI = useCallback(() => {
    if (tools.length === 0) return "";

    const lines = [
      "MCP TOOLS DISPONÍVEIS:",
      `(${tools.length} tools de ${registry.size} módulos ativos)`,
      "",
    ];

    // Group by module
    const byModule = {};
    for (const tool of tools) {
      if (!byModule[tool.moduleId]) {
        byModule[tool.moduleId] = {
          name: tool.moduleName,
          icon: tool.moduleIcon,
          tools: [],
        };
      }
      byModule[tool.moduleId].tools.push(tool);
    }

    for (const [, mod] of Object.entries(byModule)) {
      lines.push(`${mod.icon} ${mod.name}:`);
      for (const tool of mod.tools) {
        const params = tool.parameters
          ? Object.keys(tool.parameters).join(", ")
          : "";
        lines.push(`  - ${tool.name}(${params}): ${tool.description}`);
      }
      lines.push("");
    }

    return lines.join("\n");
  }, [tools, registry]);

  return {
    registry,
    tools,
    toolCount: tools.length,
    activeModules: Array.from(registry.keys()),
    loadModule,
    unloadModule,
    syncWithDock,
    getToolsForAI,
    getToolByName,
  };
}
