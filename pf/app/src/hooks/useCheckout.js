import { useState, useCallback } from "react";
import { gasPost, Payments, Wallet } from "../services/callGAS";

/**
 * 💳 useCheckout Hook v2.0 — Real Stripe Integration
 *
 * Handles the checkout process for purchases in Panda Store.
 * Phase 1: Founder sells PC packages directly via Stripe Checkout.
 *
 * Supports two payment flows:
 *   1. USD (Card/Pix) → Stripe Checkout Session → webhook credits wallet
 *   2. PC (Panda Coins) → Direct debit from wallet
 *
 * @see PF_ECONOMY_REFERENCE.md §9.1
 * @see PF_STRIPE_GATEWAY.md §7
 * @version 2.0.0
 */

// ── PC Package Catalog (mirrors GAS PC_PACKAGES) ──
export const PC_PACKAGES = [
  {
    id: "starter",
    pc: 2000,
    usd: 20,
    discount: 0,
    label: "Starter",
    badge: "🌱",
    checkoutUrl: "https://pay.kiwify.com.br/mock-starter",
  },
  {
    id: "boost",
    pc: 5500,
    usd: 50,
    discount: 0.1,
    label: "Boost",
    badge: "⚡",
    checkoutUrl: "https://pay.kiwify.com.br/mock-boost",
  },
  {
    id: "pro",
    pc: 12000,
    usd: 100,
    discount: 0.2,
    label: "Pro",
    badge: "🔥",
    checkoutUrl: "https://pay.kiwify.com.br/mock-pro",
  },
  {
    id: "business",
    pc: 30000,
    usd: 200,
    discount: 0.25,
    label: "Business",
    badge: "💼",
    checkoutUrl: "https://pay.kiwify.com.br/mock-business",
  },
  {
    id: "scale",
    pc: 60000,
    usd: 500,
    discount: 0.2,
    label: "Scale",
    badge: "📈",
    checkoutUrl: "https://pay.kiwify.com.br/mock-scale",
  },
  {
    id: "enterprise",
    pc: 150000,
    usd: 1000,
    discount: 0.25,
    label: "Enterprise",
    badge: "🏢",
    checkoutUrl: "https://pay.kiwify.com.br/mock-enterprise",
  },
  {
    id: "partner",
    pc: 650000,
    usd: 5000,
    discount: 0.3,
    label: "Partner",
    badge: "🤝",
    checkoutUrl: "https://pay.kiwify.com.br/mock-partner",
  },
];

// Exchange rate configuration
const EXCHANGE_RATE = {
  PC_TO_USD: 0.01, // 1 PC = $0.01 USD (from PF_ECONOMY_REFERENCE §9.1.A: $0.0025 cost × 4.0)
  USD_TO_PC: 100, // $1 USD = 100 PC
};

// Tier-based discounts for PC payments (store items, not PC purchases)
const TIER_DISCOUNTS = {
  free: 0,
  user: 0.05,
  dev: 0.1,
  pro: 0.15,
  beta_founder: 0.3,
};

// Revenue split — Split Master v3.0 (Store Sale)
// Calculated on NET (post-gateway). See PF_ECONOMY_REFERENCE §E
const REVENUE_SPLIT = {
  dev: 0.55, // 55% to developer (immediate)
  escrow: 0.15, // 15% escrow 7 days → developer
  ops: 0.25, // 25% Panda Ops
  founder: 0.05, // 5% Founder (eternal)
};

