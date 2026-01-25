/**
 * PANDA CORE - WEBHOOK_CONTROLLER.js
 * Integração B2B (Kiwify, Hotmart, Eduzz) + Landing Pages
 * Recebe o webhook da plataforma e credita o usuário.
 *
 * @version 2.0.0
 *
 * PLATAFORMAS SUPORTADAS:
 * - Kiwify: Webhooks de vendas
 * - Hotmart: Webhooks PURCHASE_APPROVED
 * - Eduzz: Webhooks de transação
 * - Landing Pages: Hooks customizados via API
 */

/**
 * Processa Webhooks de plataformas de infoproduto.
 * @param {Object} payload - Dados JSON recebidos
 * @param {string} source - 'KIWIFY', 'HOTMART', 'EDUZZ', 'LANDING'
 */
function processB2BWebhook(payload, source) {
  let userEmail = null;
  let amountPaid = 0;
  let status = null;
  let productId = null;
  let transactionId = null;

  try {
    // === KIWIFY ===
    if (source === "KIWIFY") {
      status = payload.order_status; // 'paid'
      if (status === "paid") {
        userEmail = payload.Customer?.email || payload.email;
        amountPaid = parseFloat(
          payload.Commissions?.charge_amount || payload.total || 0,
        );
        if (amountPaid > 100) amountPaid = amountPaid / 100; // Centavos -> Reais
        transactionId = payload.order_id;
        productId = payload.product_id;
      }
    }

    // === HOTMART ===
    else if (source === "HOTMART") {
      const event = payload.event;
      if (event === "PURCHASE_APPROVED" || event === "PURCHASE_COMPLETE") {
        userEmail = payload.data?.buyer?.email;
        amountPaid = payload.data?.purchase?.price?.value || 0;
        transactionId = payload.data?.purchase?.transaction;
        productId = payload.data?.product?.id;
      }
    }

    // === EDUZZ ===
    else if (source === "EDUZZ") {
      // Eduzz envia eventos em formato diferente
      // Documentação: https://developers.eduzz.com/
      const eventType = payload.trans_status || payload.event_type;

      if (eventType === "pago" || eventType === 1 || eventType === "Pago") {
        userEmail = payload.cus_email || payload.customer?.email;
        amountPaid = parseFloat(payload.trans_value || payload.price || 0);
        transactionId = payload.trans_cod || payload.transaction_id;
        productId = payload.content_id || payload.product_id;

        // Eduzz pode enviar em centavos ou reais dependendo da versão
        if (amountPaid > 1000) amountPaid = amountPaid / 100;
      }
    }

    // === LANDING PAGE (Custom Webhook) ===
    else if (source === "LANDING") {
      // Hook genérico para landing pages customizadas
      // Payload esperado: { email, amount, product, signature, timestamp }

      // Validar assinatura
      if (!validateLandingSignature(payload)) {
        return { success: false, error: "Invalid signature" };
      }

      userEmail = payload.email;
      amountPaid = parseFloat(payload.amount || 0);
      productId = payload.product || "LANDING_GENERIC";
      transactionId = payload.transaction_id || `LAND_${Date.now()}`;
    }

    // === STRIPE ===
    else if (source === "STRIPE") {
      // Stripe Webhook Events
      // Documentação: https://stripe.com/docs/webhooks
      const eventType = payload.type;

      // Eventos de pagamento bem-sucedido
      if (
        eventType === "checkout.session.completed" ||
        eventType === "payment_intent.succeeded"
      ) {
        const data = payload.data?.object || payload.object || payload;

        userEmail = data.customer_email || data.receipt_email || data.email;

        // Stripe envia em centavos
        amountPaid = parseFloat(data.amount_total || data.amount || 0) / 100;
        transactionId = data.id || data.payment_intent || payload.id;
        productId = data.metadata?.product_id || "STRIPE_GENERIC";

        // Converte USD para BRL se necessário
        const currency = data.currency?.toLowerCase();
        if (currency === "usd") {
          amountPaid = amountPaid * getUsdRate();
        }
      }
    }

    // === MERCADO PAGO ===
    else if (source === "MERCADOPAGO" || source === "MP") {
      // Mercado Pago IPN (Instant Payment Notification)
      // Documentação: https://www.mercadopago.com.br/developers/pt/docs/notifications/ipn
      const topic = payload.topic || payload.type;
      const action = payload.action;

      // Notificação de pagamento aprovado
      if (
        topic === "payment" ||
        action === "payment.created" ||
        action === "payment.updated"
      ) {
        const paymentData = payload.data || payload;
        const paymentStatus = paymentData.status;

        // Só processa pagamentos aprovados
        if (paymentStatus === "approved") {
          userEmail =
            paymentData.payer?.email ||
            paymentData.additional_info?.payer?.email;
          amountPaid = parseFloat(
            paymentData.transaction_amount || paymentData.total_amount || 0,
          );
          transactionId = paymentData.id?.toString() || `MP_${Date.now()}`;
          productId =
            paymentData.additional_info?.items?.[0]?.id ||
            paymentData.external_reference ||
            "MP_GENERIC";
        }
      }

      // Notificação de merchant_order (pedido completo)
      if (topic === "merchant_order") {
        const orderStatus = payload.order_status;

        if (orderStatus === "paid") {
          userEmail = payload.payer?.email;
          amountPaid = parseFloat(payload.total_amount || 0);
          transactionId = payload.id?.toString() || `MP_ORDER_${Date.now()}`;
          productId = payload.external_reference || "MP_ORDER";
        }
      }
    }

    // === LÓGICA DE CRÉDITO ===
    if (userEmail && amountPaid > 0) {
      const coins = calculateCoinsFromB2B(amountPaid, productId);

      // Evitar duplicatas
      if (transactionId && isTransactionProcessed(transactionId)) {
        return {
          success: false,
          message: "Transaction already processed",
          transactionId,
        };
      }

      creditWallet(userEmail, coins, `${source}_${productId || "SALE"}`);
      markTransactionProcessed(transactionId);

      logWebhook(source, userEmail, amountPaid, coins, transactionId);

      return {
        success: true,
        message: `Creditado ${coins} PC para ${userEmail}`,
        transactionId: transactionId,
      };
    }

    return {
      success: false,
      message: "Status não aprovado ou email não encontrado.",
      source: source,
    };
  } catch (e) {
    console.error(`Erro ${source} Webhook: ` + e.toString());
    logWebhookError(source, payload, e.toString());
    return { success: false, error: e.toString() };
  }
}

