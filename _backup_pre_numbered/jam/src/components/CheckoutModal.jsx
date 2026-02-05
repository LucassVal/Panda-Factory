import React, { useState, useEffect } from "react";
import "./CheckoutModal.css";

/**
 * 💳 Checkout Modal - USD-FIRST Pricing
 *
 * Implements the USD-FIRST pricing strategy from PF_MASTER_ARCHITECTURE.md §26.3:
 * - Display price in USD first
 * - Show PC equivalent
 * - Optional PC discount (5-30% based on tier)
 *
 * @see PF_MASTER_ARCHITECTURE.md §26.3
 */
export function CheckoutModal({
  isOpen,
  onClose,
  item,
  userPcBalance = 0,
  userTier = "free",
}) {
  const [paymentMethod, setPaymentMethod] = useState("usd");
  const [isProcessing, setIsProcessing] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(0.1); // 1 PC = $0.10 USD

  // Tier discounts for PC payment
  const tierDiscounts = {
    free: 0,
    user: 0.05, // 5%
    dev: 0.1, // 10%
    pro: 0.15, // 15%
    beta_founder: 0.3, // 30%
  };

  const discount = tierDiscounts[userTier] || 0;
  const usdPrice = item?.priceUSD || item?.price * exchangeRate || 0;
  const pcPrice = item?.price || Math.ceil(usdPrice / exchangeRate);
  const discountedPc = Math.ceil(pcPrice * (1 - discount));
  const hasSufficientPc = userPcBalance >= discountedPc;

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (paymentMethod === "pc" && !hasSufficientPc) {
        alert("Saldo de PC insuficiente!");
        setIsProcessing(false);
        return;
      }

      // Success
      console.log("✅ PURCHASE:", {
        item: item.name,
        method: paymentMethod,
        amount: paymentMethod === "usd" ? usdPrice : discountedPc,
      });

      alert(`✅ Compra realizada!\n\n${item.name} foi adicionado à sua conta.`);
      onClose();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !item) return null;

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
          <span className="product-icon">{item.icon}</span>
          <div className="product-info">
            <h3 className="product-name">{item.name}</h3>
            <p className="product-desc">{item.description}</p>
            <span className="product-author">por {item.author}</span>
          </div>
        </div>

        {/* Pricing Display - USD FIRST */}
        <div className="checkout-pricing">
          <div className="price-main">
            <span className="price-currency">$</span>
            <span className="price-amount">{usdPrice.toFixed(2)}</span>
            <span className="price-label">USD</span>
          </div>
          <div className="price-equivalent">
            = {pcPrice.toLocaleString()} PC
            {discount > 0 && paymentMethod === "pc" && (
              <span className="price-discount">
                ({Math.round(discount * 100)}% desconto ={" "}
                {discountedPc.toLocaleString()} PC)
              </span>
            )}
          </div>
        </div>

        {/* Payment Methods */}
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

        {/* PC Balance Display */}
        <div className="checkout-balance">
          <span>Seu saldo:</span>
          <span className="balance-value">
            {userPcBalance.toLocaleString()} PC
          </span>
        </div>

        {/* Action Buttons */}
        <div className="checkout-actions">
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button
            className="btn-confirm"
            onClick={handleCheckout}
            disabled={
              isProcessing || (paymentMethod === "pc" && !hasSufficientPc)
            }
          >
            {isProcessing
              ? "⏳ Processando..."
              : `Pagar ${paymentMethod === "usd" ? `$${usdPrice.toFixed(2)}` : `${discountedPc} PC`}`}
          </button>
        </div>

        {/* Footer */}
        <footer className="checkout-footer">
          <span>🔒 Pagamento seguro via Stripe/PIX</span>
          <span>📝 Você pode recorrer/refund em até 7 dias</span>
        </footer>
      </div>
    </div>
  );
}

export default CheckoutModal;
