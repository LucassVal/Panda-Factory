/**
 * PANDA CORE - ORACLE.js
 * Responsável por cotações de moedas e commodities.
 *
 * @version 2.0.0
 *
 * COTAÇÕES SUPORTADAS:
 * - USD/BRL (Dólar)
 * - XAU/USD (Ouro em onça troy)
 * - BTC/USD (Bitcoin)
 * - ETH/USD (Ethereum)
 */

// ============================================================================
// USD/BRL
// ============================================================================

/**
 * Obtém a cotação atual do Dólar (USD) para Real (BRL).
 * Usa CacheService para não gastar cota de chamadas (atualiza a cada 1h).
 */
function getUsdRate() {
  const cache = CacheService.getScriptCache();
  const cachedRate = cache.get("USD_BRL_RATE");
  if (cachedRate) return parseFloat(cachedRate);

  try {
    const response = UrlFetchApp.fetch(
      "https://economia.awesomeapi.com.br/last/USD-BRL",
    );
    const json = JSON.parse(response.getContentText());
    const rate = parseFloat(json.USDBRL.bid);

    cache.put("USD_BRL_RATE", rate.toString(), 3600); // 1h
    return rate;
  } catch (e) {
    console.error("Erro ao buscar cotação USD: " + e.toString());
    return 6.0; // Fallback
  }
}

// ============================================================================
// XAU/USD (OURO)
// ============================================================================

/**
 * Obtém a cotação do Ouro (XAU) em USD por onça troy.
 * Usa API gratuita goldapi.io ou fallback para valor fixo.
 */
function getXauRate() {
  const cache = CacheService.getScriptCache();
  const cachedRate = cache.get("XAU_USD_RATE");
  if (cachedRate) return parseFloat(cachedRate);

  try {
    // Opção 1: API gratuita (limitada)
    // const response = UrlFetchApp.fetch("https://api.goldapi.io/v1/XAU/USD", {
    //   headers: { "x-access-token": "goldapi_key" }
    // });

    // Opção 2: Usar awesomeapi (suporta XAU)
    const response = UrlFetchApp.fetch(
      "https://economia.awesomeapi.com.br/last/XAU-USD",
    );
    const json = JSON.parse(response.getContentText());
    const rate = parseFloat(json.XAUUSD?.bid || json["XAU-USD"]?.bid || 2650);

    cache.put("XAU_USD_RATE", rate.toString(), 3600); // 1h
    return rate;
  } catch (e) {
    console.error("Erro ao buscar cotação XAU: " + e.toString());
    return 2650; // Fallback ~ preço médio do ouro Jan/2026
  }
}

/**
 * Converte valor em ouro (XAU) para Panda Coins.
 * Útil para precificação de assets baseados em ouro.
 */
function xauToPandaCoins(xauAmount) {
  const xauUsd = getXauRate();
  const usdBrl = getUsdRate();
  const valueInBrl = xauAmount * xauUsd * usdBrl;
  return Math.floor(valueInBrl * 100); // 1 BRL = 100 PC
}

// ============================================================================
// CRYPTO (BTC/ETH)
// ============================================================================

function getBtcRate() {
  const cache = CacheService.getScriptCache();
  const cachedRate = cache.get("BTC_USD_RATE");
  if (cachedRate) return parseFloat(cachedRate);

  try {
    const response = UrlFetchApp.fetch(
      "https://economia.awesomeapi.com.br/last/BTC-USD",
    );
    const json = JSON.parse(response.getContentText());
    const rate = parseFloat(json.BTCUSD?.bid || 95000);

    cache.put("BTC_USD_RATE", rate.toString(), 300); // 5min (crypto é volátil)
    return rate;
  } catch (e) {
    return 95000; // Fallback
  }
}

function getEthRate() {
  const cache = CacheService.getScriptCache();
  const cachedRate = cache.get("ETH_USD_RATE");
  if (cachedRate) return parseFloat(cachedRate);

  try {
    const response = UrlFetchApp.fetch(
      "https://economia.awesomeapi.com.br/last/ETH-USD",
    );
    const json = JSON.parse(response.getContentText());
    const rate = parseFloat(json.ETHUSD?.bid || 3200);

    cache.put("ETH_USD_RATE", rate.toString(), 300); // 5min
    return rate;
  } catch (e) {
    return 3200; // Fallback
  }
}

// ============================================================================
// ALL RATES (Para dashboard)
// ============================================================================

function getAllRates() {
  return {
    USD_BRL: getUsdRate(),
    XAU_USD: getXauRate(),
    BTC_USD: getBtcRate(),
    ETH_USD: getEthRate(),
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// PANDA COIN PRICING
// ============================================================================

/**
 * Calcula o preço final em Panda Coins baseado no custo da API em Dólar.
 * Fórmula: (CustoUSD * CotaçãoBRL) * (1 + Margem)
 */
function calculatePandaPrice(costInUsd) {
  const rate = getUsdRate();
  const margin = 1.5; // 2.5x multiplier
  const rawCostBrl = costInUsd * rate;
  const finalPrice = rawCostBrl * (1 + margin);
  return parseFloat(finalPrice.toFixed(4));
}
