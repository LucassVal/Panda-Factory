/**
 * 🔌 callGAS.js — Centralized Backend Service (GAS Bridge)
 *
 * Single entry point for ALL frontend → GAS communication.
 * Parent interface: every SDK hook (useWallet, useGasometer, useAuth) calls through THIS.
 *
 * Architecture (Parent/Child):
 *   callGAS (parent)
 *     ├── callGAS.get()    → doGet actions (catalog, status, gasometer)
 *     ├── callGAS.post()   → doPost actions (purchase, wallet, AI dispatch)
 *     └── callGAS.stream() → future: streaming responses
 *
 * @version 1.3.0 — License namespace added (TICKET-12)
 * @see PF_BACKEND_REFERENCE.md
 * @version 1.2.0
 */

// ── Config ──
const GAS_CONFIG = {
  // Will be set after `clasp deploy` — placeholder for now
  url: import.meta.env.VITE_GAS_URL || "",
  timeout: 15000,
  retries: 2,
  retryDelay: 1000,
};

/**
 * Set the GAS Web App URL at runtime.
 * Called once after login or from env config.
 */
export function setGasUrl(url) {
  GAS_CONFIG.url = url;
}

/**
 * GET request to GAS doGet endpoint.
 * Uses JSONP fallback for CORS-restricted environments.
 *
 * @param {string} action - The doGet action (e.g., 'store.catalog', 'status', 'gasometer.stats')
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} Parsed JSON response
 */
