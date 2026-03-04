/**
 * 🎓 PFOrchestrator.js — Central MCP Command Dispatcher
 *
 * This service closes the loop: AI proposes a tool call -> Orchestrator executes it.
 * Maps tool names (from useMCPRegistry) to real API calls (in callGAS.js).
 *
 * @version 1.0.0
 */

import callGAS from "./callGAS";

const TOOL_MAPPING = {
  // 🏢 CRM & Contacts
  crm_addContact: (args) => callGAS.CRM.upsert(args),
  crm_updateContact: (args) =>
    callGAS.CRM.upsert({ id: args.id, ...args.updates }),
  crm_deleteContact: (args) => callGAS.CRM.delete(args.id),
  crm_listContacts: (args) => callGAS.CRM.list(args.stage),

  // 📋 Agenda / Calendar
  agenda_createEvent: (args) => callGAS.Agenda.create(args),
  agenda_listEvents: (args) =>
    callGAS.Agenda.list(args.startDate, args.endDate),
  agenda_deleteEvent: (args) => callGAS.Agenda.remove(args.eventId),

  // 📦 Stock / Inventory
  estoque_addItem: (args) => callGAS.Estoque.upsert(args),
  estoque_adjustStock: (args) =>
    callGAS.Estoque.adjust(
      args.itemId,
      args.adjustment,
      args.reason,
      args.type,
    ),
  estoque_listItems: (args) => callGAS.Estoque.list(null, args.lowStockOnly),

  // 💬 Social Hub (WhatsApp)
  wa_sendMessage: (args) => callGAS.WhatsApp.send(args.contactId, args.message),
  wa_getConversations: () => callGAS.WhatsApp.getChats(),

  // 📸 Social Hub (Instagram)
  ig_sendDM: (args) => callGAS.Instagram.send(args.contactId, args.message),
  ig_getInbox: () => callGAS.Instagram.getChats(),

  // 🌐 Landing Pages (Future / Placeholder)
  landing_listPages: () => Promise.resolve({ status: "SUCCESS", pages: [] }),
};

/**
 * Execute an MCP tool call.
 * @param {string} toolName - Name of the tool to invoke
 * @param {Object} args - Arguments provided by the AI
 * @returns {Promise<Object>} Result of the execution
 */
export async function executeTool(toolName, args = {}) {
  console.log(`🧠 [Orchestrator] Executing tool: ${toolName}`, args);

  const handler = TOOL_MAPPING[toolName];

  if (!handler) {
    console.error(`🧠 [Orchestrator] No handler found for tool: ${toolName}`);
    return {
      status: "ERROR",
      message: `Tool "${toolName}" is not implemented in the Orchestrator yet.`,
    };
  }

  try {
    const response = await handler(args);
    console.log(`🧠 [Orchestrator] Execution success:`, response);
    return response;
  } catch (error) {
    console.error(`🧠 [Orchestrator] Execution error for ${toolName}:`, error);
    return {
      status: "ERROR",
      message: error.message || "Unknown execution error",
    };
  }
}

export default { executeTool };
