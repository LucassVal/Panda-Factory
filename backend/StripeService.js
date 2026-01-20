/**
 * PANDA CORE - STRIPE_SERVICE.js
 * Integração Global (USD) via Stripe Checkout.
 *
 * @version 1.0.0
 */

const STRIPE_CONFIG = {
  TOKEN_PROPERTY: "STRIPE_API_KEY", // Secret Key (sk_live_...)
  SUCCESS_URL: "https://pandafabrics.io/success",
  CANCEL_URL: "https://pandafabrics.io/cancel",
};

/**
 * Cria uma Sessão de Checkout no Stripe.
 * @param {string} userId - Email do usuário.
 * @param {number} amountPC - Quantidade de Panda Coins.
 * @param {number} priceUSD - Preço em Dólar.
 */
function createStripeCheckout(userId, amountPC, priceUSD) {
  const apiKey = PropertiesService.getScriptProperties().getProperty(
    STRIPE_CONFIG.TOKEN_PROPERTY,
  );
  if (!apiKey) return { success: false, error: "Stripe API Key missing" };

  const url = "https://api.stripe.com/v1/checkout/sessions";

  const payload = {
    "payment_method_types[]": "card",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][product_data][name]": `${amountPC} Panda Coins`,
    "line_items[0][price_data][unit_amount]": Math.round(priceUSD * 100), // Cents
    "line_items[0][quantity]": "1",
    mode: "payment",
    success_url: STRIPE_CONFIG.SUCCESS_URL,
    cancel_url: STRIPE_CONFIG.CANCEL_URL,
    client_reference_id: userId,
    customer_email: userId,
    "metadata[userId]": userId,
    "metadata[amountPC]": amountPC,
  };

  // Convert to x-www-form-urlencoded
  const formBody = Object.keys(payload)
    .map(
      (key) => encodeURIComponent(key) + "=" + encodeURIComponent(payload[key]),
    )
    .join("&");

  const options = {
    method: "post",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    payload: formBody,
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());

    if (json.error) {
      return { success: false, error: json.error.message };
    }

    return {
      success: true,
      checkoutUrl: json.url,
      sessionId: json.id,
    };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Handler para Webhook do Stripe.
 * (Requer configurar o endpoint do script no Dashboard do Stripe)
 */
function handleStripeWebhook(e) {
  // Stripe envia JSON no postData
  const payload = JSON.parse(e.postData.contents);

  if (payload.type === "checkout.session.completed") {
    const session = payload.data.object;
    const userId = session.client_reference_id;
    const amountPC = session.metadata.amountPC; // Garantir que metadata passe

    if (userId && amountPC) {
      creditWallet(userId, parseFloat(amountPC), "STRIPE_PURCHASE");
      return "OK - Credited";
    }
  }

  return "OK - Ignored";
}
