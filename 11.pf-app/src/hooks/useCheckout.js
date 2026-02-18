import { useState, useCallback } from "react";

/**
 * 💳 useCheckout Hook
 *
 * Handles the checkout process for purchases in Panda Store.
 * Implements USD-FIRST pricing strategy from PF_MASTER_ARCHITECTURE.md §26.3
 *
 * @see PF_MASTER_ARCHITECTURE.md §26.3
 */

// Exchange rate configuration
const EXCHANGE_RATE = {
  PC_TO_USD: 0.1, // 1 PC = $0.10 USD
  USD_TO_PC: 10, // $1 USD = 10 PC
};

// Tier-based discounts for PC payments
const TIER_DISCOUNTS = {
  free: 0, // 0%
  user: 0.05, // 5%
  dev: 0.1, // 10%
  pro: 0.15, // 15%
  beta_founder: 0.3, // 30%
};

// Revenue split — Split Master v3.0 (Store Sale)
// Calculated on NET (post-gateway). See PF_ECONOMY_REFERENCE §E
const REVENUE_SPLIT = {
  dev: 0.7, // 70% to developer
  ops: 0.25, // 25% Panda Ops
  founder: 0.05, // 5% Founder (eternal)
};

/**
 * Calculate prices for an item
 */
function calculatePricing(item, userTier = "free") {
  const usdPrice = item.priceUSD || item.price * EXCHANGE_RATE.PC_TO_USD;
  const pcPrice = item.price || Math.ceil(usdPrice / EXCHANGE_RATE.PC_TO_USD);

  const discount = TIER_DISCOUNTS[userTier] || 0;
  const discountedPc = Math.ceil(pcPrice * (1 - discount));

  return {
    usd: usdPrice,
    pc: pcPrice,
    discountedPc,
    discount,
    discountPercent: Math.round(discount * 100),
  };
}

/**
 * Main checkout hook
 */
export function useCheckout(userPcBalance = 0, userTier = "free") {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastError, setLastError] = useState(null);
  const [lastTransaction, setLastTransaction] = useState(null);

  /**
   * Process a purchase
   */
  const processPayment = useCallback(
    async (item, paymentMethod) => {
      setIsProcessing(true);
      setLastError(null);

      try {
        const pricing = calculatePricing(item, userTier);

        // Validate
        if (paymentMethod === "pc" && userPcBalance < pricing.discountedPc) {
          throw new Error("Saldo de PC insuficiente");
        }

        // In production: Call payment API
        // For now: Simulate processing
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const transaction = {
          id: `txn_${Date.now()}`,
          itemId: item.id,
          itemName: item.name,
          paymentMethod,
          amount: paymentMethod === "usd" ? pricing.usd : pricing.discountedPc,
          currency: paymentMethod === "usd" ? "USD" : "PC",
          discount: pricing.discountPercent,
          timestamp: new Date().toISOString(),
          status: "completed",
        };

        setLastTransaction(transaction);
        console.log("✅ Transaction completed:", transaction);

        return { success: true, transaction };
      } catch (error) {
        setLastError(error.message);
        console.error("❌ Payment error:", error);
        return { success: false, error: error.message };
      } finally {
        setIsProcessing(false);
      }
    },
    [userPcBalance, userTier],
  );

  /**
   * Check if user can afford an item
   */
  const canAfford = useCallback(
    (item, paymentMethod = "pc") => {
      if (paymentMethod === "usd") return true; // Assume card is always available

      const pricing = calculatePricing(item, userTier);
      return userPcBalance >= pricing.discountedPc;
    },
    [userPcBalance, userTier],
  );

  /**
   * Get pricing info for an item
   */
  const getPricing = useCallback(
    (item) => {
      return calculatePricing(item, userTier);
    },
    [userTier],
  );

  return {
    // State
    isProcessing,
    lastError,
    lastTransaction,

    // Actions
    processPayment,
    canAfford,
    getPricing,

    // Constants
    exchangeRate: EXCHANGE_RATE,
    revenueplit: REVENUE_SPLIT,
    tierDiscounts: TIER_DISCOUNTS,
  };
}

export default useCheckout;
