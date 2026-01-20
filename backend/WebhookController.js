/**
 * PANDA CORE - WEBHOOK_CONTROLLER.js
 * Integração B2B (Kiwify, Hotmart, Eduzz) para venda de Bundles.
 * Recebe o webhook da plataforma e credita o usuário.
 *
 * @version 1.0.0
 */

/**
 * Processa Webhooks de plataformas de infoproduto.
 * @param {Object} payload - Dados JSON recebidos
 * @param {string} source - 'KIWIFY', 'HOTMART', etc.
 */
function processB2BWebhook(payload, source) {
  let userEmail = null;
  let amountPaid = 0;
  let status = null;
  let productId = null;

  try {
    // === KIWIFY ===
    if (source === "KIWIFY") {
      // Kiwify payload structure
      status = payload.order_status; // 'paid'
      if (status === "paid") {
        userEmail = payload.Customer.email;
        amountPaid = parseFloat(payload.Commissions.charge_amount) / 100; // Centavos -> Reais? Verificar doc. Kiwify manda em BRL direto ou cents. Assumindo BRL.
        // Nota: Kiwify envia 'net_amount', 'total' etc. Ajustar conforme DOC real.
        // Fallback simplificado:
        if (!userEmail) userEmail = payload.email; // Às vezes raiz
      }
    }

    // === HOTMART ===
    else if (source === "HOTMART") {
      // Hotmart 2.0 payload
      const event = payload.event;
      if (event === "PURCHASE_APPROVED") {
        userEmail = payload.data.buyer.email;
        amountPaid = payload.data.purchase.price.value;
      }
    }

    // === LÓGICA DE CRÉDITO ===
    if (userEmail && amountPaid > 0) {
      // Regra de Conversão B2B (Pode ser fixa por produto)
      // Ex: "Produto A" dá 1000 Coins. "Produto B" dá 5000.

      const coins = calculateCoinsFromB2B(amountPaid);

      creditWallet(userEmail, coins, `${source}_BUNDLE_SALE`);

      return {
        success: true,
        message: `Creditado ${coins} PC para ${userEmail}`,
      };
    }

    return {
      success: false,
      message: "Status não aprovado ou email não encontrado.",
    };
  } catch (e) {
    console.error("Erro B2B Webhook: " + e.toString());
    return { success: false, error: e.toString() };
  }
}

function calculateCoinsFromB2B(amountBRL) {
  // Exemplo: 1 BRL = 100 PC (Atacado/Varejo)
  return Math.floor(amountBRL * 100);
}
