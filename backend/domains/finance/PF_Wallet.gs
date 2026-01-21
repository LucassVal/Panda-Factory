/**
 * PANDA CORE - LEDGER.js
 * Sistema de Carteira com débito, crédito e auditoria.
 *
 * @version 1.0.0
 */

/**
 * Obtém o saldo do usuário em Panda Coins.
 */
function getUserBalance(userId) {
  const userProps = PropertiesService.getUserProperties();
  const balance = userProps.getProperty("PANDA_WALLET_" + userId);

  // Se não existe, cria com bônus inicial
  if (balance === null) {
    creditWallet(userId, CONFIG.ECONOMY.INITIAL_BONUS, "BONUS_INICIAL");
    return CONFIG.ECONOMY.INITIAL_BONUS;
  }

  return parseFloat(balance);
}

/**
 * Debita um valor da carteira se houver saldo suficiente.
 * @returns {Object} {success, message, newBalance, amountCharged}
 */
function debitWallet(userId, amountPC, serviceType) {
  const currentBalance = getUserBalance(userId);

  if (currentBalance < amountPC) {
    return {
      success: false,
      message: `Saldo Insuficiente. Necessário: ${amountPC} PC. Atual: ${currentBalance} PC.`,
      newBalance: currentBalance,
    };
  }

  const newBalance = parseFloat((currentBalance - amountPC).toFixed(4));

  // Atualiza saldo
  PropertiesService.getUserProperties().setProperty(
    "PANDA_WALLET_" + userId,
    newBalance.toString(),
  );

  // LOG de Auditoria
  logTransaction(userId, "DEBIT", amountPC, newBalance, serviceType);

  return {
    success: true,
    newBalance: newBalance,
    amountCharged: amountPC,
  };
}

/**
 * Adiciona saldo (Compra de créditos ou bônus).
 */
function creditWallet(userId, amountPC, reason) {
  const currentBalance = getUserBalance(userId) || 0;
  const newBalance = parseFloat((currentBalance + amountPC).toFixed(4));

  PropertiesService.getUserProperties().setProperty(
    "PANDA_WALLET_" + userId,
    newBalance.toString(),
  );

  logTransaction(userId, "CREDIT", amountPC, newBalance, reason || "RECARGA");
  return newBalance;
}

/**
 * Log de transações para auditoria completa.
 */
function logTransaction(userId, type, amount, finalBalance, description) {
  const log = {
    timestamp: new Date().toISOString(),
    user: userId,
    type: type,
    amount: amount,
    balance: finalBalance,
    description: description,
  };

  console.log(
    `[LEDGER] ${log.timestamp} | ${userId} | ${type}: ${amount} PC | SALDO: ${finalBalance} | ${description}`,
  );

  // TODO: Salvar no Drive para persistência (DriveDB.js)
}

/**
 * Retorna o extrato de transações do usuário.
 */
function getStatement(userId, limit) {
  // TODO: Implementar leitura do Drive
  return { message: "Extrato em desenvolvimento", transactions: [] };
}
