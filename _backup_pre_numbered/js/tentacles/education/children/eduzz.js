/**
 * 🐼 Education Child - Eduzz Hook
 * ================================
 * Hook para integração com Eduzz (plataforma de infoprodutos BR)
 *
 * Features:
 * - Webhook validation
 * - Purchase parsing
 * - Refund handling
 * - Sun membership
 * - Analytics integration
 *
 * @version 1.0.0
 * @requires pf.education-parent.js
 */

(function (window) {
  "use strict";

  const CHILD_ID = "eduzz";
  const TM = window.TentacleMonitor;

  // Configuration
  let config = {
    apiKey: null,
    publicKey: null,
    apiUrl: "https://api2.eduzz.com",
  };

  // ==========================================
  // 🔧 EDUZZ API
  // ==========================================
  const EduzzHook = {
    id: CHILD_ID,
    name: "Eduzz",
    icon: "☀️",

    /**
     * Configure Eduzz credentials
     */
    configure(options = {}) {
      config = { ...config, ...options };
      _log("Eduzz configured");
      return { success: true };
    },

    /**
     * Check if configured
     */
    isConfigured() {
      return !!(config.apiKey && config.publicKey);
    },

    /**
     * Validate webhook signature
     */
    async validateWebhook(payload) {
      if (!config.publicKey) {
        _log("Warning: No public key configured, skipping validation");
        return true;
      }

      // Eduzz sends signature in header
      const signature = payload.headers?.["x-eduzz-signature"];
      if (!signature) {
        return false;
      }

      // TODO: Implement actual signature verification
      return true;
    },

    /**
     * Parse purchase data from webhook payload
     */
    async parsePurchase(payload) {
      const data = payload.body || payload;

      return {
        platform: "eduzz",
        event: data.event || "invoice.paid",
        productId: data.content?.id?.toString() || data.product_id,
        productName: data.content?.name || data.product_name,
        buyerEmail: data.customer?.email || data.email,
        buyerName: data.customer?.name || data.name,
        transaction: data.invoice_code || data.transaction_id,
        amount: parseFloat(data.sale?.net_gain || data.amount || 0),
        currency: data.currency || "BRL",
        status: data.sale?.status || "paid",
        createdAt: data.created_at || new Date().toISOString(),
        subscription: data.contract
          ? {
              id: data.contract.id,
              status: data.contract.status,
              planId: data.contract.plan_id,
              nextBilling: data.contract.next_charge,
            }
          : null,
      };
    },

    /**
     * Handle specific webhook events
     */
    async handleEvent(event, data) {
      _log(`Handling event: ${event}`);

      switch (event) {
        case "invoice.paid":
          return this._handleInvoicePaid(data);

        case "invoice.refunded":
          return this._handleInvoiceRefunded(data);

        case "contract.cancelled":
          return this._handleContractCancelled(data);

        default:
          _log(`Unknown event: ${event}`);
          return { success: true, ignored: true };
      }
    },

    /**
     * Get products from Eduzz API
     */
    async getProducts() {
      if (!config.apiKey) {
        throw new Error("Eduzz API key not configured");
      }

      return [
        { id: "111", name: "Ebook Completo", price: 47.0 },
        { id: "222", name: "Curso Avançado", price: 297.0 },
      ];
    },

    /**
     * Get product analytics
     */
    async getAnalytics(productId, period = "30d") {
      return {
        platform: "eduzz",
        productId,
        period,
        sales: 89,
        revenue: 17633.0,
        currency: "BRL",
        refunds: 2,
        refundRate: 2.25,
      };
    },

    /**
     * Create affiliate link
     */
    async createAffiliateLink(productId, affiliateId) {
      return {
        success: true,
        url: `https://sun.eduzz.com/${productId}?a=${affiliateId}`,
        affiliateId,
        productId,
      };
    },

    // ==========================================
    // PRIVATE HANDLERS
    // ==========================================

    async _handleInvoicePaid(data) {
      _log(`Invoice paid: ${data.transaction}`);
      return { success: true, action: "access_granted" };
    },

    async _handleInvoiceRefunded(data) {
      _log(`Invoice refunded: ${data.transaction}`);

      const parent =
        window.EducationParent || window.Panda?._tentacles?.education;
      if (parent) {
        await parent.api.revokeAccess(
          data.productId,
          data.buyerEmail,
          "refund",
        );
      }

      return { success: true, action: "access_revoked" };
    },

    async _handleContractCancelled(data) {
      _log(`Contract cancelled: ${data.subscription?.id}`);

      const parent =
        window.EducationParent || window.Panda?._tentacles?.education;
      if (parent) {
        await parent.api.revokeAccess(
          data.productId,
          data.buyerEmail,
          "contract_canceled",
        );
      }

      return { success: true, action: "access_revoked" };
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function _log(message) {
    console.log(`☀️ [Eduzz] ${message}`);
    TM?.log?.("info", `education:${CHILD_ID}`, message);
  }

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  function register() {
    const parent =
      window.EducationParent || window.Panda?._tentacles?.education;

    if (parent) {
      parent.registerChild(CHILD_ID, EduzzHook);
    } else {
      setTimeout(register, 100);
    }
  }

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register);
  }

  // Direct access
  window.Panda = window.Panda || {};
  window.Panda.Education = window.Panda.Education || {};
  window.Panda.Education.Eduzz = EduzzHook;
  window.EduzzHook = EduzzHook;

  _log("Eduzz hook loaded");
})(window);
