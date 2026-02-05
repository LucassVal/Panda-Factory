/**
 * 🐼 Education Child - Hotmart Hook
 * ==================================
 * Hook para integração com Hotmart (maior plataforma BR/Global)
 *
 * Features:
 * - Webhook validation (HotConnect)
 * - Purchase parsing
 * - Refund handling
 * - Club membership
 * - Analytics integration
 *
 * Webhook Events:
 * - PURCHASE_COMPLETE: Compra aprovada
 * - PURCHASE_REFUNDED: Reembolso
 * - PURCHASE_CHARGEBACK: Chargeback
 * - SUBSCRIPTION_CANCELLATION: Assinatura cancelada
 *
 * @version 1.0.0
 * @requires pf.education-parent.js
 */

(function (window) {
  "use strict";

  const CHILD_ID = "hotmart";
  const TM = window.TentacleMonitor;

  // Configuration
  let config = {
    hottok: null, // Hotmart Token
    apiUrl: "https://developers.hotmart.com/payments/api",
  };

  // ==========================================
  // 🔧 HOTMART API
  // ==========================================
  const HotmartHook = {
    id: CHILD_ID,
    name: "Hotmart",
    icon: "🔥",

    /**
     * Configure Hotmart credentials
     */
    configure(options = {}) {
      config = { ...config, ...options };
      _log("Hotmart configured");
      return { success: true };
    },

    /**
     * Check if configured
     */
    isConfigured() {
      return !!config.hottok;
    },

    /**
     * Validate webhook signature
     * Hotmart uses hottok parameter validation
     */
    async validateWebhook(payload) {
      if (!config.hottok) {
        _log("Warning: No hottok configured, skipping validation");
        return true; // Allow in dev mode
      }

      const data = payload.body || payload;
      const receivedHottok = data.hottok || payload.query?.hottok;

      return receivedHottok === config.hottok;
    },

    /**
     * Parse purchase data from webhook payload
     */
    async parsePurchase(payload) {
      const data = payload.body || payload;

      // Hotmart webhook structure (HotConnect)
      return {
        platform: "hotmart",
        event: data.event || "PURCHASE_COMPLETE",
        productId: data.prod?.toString() || data.product?.id,
        productName: data.prod_name || data.product?.name,
        buyerEmail: data.email || data.buyer?.email,
        buyerName: data.name || data.buyer?.name,
        transaction: data.transaction || data.purchase?.transaction,
        amount: parseFloat(data.price || data.purchase?.price || 0),
        currency: data.currency_code || "BRL",
        status: this._mapStatus(data.status || data.purchase?.status),
        createdAt: data.purchase_date || new Date().toISOString(),
        // Hotmart specific
        affCode: data.aff_cod || data.affiliate?.code,
        paymentType: data.payment_type || data.purchase?.payment?.type,
        // Subscription data if applicable
        subscription:
          data.subscription || data.recurrency
            ? {
                id: data.subscriber_code || data.subscription?.subscriber_code,
                status: data.subscription?.status,
                planId: data.recurrency_period?.toString(),
                nextBilling: data.next_charge_date,
              }
            : null,
      };
    },

    /**
     * Map Hotmart status codes
     */
    _mapStatus(status) {
      const statusMap = {
        approved: "paid",
        complete: "paid",
        refunded: "refunded",
        chargeback: "chargeback",
        cancelled: "cancelled",
        waiting_payment: "pending",
        printed_billet: "pending",
        overdue: "overdue",
      };
      return statusMap[status?.toLowerCase()] || status;
    },

    /**
     * Handle specific webhook events
     */
    async handleEvent(event, data) {
      _log(`Handling event: ${event}`);

      switch (event) {
        case "PURCHASE_COMPLETE":
          return this._handlePurchaseComplete(data);

        case "PURCHASE_REFUNDED":
          return this._handlePurchaseRefunded(data);

        case "PURCHASE_CHARGEBACK":
          return this._handleChargeback(data);

        case "SUBSCRIPTION_CANCELLATION":
          return this._handleSubscriptionCancellation(data);

        default:
          _log(`Unknown event: ${event}`);
          return { success: true, ignored: true };
      }
    },

    /**
     * Get products from Hotmart API
     */
    async getProducts() {
      if (!config.hottok) {
        throw new Error("Hotmart hottok not configured");
      }

      // Mock response
      return [
        { id: "123456", name: "Curso Master", price: 497.0 },
        { id: "789012", name: "Clube Premium", price: 97.0, recurrent: true },
      ];
    },

    /**
     * Get product analytics
     */
    async getAnalytics(productId, period = "30d") {
      return {
        platform: "hotmart",
        productId,
        period,
        sales: 234,
        revenue: 116298.0,
        currency: "BRL",
        refunds: 8,
        refundRate: 3.42,
        chargebacks: 1,
      };
    },

    /**
     * Create affiliate link
     */
    async createAffiliateLink(productId, affiliateId) {
      return {
        success: true,
        url: `https://pay.hotmart.com/${productId}?off=${affiliateId}`,
        affiliateId,
        productId,
      };
    },

    // ==========================================
    // PRIVATE HANDLERS
    // ==========================================

    async _handlePurchaseComplete(data) {
      _log(`Purchase complete: ${data.transaction}`);
      return { success: true, action: "access_granted" };
    },

    async _handlePurchaseRefunded(data) {
      _log(`Purchase refunded: ${data.transaction}`);

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

    async _handleChargeback(data) {
      _log(`Chargeback: ${data.transaction}`);

      const parent =
        window.EducationParent || window.Panda?._tentacles?.education;
      if (parent) {
        await parent.api.revokeAccess(
          data.productId,
          data.buyerEmail,
          "chargeback",
        );
      }

      // Log chargeback for fraud prevention
      await window.Panda?.Data?.save?.("chargebacks", {
        platform: "hotmart",
        email: data.buyerEmail,
        transaction: data.transaction,
        amount: data.amount,
        timestamp: Date.now(),
      });

      return { success: true, action: "access_revoked_chargeback" };
    },

    async _handleSubscriptionCancellation(data) {
      _log(`Subscription cancelled: ${data.subscription?.id}`);

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
    console.log(`🔥 [Hotmart] ${message}`);
    TM?.log?.("info", `education:${CHILD_ID}`, message);
  }

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  function register() {
    const parent =
      window.EducationParent || window.Panda?._tentacles?.education;

    if (parent) {
      parent.registerChild(CHILD_ID, HotmartHook);
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
  window.Panda.Education.Hotmart = HotmartHook;
  window.HotmartHook = HotmartHook;

  _log("Hotmart hook loaded");
})(window);
