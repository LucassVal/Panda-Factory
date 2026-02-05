/**
 * 🐼 PF_Sales.gs
 * Domain: Store
 * Responsabilidade: Processamento de Vendas e Comissões de Módulos
 *
 * Split Oficial (Store/Compute):
 * - 52% Dev/Host
 * - 25% Panda Educação
 * - 15% Panda Operacional
 * - 5%  Founder
 * - 3%  Gateway/GAS
 */

const SALES_SPLIT = {
  devHost: 0.52,
  education: 0.25,
  ops: 0.15,
  founder: 0.05,
  gateway: 0.03,
};

function processModuleSale(saleData) {
  const { pricePC, sellerId, buyerId, moduleId } = saleData;

  // Calculate split
  const split = {
    devHost: Math.floor(pricePC * SALES_SPLIT.devHost),
    education: Math.floor(pricePC * SALES_SPLIT.education),
    ops: Math.floor(pricePC * SALES_SPLIT.ops),
    founder: Math.floor(pricePC * SALES_SPLIT.founder),
    gateway: Math.floor(pricePC * SALES_SPLIT.gateway),
  };

  // Credit seller (Dev)
  creditWallet(sellerId, split.devHost, `VENDA_MODULO:${moduleId}`);

  // Log transaction
  console.log(
    `[SALE] Module ${moduleId}: ${pricePC} PC → Dev:${split.devHost} Edu:${split.education} Ops:${split.ops}`,
  );

  return {
    success: true,
    pricePC,
    split,
    timestamp: new Date().toISOString(),
  };
}