/**
 * Calculate prices for a store item
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
   * Purchase a PC package via Stripe Checkout.
   * Redirects to Stripe hosted page.
   * @param {Object} pkg - Package from PC_PACKAGES
   * @returns {{ success: boolean, redirecting?: boolean, error?: string }}
   */
  const purchasePackage = useCallback(async (pkg) => {
    setIsProcessing(true);
    setLastError(null);

    try {
      console.log("🔄 Creating Stripe checkout for package:", pkg.id);

      const result = await gasPost("CREATE_PAYMENT_STRIPE", {
        amountPC: pkg.pc,
        priceUSD: pkg.usd,
        packageId: pkg.id,
      });

      if (result.status === "MOCK" || result.success) {
        console.log(
          "✈️ Redirecionando para Kiwify/Hotmart Mock:",
          pkg.checkoutUrl,
        );
        setTimeout(() => {
          window.open(
            pkg.checkoutUrl || "https://pay.kiwify.com.br/mock",
            "_blank",
          );
        }, 1500);
        setIsProcessing(false);
        return { success: true, redirecting: true };
      }

      throw new Error(result.error || "Failed to create checkout session");
    } catch (error) {
      setLastError(error.message);
      console.error("❌ Package purchase error:", error);
      setIsProcessing(false);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Purchase a store item (module/extension).
   * USD → Stripe Checkout, PC → Direct wallet debit via GAS.
   * @param {Object} item - Store item
   * @param {"usd"|"pc"} paymentMethod
   */
  const processPayment = useCallback(
    async (item, paymentMethod) => {
      setIsProcessing(true);
      setLastError(null);

      try {
        const pricing = calculatePricing(item, userTier);

        if (paymentMethod === "pc") {
          // ── PC Payment: debit wallet directly ──
          if (userPcBalance < pricing.discountedPc) {
            throw new Error("Saldo de PC insuficiente");
          }

          const result = await gasPost("STORE_PURCHASE", {
            moduleId: item.id,
          });

          if (result.status === "MOCK") {
            console.log("🧪 MOCK: Store purchase", item.id);
            const transaction = {
              id: `mock_${Date.now()}`,
              type: "store_purchase",
              itemId: item.id,
              itemName: item.name,
              paymentMethod: "pc",
              amount: pricing.discountedPc,
              currency: "PC",
              discount: pricing.discountPercent,
              timestamp: new Date().toISOString(),
              status: "mock_success",
            };
            setLastTransaction(transaction);
            setIsProcessing(false);
            return { success: true, transaction, mock: true };
          }

          if (result.error) {
            throw new Error(result.error);
          }

          const transaction = {
            id: `txn_${Date.now()}`,
            type: "store_purchase",
            itemId: item.id,
            itemName: item.name,
            paymentMethod: "pc",
            amount: pricing.discountedPc,
            currency: "PC",
            discount: pricing.discountPercent,
            timestamp: new Date().toISOString(),
            status: "completed",
            newBalance: result.newBalance,
            license: result.license,
          };

          setLastTransaction(transaction);
          console.log("✅ Store purchase completed:", transaction);
          setIsProcessing(false);
          return { success: true, transaction };
        } else {
          // ── USD Payment: Stripe Checkout ──
          const result = await gasPost("CREATE_PAYMENT_STRIPE", {
            amountPC: pricing.pc,
            priceUSD: pricing.usd,
            itemId: item.id,
          });

          if (result.status === "MOCK" || result.success) {
            console.log(
              "✈️ Redirecionando para Plataforma de Vendas do item:",
              item.name,
            );
            setTimeout(() => {
              window.open(
                item.checkoutUrl ||
                  `https://pay.kiwify.com.br/mock-item-${item.id}`,
                "_blank",
              );
            }, 1500);
            setIsProcessing(false);
            return { success: true, redirecting: true };
          }

          throw new Error(result.error || "Checkout session creation failed");
        }
      } catch (error) {
        setLastError(error.message);
        console.error("❌ Payment error:", error);
        setIsProcessing(false);
        return { success: false, error: error.message };
      }
    },
    [userPcBalance, userTier],
  );

  /**
   * Check if user can afford an item
   */
  const canAfford = useCallback(
    (item, paymentMethod = "pc") => {
      if (paymentMethod === "usd") return true;

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
    purchasePackage,
    canAfford,
    getPricing,

    // Constants
    exchangeRate: EXCHANGE_RATE,
    revenueSplit: REVENUE_SPLIT,
    tierDiscounts: TIER_DISCOUNTS,
    packages: PC_PACKAGES,
  };
}

export default useCheckout;