export async function gasGet(action, params = {}) {
  if (!GAS_CONFIG.url) {
    console.warn("[callGAS] No GAS URL configured — returning mock");
    return { status: "MOCK", action, message: "GAS URL not set" };
  }

  const url = new URL(GAS_CONFIG.url);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  for (let attempt = 0; attempt <= GAS_CONFIG.retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        GAS_CONFIG.timeout,
      );

      const response = await fetch(url.toString(), {
        method: "GET",
        signal: controller.signal,
        redirect: "follow", // GAS redirects on deploy
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`GAS HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();

      // Handle JSONP response
      if (text.startsWith("callback(")) {
        return JSON.parse(text.slice(9, -1));
      }

      // Handle plain text (e.g., 'pong')
      try {
        return JSON.parse(text);
      } catch {
        return { status: "SUCCESS", data: text };
      }
    } catch (error) {
      if (attempt < GAS_CONFIG.retries) {
        await new Promise((r) =>
          setTimeout(r, GAS_CONFIG.retryDelay * (attempt + 1)),
        );
        continue;
      }
      console.error(`[callGAS] GET ${action} failed:`, error.message);
      return { status: "ERROR", error: error.message, action };
    }
  }
}

/**
 * POST request to GAS doPost endpoint.
 *
 * @param {string} action - The doPost action (e.g., 'STORE_PURCHASE', 'GET_BALANCE', 'CREATE_PAYMENT_STRIPE')
 * @param {Object} payload - JSON body to send
 * @returns {Promise<Object>} Parsed JSON response
 */
export async function gasPost(action, payload = {}) {
  if (!GAS_CONFIG.url) {
    console.warn("[callGAS] No GAS URL configured — returning mock");
    return { status: "MOCK", action, message: "GAS URL not set" };
  }

  const body = JSON.stringify({
    action,
    userId: payload.userId || localStorage.getItem("panda_uid") || "anonymous",
    ...payload,
  });

  for (let attempt = 0; attempt <= GAS_CONFIG.retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        GAS_CONFIG.timeout,
      );

      const response = await fetch(GAS_CONFIG.url, {
        method: "POST",
        body,
        redirect: "follow", // GAS redirects on deploy
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        return {
          status: "ERROR",
          error: "Invalid JSON response",
          raw: text.slice(0, 200),
        };
      }
    } catch (error) {
      if (attempt < GAS_CONFIG.retries) {
        await new Promise((r) =>
          setTimeout(r, GAS_CONFIG.retryDelay * (attempt + 1)),
        );
        continue;
      }
      console.error(`[callGAS] POST ${action} failed:`, error.message);
      return { status: "ERROR", error: error.message, action };
    }
  }
}

// ── Convenience Methods (Parent/Child pattern) ──

/** Store — Get catalog from GAS/Firebase */
export const Store = {
  getCatalog: () => gasGet("store.catalog"),
  purchase: (moduleId) => gasPost("STORE_PURCHASE", { moduleId }),
};

/** Wallet — Balance operations */
export const Wallet = {
  getBalance: () => gasPost("GET_BALANCE"),
  recharge: (amount) => gasPost("RECHARGE", { amount }),
  getHistory: () => gasPost("GET_HISTORY"),
  transfer: (toUid, amount) => gasPost("TRANSFER", { toUid, amount }),
};

/** Gasometer — Usage stats */
export const Gasometer = {
  getStats: () => gasGet("gasometer.stats"),
};

/** AI — Dispatch requests */
export const AI = {
  textGen: (prompt) =>
    gasPost("DISPATCH", { type: "TEXT_GEN", payload: { prompt } }),
  toolCall: (tool, args) =>
    gasPost("DISPATCH", { type: "TOOL_CALL", payload: { tool, args } }),
};

/** Brain — Panda Chat AI (Gemini) */
export const Brain = {
  chat: (message, options = {}) =>
    gasPost("BRAIN_CHAT", { message, ...options }),
  analyze: (data, analysisType) =>
    gasPost("BRAIN_ANALYZE", { data, analysisType }),
  getGems: () => gasPost("BRAIN_GEMS"),
};

/** License — Module license management (TICKET-12) */
export const License = {
  check: (moduleId) => gasPost("LICENSE_CHECK", { moduleId }),
  list: () => gasPost("LICENSE_LIST"),
  activate: (code) => gasPost("LICENSE_ACTIVATE", { code }),
};

/** Stripe — Payment flow (Phase 1: Founder sells directly) */
export const Payments = {
  createStripeCheckout: (amountPC, priceUSD, packageId) =>
    gasPost("CREATE_PAYMENT_STRIPE", { amountPC, priceUSD, packageId }),
  createCryptoIntent: (amountPC, priceUSDC) =>
    gasPost("CREATE_PAYMENT_CRYPTO", { amountPC, priceUSDC }),
};

/** Status — Backend health */
export const Status = {
  ping: () => gasGet("ping"),
  health: () => gasGet("status"),
};

/** Drive — Google Drive file management (Affiliate Materials) */
export const Drive = {
  listFiles: (folderId) => gasPost("DRIVE_LIST_FILES", { folderId }),
  readFile: (fileId) => gasPost("DRIVE_READ", { fileId }),
  getShareLink: (fileId) => gasPost("DRIVE_SHARE_LINK", { fileId }),
  initFounderFolder: () => gasPost("DRIVE_INIT_FOUNDER"),
};

/** Founder — Sales & webhook dashboard */
export const Founder = {
  getRecentSales: (limit = 20) => gasPost("FOUNDER_RECENT_SALES", { limit }),
  getWebhookLogs: (limit = 50) => gasPost("FOUNDER_WEBHOOK_LOGS", { limit }),
};

/** WhatsApp — Evolution API tentacle (MOD-01) */
export const WhatsApp = {
  send: (chatId, message) => gasPost("WA_SEND", { chatId, message }),
  getStatus: () => gasPost("WA_STATUS"),
  getChats: () => gasPost("WA_GET_CHATS"),
  getMessages: (chatId) => gasPost("WA_GET_MESSAGES", { chatId }),
};

/** Instagram — Meta Graph API tentacle (MOD-02) */
export const Instagram = {
  send: (chatId, message) => gasPost("IG_SEND", { chatId, message }),
  getStatus: () => gasPost("IG_STATUS"),
  getChats: () => gasPost("IG_GET_CHATS"),
  getMessages: (chatId) => gasPost("IG_GET_MESSAGES", { chatId }),
};

/** CRM — Native CRM Tentacle (MOD-04) */
export const CRM = {
  upsert: (contact) => gasPost("CRM_UPSERT", { contact }),
  delete: (contactId) => gasPost("CRM_DELETE", { contactId }),
  list: (pipeline, search) => gasPost("CRM_LIST", { pipeline, search }),
  pipelineUpdate: (contactId, pipeline) =>
    gasPost("CRM_PIPELINE_UPDATE", { contactId, pipeline }),
};

/** Agenda — Calendar Management (MOD-05) */
export const Agenda = {
  create: (event) => gasPost("AGENDA_CREATE", { event }),
  list: (dateFrom, dateTo) => gasPost("AGENDA_LIST", { dateFrom, dateTo }),
  update: (eventId, updates) => gasPost("AGENDA_UPDATE", { eventId, updates }),
  remove: (eventId) => gasPost("AGENDA_DELETE", { eventId }),
};

/** PDV — Point of Sale / Cardápio (MOD-06) */
export const PDV = {
  getMenu: (category) => gasPost("PDV_GET_MENU", { category }),
  upsertMenu: (item) => gasPost("PDV_UPSERT_MENU", { item }),
  createOrder: (order) => gasPost("PDV_CREATE_ORDER", { order }),
  listOrders: () => gasPost("PDV_LIST_ORDERS", {}),
};

/** Estoque — Inventory Management (MOD-07) */
export const Estoque = {
  list: (category, lowStockOnly) =>
    gasPost("STOCK_LIST", { category, lowStockOnly }),
  upsert: (item) => gasPost("STOCK_UPSERT", { item }),
  adjust: (itemId, adjustment, reason, type) =>
    gasPost("STOCK_ADJUST", { itemId, adjustment, reason, type }),
};

/** Facebook Messenger — DM Auto-Reply (MOD-08) */
export const Facebook = {
  receive: (payload) => gasPost("FB_RECEIVE", { payload }),
  send: (recipientId, message) => gasPost("FB_SEND", { recipientId, message }),
  status: () => gasGet("FB_STATUS"),
};

/** TikTok — Comments + DM (MOD-09) */
export const TikTok = {
  receive: (payload) => gasPost("TT_RECEIVE", { payload }),
  reply: (commentId, text) => gasPost("TT_REPLY", { commentId, text }),
  status: () => gasGet("TT_STATUS"),
};

/** YouTube — Comments + Moderation (MOD-10) */
export const YouTube = {
  replyComment: (commentId, text) =>
    gasPost("YT_REPLY_COMMENT", { commentId, text }),
  moderate: (commentId, action) =>
    gasPost("YT_MODERATE", { commentId, action }),
};

export default {
  get: gasGet,
  post: gasPost,
  setUrl: setGasUrl,
  Store,
  Wallet,
  Gasometer,
  AI,
  Brain,
  License,
  Payments,
  Status,
  Drive,
  Founder,
  WhatsApp,
  Instagram,
  CRM,
  Agenda,
  PDV,
  Estoque,
  Facebook,
  TikTok,
  YouTube,
};
