/**
 * PANDA CORE - ORACLE.js
 * Responsável pela cotação USD/BRL e cálculo de preços dinâmicos.
 *
 * @version 1.0.0
 */

/**
 * Obtém a cotação atual do Dólar (USD) para Real (BRL).
 * Usa CacheService para não gastar cota de chamadas (atualiza a cada 1h).
 */
function getUsdRate() {
  // Verifica cache primeiro
  if (typeof CacheService !== "undefined") {
    const cache = CacheService.getScriptCache();
    const cachedRate = cache.get("USD_BRL_RATE");
    if (cachedRate) {
      return parseFloat(cachedRate);
    }
  }

  try {
    const response = UrlFetchApp.fetch(CONFIG.ENDPOINTS.USD_RATE);
    const json = JSON.parse(response.getContentText());
    const rate = parseFloat(json.USDBRL.bid);

    // Salva no cache por 3600 segundos (1 hora)
    if (typeof CacheService !== "undefined") {
      CacheService.getScriptCache().put("USD_BRL_RATE", rate.toString(), 3600);
    }
    return rate;
  } catch (e) {
    console.error("Erro ao buscar cotação USD: " + e.toString());
    return CONFIG.ECONOMY.FIXED_USD_FALLBACK;
  }
}

/**
 * Calcula o preço final em Panda Coins baseado no custo da API em Dólar.
 * Fórmula: (CustoUSD * CotaçãoBRL) * (1 + Margem)
 */
function calculatePandaPrice(costInUsd) {
  const rate = getUsdRate();
  const rawCostBrl = costInUsd * rate;
  const finalPrice = rawCostBrl * (1 + CONFIG.ECONOMY.MARGIN_PERCENT);
  return parseFloat(finalPrice.toFixed(4));
}
