/**
 * 📦 SDK: Stripe (Pagamentos Globais)
 * @implements {SDK}
 */
(function () {
  const SDK_ID = "STRIPE";

  const StripeSDK = {
    config: {
      TOKEN_PROPERTY: "STRIPE_API_KEY",
      SUCCESS_URL: "https://pandafabrics.io/success",
      CANCEL_URL: "https://pandafabrics.io/cancel",
    },

    /**
     * Gera Link de Checkout
     */
    createCheckout: function (userId, amountPC, priceUSD) {
      const apiKey = PropertiesService.getScriptProperties().getProperty(
        this.config.TOKEN_PROPERTY,
      );
      if (!apiKey) return { success: false, error: "Stripe Key Missing" };

      const payload = {
        "payment_method_types[]": "card",
        "line_items[0][price_data][currency]": "usd",
        "line_items[0][price_data][product_data][name]": `${amountPC} Panda Coins`,
        "line_items[0][price_data][unit_amount]": Math.round(priceUSD * 100),
        "line_items[0][quantity]": "1",
        mode: "payment",
        success_url: this.config.SUCCESS_URL,
        cancel_url: this.config.CANCEL_URL,
        client_reference_id: userId,
        customer_email: userId,
        "metadata[userId]": userId,
        "metadata[amountPC]": amountPC,
      };

      const options = {
        method: "post",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        payload: this._toFormBody(payload),
        muteHttpExceptions: true,
      };

      try {
        const response = UrlFetchApp.fetch(
          "https://api.stripe.com/v1/checkout/sessions",
          options,
        );
        return JSON.parse(response.getContentText());
      } catch (e) {
        return { error: e.toString() };
      }
    },

    _toFormBody: function (obj) {
      return Object.keys(obj)
        .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]))
        .join("&");
    },
  };

  // ✅ Self-Registration
  if (typeof SDKContext !== "undefined") {
    SDKContext.register(SDK_ID, StripeSDK);
  }
})();
