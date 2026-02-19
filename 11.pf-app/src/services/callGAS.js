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
 * @see PF_GAS_REFERENCE.md
 * @see PF_BACKEND_REFERENCE.md
 * @version 1.0.0
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

/** Stripe — Payment flow */
export const Payments = {
  createStripeCheckout: (amountPC, priceUSD) =>
    gasPost("CREATE_PAYMENT_STRIPE", { amountPC, priceUSD }),
};

/** Status — Backend health */
export const Status = {
  ping: () => gasGet("ping"),
  health: () => gasGet("status"),
};

export default {
  get: gasGet,
  post: gasPost,
  setUrl: setGasUrl,
  Store,
  Wallet,
  Gasometer,
  AI,
  Payments,
  Status,
};
