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
 * @version 2.0.0
 * @see PF_MCP_REFERENCE.md §B.2
 */

import React, { useState, useCallback, useMemo } from "react";
import { RiOrganizationChart } from "react-icons/ri";
import { TbMessageChatbot } from "react-icons/tb";
import { BsBoxSeam } from "react-icons/bs";
import { MdOutlineStorefront } from "react-icons/md";

// ── Inline tool definitions (extracted from 6.medusa/manifests/*) ──
// This avoids import() across Vite root boundary.
// When manifests are updated, regenerate this block or use runtime fetch.
const BUILTIN_TOOLS = {
  crm: {
    name: "Panda CRM",
    icon: <RiOrganizationChart size={24} color="#818cf8" />,
    textIcon: "🏢",
    tools: [
      {
        name: "crm_addContact",
        description: "Adiciona novo contato ao CRM",
        parameters: {
          name: "string (required)",
          email: "string",
          phone: "string",
          company: "string",
          stage: "string (lead|qualified|negotiation|won|lost)",
        },
      },
      {
        name: "crm_updateContact",
        description: "Atualiza dados de um contato existente",
        parameters: { id: "string (required)", updates: "object" },
      },
      {
        name: "crm_moveContact",
        description: "Move contato entre estágios do pipeline Kanban",
        parameters: {
          contactId: "string (required)",
          newStage: "string (required)",
        },
      },
      {
        name: "crm_deleteContact",
        description: "Remove contato do CRM",
        parameters: { id: "string (required)" },
      },
      {
        name: "crm_listContacts",
        description:
          "Lista todos os contatos, opcionalmente filtrados por estágio",
        parameters: { stage: "string (optional)" },
      },
      {
        name: "tentacle_addContact",
        description: "Adiciona lead capturado de canal externo ao pipeline",
        parameters: {
          name: "string (required)",
          source: "string (whatsapp|instagram|manual|import)",
          phone: "string",
          email: "string",
        },
      },
      {
        name: "tentacle_moveStage",
        description: "Move contato entre estágios do pipeline",
        parameters: {
          contactId: "string (required)",
          stage: "string (required)",
        },
      },
      {
        name: "tentacle_getContacts",
        description: "Lista contatos filtrados por estágio ou fonte",
        parameters: { stage: "string (optional)", source: "string (optional)" },
      },
      {
        name: "tentacle_deleteContact",
        description: "Remove contato do pipeline",
        parameters: { contactId: "string (required)" },
      },
      {
        name: "agenda_createEvent",
        description: "Cria novo evento na agenda",
        parameters: {
          title: "string (required)",
          start: "ISO datetime (required)",
          end: "ISO datetime (required)",
          color: "string (hex)",
          status: "string",
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
        description: "Ajusta quantidade em estoque (entrada ou saída)",
        parameters: {
          itemId: "string (required)",
          adjustment: "number (required)",
          reason: "string",
          type: "string",
        },
      },
      {
        name: "estoque_listItems",
        description: "Lista todos os itens do estoque",
        parameters: { lowStockOnly: "boolean (default: false)" },
      },
      {
        name: "estoque_getItem",
        description: "Busca detalhes de um item específico",
        parameters: { itemId: "string (required)" },
      },
    ],
  },
  social: {
    name: "Panda Social Hub",
    icon: <TbMessageChatbot size={24} color="#34d399" />,
    textIcon: "💬",
    tools: [
      {
        name: "wa_sendMessage",
        description: "Envia mensagem de texto para um contato via WhatsApp",
        parameters: {
          contactId: "string (required)",
          message: "string (required)",
        },
      },
      {
        name: "wa_getConversations",
        description: "Lista todas as conversas ativas no WhatsApp",
        parameters: {},
      },
      {
        name: "wa_loadMessages",
        description:
          "Carrega histórico de mensagens de uma conversa do WhatsApp",
        parameters: { contactId: "string (required)", limit: "number" },
      },
      {
        name: "wa_toggleAutoReply",
        description: "Ativa ou desativa resposta automática por IA no WhatsApp",
        parameters: { enabled: "boolean (required)" },
      },
      {
        name: "ig_sendDM",
        description: "Envia mensagem direta no Instagram",
        parameters: {
          contactId: "string (required)",
          message: "string (required)",
        },
      },
      {
        name: "ig_getInbox",
        description: "Lista conversas do inbox do Instagram",
        parameters: {},
      },
      {
        name: "ig_loadMessages",
        description: "Carrega histórico de DMs de uma conversa no Instagram",
        parameters: { contactId: "string (required)", limit: "number" },
      },
      {
        name: "ig_toggleAutoReply",
        description:
          "Ativa ou desativa resposta automática por IA nas DMs do IG",
        parameters: { enabled: "boolean (required)" },
      },
      {
        name: "fb_sendDM",
        description: "Envia mensagem no Facebook Messenger",
        parameters: {
          contactId: "string (required)",
          message: "string (required)",
        },
      },
      {
        name: "fb_getInbox",
        description: "Lista conversas do inbox do Facebook",
        parameters: {},
      },
      {
        name: "tk_sendDM",
        description: "Envia mensagem no TikTok",
        parameters: {
          contactId: "string (required)",
          message: "string (required)",
        },
      },
      {
        name: "tk_getInbox",
        description: "Lista conversas do inbox do TikTok",
        parameters: {},
      },
      {
        name: "tw_sendDM",
        description: "Envia mensagem no Twitter/X",
        parameters: {
          contactId: "string (required)",
          message: "string (required)",
        },
      },
      {
        name: "tw_getInbox",
        description: "Lista conversas do inbox do Twitter/X",
        parameters: {},
      },
      {
        name: "yt_replyComment",
        description: "Responde a um comentário no YouTube",
        parameters: {
          commentId: "string (required)",
          reply: "string (required)",
        },
      },
      {
        name: "yt_getComments",
        description: "Lista comentários recentes do canal no YouTube",
        parameters: {},
      },
    ],
  },
  pdv: {
    name: "Panda PDV",
    icon: <BsBoxSeam size={22} color="#f59e0b" />,
    textIcon: "🛒",
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
        parameters: { itemId: "string (required)", qty: "number" },
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
  "landing-pages": {
    name: "Landing Pages",
    icon: <MdOutlineStorefront size={24} color="#f472b6" />,
    textIcon: "🌐",
    tools: [
      {
        name: "landing_createPage",
        description: "Cria nova landing page a partir de template",
        parameters: { templateId: "string", name: "string" },
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
        description: "Exporta landing page como HTML puro para deploy",
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
  // moduleId → { name, icon, textIcon, tools[] }
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
          moduleTextIcon: manifest.textIcon,
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
          textIcon: tool.moduleTextIcon,
          tools: [],
        };
      }
      byModule[tool.moduleId].tools.push(tool);
    }

    for (const [, mod] of Object.entries(byModule)) {
      lines.push(`${mod.textIcon} ${mod.name}:`);
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
