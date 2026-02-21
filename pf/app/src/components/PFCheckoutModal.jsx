import React, { useState, useEffect } from "react";
import "./PFCheckoutModal.css";

/**
 * 💳 Checkout Modal v3.0 — Real Stripe Integration
 *
 * Two modes:
 *   1. Store Item checkout (item prop) → USD payment via Stripe or PC debit
 *   2. PC Package purchase (package prop) → Stripe Checkout redirect
 *
 * Phase 1: Founder sells directly (no Connect/marketplace).
 * All payment methods registered: Card, Pix, Crypto (stub).
 *
 * @see PF_ECONOMY_REFERENCE.md §9.1
 * @see PF_STRIPE_GATEWAY.md §7
 */
export function CheckoutModal({
  isOpen,
  onClose,
  item,
  pcPackage,
  userPcBalance = 0,
  userTier = "free",
  onPurchaseComplete,
  processPayment,
  purchasePackage,
  isProcessing: externalProcessing,
}) {
  const [paymentMethod, setPaymentMethod] = useState("usd");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const processing = externalProcessing || isProcessing;

  // Tier discounts for PC payment (store items only)
  const tierDiscounts = {
    free: 0,
    user: 0.05,
    dev: 0.1,
    pro: 0.15,
    beta_founder: 0.3,
  };

  // ── Store Item pricing ──
  const discount = tierDiscounts[userTier] || 0;
  const usdPrice = item?.priceUSD || (item?.price || 0) * 0.01;
  const pcPrice = item?.price || Math.ceil(usdPrice * 100);
  const discountedPc = Math.ceil(pcPrice * (1 - discount));
  const hasSufficientPc = userPcBalance >= discountedPc;

  // ── PC Package pricing ──
  const pkgPrice = pcPackage?.usd || 0;
  const pkgPC = pcPackage?.pc || 0;

  // Determine which mode we're in
  const isPcPurchase = !!pcPackage;
  const displayName = isPcPurchase
    ? `${pkgPC.toLocaleString()} Panda Coins`
    : item?.name;
  const displayIcon = isPcPurchase ? "🪙" : item?.icon;
  const displayDesc = isPcPurchase
    ? `${pcPackage.badge} ${pcPackage.label} Package — ${pkgPC.toLocaleString()} PC`
    : item?.description;

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      if (isPcPurchase) {
        // ── PC Package Purchase → always Stripe ──
        if (purchasePackage) {
          const result = await purchasePackage(pcPackage);
          if (result.redirecting) return; // Page will redirect
          if (result.mock) {
            onPurchaseComplete?.({
              type: "pc_purchase",
              package: pcPackage,
              mock: true,
            });
            onClose();
          }
          if (!result.success) {
            throw new Error(result.error);
          }
        }
      } else if (paymentMethod === "pc") {
        // ── Store Item: PC debit ──
        if (!hasSufficientPc) {
          throw new Error("Saldo de PC insuficiente!");
        }

        if (processPayment) {
          const result = await processPayment(item, "pc");
          if (!result.success) {
            throw new Error(result.error);
          }
          onPurchaseComplete?.({
            type: "store_purchase",
            item,
            paymentMethod: "pc",
            transaction: result.transaction,
          });
          onClose();
        }
      } else {
        // ── Store Item: USD via Stripe ──
        if (processPayment) {
          const result = await processPayment(item, "usd");
          if (result.redirecting) return; // Page will redirect
          if (result.mock) {
            onPurchaseComplete?.({
              type: "store_purchase",
              item,
              paymentMethod: "usd",
              mock: true,
            });
            onClose();
          }
          if (!result.success) {
            throw new Error(result.error);
          }
        }
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || (!item && !pcPackage)) return null;

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="checkout-header">
          <h2>💳 Checkout</h2>
          <button className="checkout-close" onClick={onClose}>
            ×
          </button>
        </header>

        {/* Product Info */}
        <div className="checkout-product">
          <span className="product-icon">{displayIcon}</span>
          <div className="product-info">
            <h3 className="product-name">{displayName}</h3>
            <p className="product-desc">{displayDesc}</p>
            {item?.author && (
              <span className="product-author">por {item.author}</span>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="checkout-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Pricing Display */}
        <div className="checkout-pricing">
          <div className="price-main">
            <span className="price-currency">$</span>
            <span className="price-amount">
              {isPcPurchase ? pkgPrice.toFixed(2) : usdPrice.toFixed(2)}
            </span>
            <span className="price-label">USD</span>
          </div>
          {!isPcPurchase && (
            <div className="price-equivalent">
              = {pcPrice.toLocaleString()} PC
              {discount > 0 && paymentMethod === "pc" && (
                <span className="price-discount">
                  ({Math.round(discount * 100)}% desconto ={" "}
                  {discountedPc.toLocaleString()} PC)
                </span>
              )}
            </div>
          )}
          {isPcPurchase && pcPackage.discount > 0 && (
            <div className="price-equivalent">
              <span className="price-discount">
                {Math.round(pcPackage.discount * 100)}% bonus incluído
              </span>
            </div>
          )}
        </div>

        {/* Payment Methods — only for store items */}
        {!isPcPurchase && (
          <div className="checkout-methods">
            <h4>Método de Pagamento</h4>

            <label
              className={`method-option ${paymentMethod === "usd" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="payment"
                value="usd"
                checked={paymentMethod === "usd"}
                onChange={() => setPaymentMethod("usd")}
              />
              <span className="method-icon">💵</span>
              <div className="method-info">
                <span className="method-name">USD (Cartão/PIX)</span>
                <span className="method-value">${usdPrice.toFixed(2)}</span>
              </div>
            </label>

            <label
              className={`method-option ${paymentMethod === "pc" ? "selected" : ""} ${!hasSufficientPc ? "disabled" : ""}`}
            >
              <input
                type="radio"
                name="payment"
                value="pc"
                checked={paymentMethod === "pc"}
                onChange={() => hasSufficientPc && setPaymentMethod("pc")}
                disabled={!hasSufficientPc}
              />
              <span className="method-icon">🪙</span>
              <div className="method-info">
                <span className="method-name">Panda Coins (PC)</span>
                <span className="method-value">
                  {discountedPc.toLocaleString()} PC
                  {discount > 0 && (
                    <span className="badge-discount">
                      -{Math.round(discount * 100)}%
                    </span>
                  )}
                </span>
              </div>
              {!hasSufficientPc && (
                <span className="method-insufficient">
                  Saldo: {userPcBalance.toLocaleString()} PC
                </span>
              )}
            </label>
          </div>
        )}

        {/* PC Balance Display */}
        {!isPcPurchase && (
          <div className="checkout-balance">
            <span>Seu saldo:</span>
            <span className="balance-value">
              {userPcBalance.toLocaleString()} PC
            </span>
          </div>
        )}

        {/* Payment Info for PC Packages */}
        {isPcPurchase && (
          <div className="checkout-methods">
            <h4>Pagamento via Stripe</h4>
            <div className="method-option selected">
              <span className="method-icon">💳</span>
              <div className="method-info">
                <span className="method-name">Cartão de Crédito / Pix</span>
                <span className="method-value">${pkgPrice.toFixed(2)} USD</span>
              </div>
            </div>
            <p className="checkout-stripe-note">
              🔒 Você será redirecionado para o checkout seguro do Stripe
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="checkout-actions">
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={processing}
          >
            Cancelar
          </button>
          <button
            className="btn-confirm"
            onClick={handleCheckout}
            disabled={
              processing ||
              (!isPcPurchase && paymentMethod === "pc" && !hasSufficientPc)
            }
          >
            {processing
              ? "⏳ Processando..."
              : isPcPurchase
                ? `Comprar ${pkgPC.toLocaleString()} PC — $${pkgPrice.toFixed(2)}`
                : paymentMethod === "usd"
                  ? `Pagar $${usdPrice.toFixed(2)}`
                  : `Pagar ${discountedPc.toLocaleString()} PC`}
          </button>
        </div>

        {/* Footer */}
        <footer className="checkout-footer">
          <span>🔒 Pagamento seguro via Stripe</span>
          <span>📝 Refund em até 7 dias</span>
        </footer>
      </div>
    </div>
  );
}

export default CheckoutModal;
