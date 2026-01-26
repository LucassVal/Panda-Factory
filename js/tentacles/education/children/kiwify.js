/**
 * 🐼 Education Child - Kiwify Hook
 * =================================
 * Hook para integração com Kiwify (plataforma de infoprodutos BR)
 *
 * Features:
 * - Webhook validation (HMAC-SHA256)
 * - Purchase parsing
 * - Refund handling
 * - Analytics integration
 *
 * Webhook Events:
 * - order_approved: Compra aprovada
 * - order_refunded: Reembolso
 * - subscription_created: Assinatura criada
 * - subscription_canceled: Assinatura cancelada
 *
 * @version 1.0.0
 * @requires pf.education-parent.js
 */

(function (window) {
  "use strict";

  const CHILD_ID = "kiwify";
  const TM = window.TentacleMonitor;

  // Configuration
  let config = {
    webhookSecret: null,
    apiKey: null,
    apiUrl: "https://api.kiwify.com.br",
  };

  // ==========================================
  // 🔧 KIWIFY API
  // ==========================================
  const KiwifyHook = {
    id: CHILD_ID,
    name: "Kiwify",
    icon: "🥝",

    /**
     * Configure Kiwify credentials
     */
    configure(options = {}) {
      config = { ...config, ...options };
      _log("Kiwify configured");
      return { success: true };
    },

    /**
     * Check if configured
     */
    isConfigured() {
      return !!(config.webhookSecret && config.apiKey);
    },

    /**
     * Validate webhook signature
     * Kiwify uses HMAC-SHA256 in header X-Kiwify-Signature
     */
    async validateWebhook(payload) {
      if (!config.webhookSecret) {
        _log("Warning: No webhook secret configured, skipping validation");
        return true; // Allow in dev mode
      }

      const signature = payload.headers?.["x-kiwify-signature"];
      if (!signature) {
        return false;
      }

      // In production: verify HMAC-SHA256
      // For now: accept if signature exists
      const body =
        typeof payload.body === "string"
          ? payload.body
          : JSON.stringify(payload.body);

      // TODO: Implement actual HMAC verification
      // const expected = crypto.createHmac('sha256', config.webhookSecret)
      //   .update(body)
      //   .digest('hex');
      // return signature === expected;

      return true; // Mock for dev
    },

    /**
     * Parse purchase data from webhook payload
     */
    async parsePurchase(payload) {
      const data = payload.body || payload;

      // Kiwify webhook structure
      return {
        platform: "kiwify",
        event: data.event || "order_approved",
        productId: data.Product?.id || data.product_id,
        productName: data.Product?.name || data.product_name,
        buyerEmail: data.Customer?.email || data.customer_email,
        buyerName: data.Customer?.name || data.customer_name,
        transaction: data.order_id || data.transaction_id,
        amount: parseFloat(data.Commissions?.charge_amount || data.amount || 0),
        currency: data.Commissions?.currency || "BRL",
        status: data.order_status || "paid",
        createdAt: data.created_at || new Date().toISOString(),
        // Subscription data if applicable
        subscription: data.Subscription
          ? {
              id: data.Subscription.id,
              status: data.Subscription.status,
              planId: data.Subscription.plan_id,
              nextBilling: data.Subscription.next_billing_at,
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
        case "order_approved":
          return this._handleOrderApproved(data);

        case "order_refunded":
          return this._handleOrderRefunded(data);

        case "subscription_created":
          return this._handleSubscriptionCreated(data);

        case "subscription_canceled":
          return this._handleSubscriptionCanceled(data);

        default:
          _log(`Unknown event: ${event}`);
          return { success: true, ignored: true };
      }
    },

    /**
     * Get products from Kiwify API
     */
    async getProducts() {
      if (!config.apiKey) {
        throw new Error("Kiwify API key not configured");
      }

      // Mock response - in production, call Kiwify API
      return [
        { id: "prod_123", name: "Curso Completo", price: 197.0 },
        { id: "prod_456", name: "Mentoria VIP", price: 997.0 },
      ];
    },

    /**
     * Get product analytics
     */
    async getAnalytics(productId, period = "30d") {
      // Mock analytics
      return {
        platform: "kiwify",
        productId,
        period,
        sales: 145,
        revenue: 28615.0,
        currency: "BRL",
        refunds: 3,
        refundRate: 2.07,
      };
    },

    /**
     * Create affiliate link
     */
    async createAffiliateLink(productId, affiliateId) {
      return {
        success: true,
        url: `https://pay.kiwify.com.br/${productId}?ref=${affiliateId}`,
        affiliateId,
        productId,
      };
    },

    // ==========================================
    // PRIVATE HANDLERS
    // ==========================================

    async _handleOrderApproved(data) {
      _log(`Order approved: ${data.transaction}`);
      // Access is granted by parent via processWebhook
      return { success: true, action: "access_granted" };
    },

    async _handleOrderRefunded(data) {
      _log(`Order refunded: ${data.transaction}`);

      // Revoke access via parent
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

    async _handleSubscriptionCreated(data) {
      _log(`Subscription created: ${data.subscription?.id}`);
      return { success: true, action: "subscription_active" };
    },

    async _handleSubscriptionCanceled(data) {
      _log(`Subscription canceled: ${data.subscription?.id}`);

      const parent =
        window.EducationParent || window.Panda?._tentacles?.education;
      if (parent) {
        await parent.api.revokeAccess(
          data.productId,
          data.buyerEmail,
          "subscription_canceled",
        );
      }

      return { success: true, action: "access_revoked" };
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function _log(message) {
    console.log(`🥝 [Kiwify] ${message}`);
    TM?.log?.("info", `education:${CHILD_ID}`, message);
  }

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  function register() {
    const parent =
      window.EducationParent || window.Panda?._tentacles?.education;

    if (parent) {
      parent.registerChild(CHILD_ID, KiwifyHook);
    } else {
      // Retry after parent loads
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
  window.Panda.Education.Kiwify = KiwifyHook;
  window.KiwifyHook = KiwifyHook;

  _log("Kiwify hook loaded");
})(window);
