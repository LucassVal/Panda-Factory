/**
 * PANDA CORE - PAYMENT_SERVICE.js
 * Integração com PagSeguro para venda de Panda Coins.
 *
 * @version 1.0.0
 */

const PAGSEGURO_CONFIG = {
  EMAIL: 'lucas@pandafabrics.io', // Placeholder
  TOKEN_PROPERTY: 'PAGSEGURO_TOKEN', // Salvar em ScriptProperties
  ENV: 'SANDBOX', // 'PRODUCTION' ou 'SANDBOX'
  URLS: {
    SANDBOX: 'https://ws.sandbox.pagseguro.uol.com.br/v2',
    PRODUCTION: 'https://ws.pagseguro.uol.com.br/v2'
  }
};

/**
 * Gera URL de Checkout para compra de Panda Coins.
 * @param {string} userId - ID do usuário (email)
 * @param {number} amountPC - Quantidade de Panda Coins
 * @param {number} priceBRL - Preço em Reais
 */
function createCheckout(userId, amountPC, priceBRL) {
  const token = PropertiesService.getScriptProperties().getProperty(PAGSEGURO_CONFIG.TOKEN_PROPERTY);
  if (!token) throw new Error("PAGSEGURO_TOKEN não configurado.");

  const baseUrl = PAGSEGURO_CONFIG.ENV === 'PRODUCTION' ? PAGSEGURO_CONFIG.URLS.PRODUCTION : PAGSEGURO_CONFIG.URLS.SANDBOX;
  
  const payload = {
    currency: 'BRL',
    itemId1: 'PC_PACK_' + amountPC,
    itemDescription1: `${amountPC} Panda Coins (Energy)`,
    itemAmount1: priceBRL.toFixed(2),
    itemQuantity1: '1',
    reference: userId, // Reference = UserID para crédito automático
    senderName: 'Panda User', // Opcional: pegar do perfil
    senderEmail: userId // Assumindo userId = email
  };

  // Converte payload para x-www-form-urlencoded
  const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');

  const options = {
    method: 'post',
    payload: formBody,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  };

  try {
    const url = `${baseUrl}/checkout?email=${encodeURIComponent(PAGSEGURO_CONFIG.EMAIL)}&token=${token}`;
    const response = UrlFetchApp.fetch(url, options);
    const xml = response.getContentText();
    
    // Extrai o código do checkout do XML (Simples regex para evitar parsing pesado)
    const codeMatch = xml.match(/<code>(.*?)<\/code>/);
    
    if (codeMatch && codeMatch[1]) {
      const code = codeMatch[1];
      const checkoutBase = PAGSEGURO_CONFIG.ENV === 'PRODUCTION' ? 
        'https://pagseguro.uol.com.br/v2/checkout/payment.html' : 
        'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html';
      
      return {
        success: true,
        checkoutUrl: `${checkoutBase}?code=${code}`,
        code: code
      };
    } else {
      throw new Error("Não foi possível gerar o código de checkout.");
    }

  } catch (e) {
    Logger.log("Erro Checkout: " + e.toString());
    return { success: false, error: e.toString() };
  }
}

/**
 * Recebe notificação do PagSeguro (Webhook) e credita a carteira.
 * @param {string} notificationCode - Código recebido no POST
 */
function processPaymentNotification(notificationCode) {
  const token = PropertiesService.getScriptProperties().getProperty(PAGSEGURO_CONFIG.TOKEN_PROPERTY);
  const baseUrl = PAGSEGURO_CONFIG.ENV === 'PRODUCTION' ? PAGSEGURO_CONFIG.URLS.PRODUCTION : PAGSEGURO_CONFIG.URLS.SANDBOX;
  
  const url = `${baseUrl}/transactions/notifications/${notificationCode}?email=${encodeURIComponent(PAGSEGURO_CONFIG.EMAIL)}&token=${token}`;
  
  try {
    const response = UrlFetchApp.fetch(url);
    const xml = response.getContentText();
    
    // Parse XML simples
    const statusMatch = xml.match(/<status>(.*?)<\/status>/);
    const referenceMatch = xml.match(/<reference>(.*?)<\/reference>/); // UserID
    const grossAmountMatch = xml.match(/<grossAmount>(.*?)<\/grossAmount>/);
    
    // Status 3 = Paga, 4 = Disponível
    if (statusMatch && (statusMatch[1] === '3' || statusMatch[1] === '4')) {
      const userId = referenceMatch ? referenceMatch[1] : null;
      const amountPaid = grossAmountMatch ? parseFloat(grossAmountMatch[1]) : 0;
      
      if (userId && amountPaid > 0) {
        // LÓGICA DE CONVERSÃO BRL -> PC
        // Exemplo: R$ 1,00 = 100 PC (ajustar conforme pricing)
        // Ler do CONFIG global se possível
        const conversionRate = 100; // 1 BRL = 100 PC
        const pandaCoins = amountPaid * conversionRate;
        
        // Credita usando Ledger.js
        creditWallet(userId, pandaCoins, "COMPRA_PAGSEGURO_" + notificationCode);
        
        return "OK - Creditado";
      }
    }
    
    return "OK - Processado (Sem Crédito)";
    
  } catch (e) {
    Logger.log("Erro Notification: " + e.toString());
    return "Erro: " + e.toString();
  }
}
