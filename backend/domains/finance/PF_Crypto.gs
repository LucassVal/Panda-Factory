/**
 * PANDA CORE - CRYPTO_SERVICE.js
 * Preparação para "Chain Blocks" - Gateway Cripto.
 * Versão Inicial: Gerenciamento de Endereços e Listeners (Mock).
 *
 * @version 1.0.0
 * @chain Solana (Principal para micro-pagamentos)
 */

const CRYPTO_CONFIG = {
  // Endereço da Wallet do Sistema (Cold Wallet de Recebimento)
  TREASURY_WALLET: "PandaFabrics_Solana_Address_Placeholder",
  USDC_MINT: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
};

/**
 * Gera uma "Intenção de Pagamento" Cripto.
 * No futuro, isso criará um QR Code para Smart Contract.
 */
function createCryptoPaymentIntent(userId, amountPC, priceUSDC) {
  // Reference ID para rastrear na blockchain
  const orderId = Utilities.getUuid();

  return {
    success: true,
    provider: "SOLANA_NATIVE",
    walletAddress: CRYPTO_CONFIG.TREASURY_WALLET,
    amountUSDC: priceUSDC,
    memo: `PANDA-${userId}-${orderId}`, // Memo para reconciliação on-chain
    qrCodeData: `solana:${CRYPTO_CONFIG.TREASURY_WALLET}?amount=${priceUSDC}&label=PandaFabrics&message=${orderId}`,
  };
}

/**
 * (Futuro) Hook que será chamado por um Oracle (ex: Helius/Alchemy)
 * quando uma transação for confirmada na blockchain.
 */
function processOnChainEvent(payload) {
  // Exemplo de payload vindo de um Indexer externo
  // { signature: "...", sender: "...", amount: 10.0, memo: "PANDA-user@email.com-..." }

  const memo = payload.memo; // Parse Memo para achar UserID
  if (memo && memo.startsWith("PANDA-")) {
    const parts = memo.split("-");
    const userId = parts[1];
    // Calcular PC baseado no valor recebido
    const amountPC = payload.amount * 1000; // 1 USDC = 1000 PC (Exemplo)

    creditWallet(
      userId,
      amountPC,
      `CRYPTO_DEPOSIT_${payload.signature.substring(0, 8)}`,
    );
    return "OK - Block Confirmed";
  }

  return "Ignored";
}