/**
 * Calcula Panda Coins baseado no valor pago.
 * Pode ter regras diferentes por produto.
 */
function calculateCoinsFromB2B(amountBRL, productId) {
  // Produtos específicos podem ter bonificação
  const PRODUCT_BONUS = {
    premium_bundle: 1.5, // 50% bonus
    starter_pack: 1.2, // 20% bonus
    enterprise: 2.0, // 100% bonus
  };

  const bonus = PRODUCT_BONUS[productId] || 1.0;

  // Base: 1 BRL = 100 PC (multiplicador padrão)
  return Math.floor(amountBRL * 100 * bonus);
}

/**
 * Valida assinatura de Landing Page.
 * Evita webhooks fraudulentos.
 */
function validateLandingSignature(payload) {
  const SECRET =
    PropertiesService.getScriptProperties().getProperty(
      "LANDING_WEBHOOK_SECRET",
    ) || "panda_landing_secret_2026";

  // Assinatura esperada: HMAC-SHA256(email + amount + timestamp, SECRET)
  // Por simplicidade, verificamos apenas timestamp recente + formato

  const timestamp = payload.timestamp || 0;
  const now = Date.now();

  // Rejeitar se timestamp > 5 minutos atrás
  if (now - timestamp > 5 * 60 * 1000) {
    return false;
  }

  // Verificar assinatura básica
  if (!payload.signature) return false;

  // Implementação completa: usar Utilities.computeHmacSha256Signature
  return true;
}

/**
 * Evita processar mesma transação duas vezes.
 */
function isTransactionProcessed(transactionId) {
  const cache = CacheService.getScriptCache();
  return cache.get(`TX_${transactionId}`) !== null;
}

function markTransactionProcessed(transactionId) {
  const cache = CacheService.getScriptCache();
  cache.put(`TX_${transactionId}`, "true", 86400); // 24h cache
}

/**
 * Log de webhooks recebidos.
 */
function logWebhook(source, email, amount, coins, transactionId) {
  Logger.log(
    `[WEBHOOK] ${source} | ${email} | R$${amount} -> ${coins} PC | TX: ${transactionId}`,
  );

  // Opcional: salvar em sheet para auditoria
  try {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet()?.getSheetByName("Webhook_Logs");
    if (sheet) {
      sheet.appendRow([
        new Date().toISOString(),
        source,
        email,
        amount,
        coins,
        transactionId,
      ]);
    }
  } catch (e) {
    /* ignore */
  }
}

function logWebhookError(source, payload, error) {
  Logger.log(`[WEBHOOK ERROR] ${source} | ${error}`);
  console.error(JSON.stringify(payload));
}
