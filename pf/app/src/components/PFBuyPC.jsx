import React, { useState } from "react";
import { CheckoutModal } from "./PFCheckoutModal";
import { PC_PACKAGES } from "../hooks/useCheckout";
import "./PFBuyPC.css";

/**
 * 🪙 PFBuyPC — Panda Coin Purchase Panel
 *
 * Phase 1: Founder sells PC packages directly via Stripe.
 * All payment methods registered (Card, Pix, Crypto stub).
 * Users select a package tier and are redirected to Stripe Checkout.
 *
 * @see PF_ECONOMY_REFERENCE.md §9.1.B
 * @see PF_STRIPE_GATEWAY.md §7
 */
export default function PFBuyPC({
  isOpen,
  onClose,
  purchasePackage,
  isProcessing,
  userBalance = 0,
}) {
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  const handleSelectPackage = (pkg) => {
    setSelectedPkg(pkg);
    setShowCheckout(true);
  };

  const pricePerPC = (pkg) => {
    const effectivePrice = pkg.usd / pkg.pc;
    return (effectivePrice * 1000).toFixed(1); // price per 1000 PC
  };

  return (
    <>
      <div className="buypc-overlay" onClick={onClose}>
        <div className="buypc-panel" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <header className="buypc-header">
            <div className="buypc-header-left">
              <h2>🪙 Comprar Panda Coins</h2>
              <p className="buypc-subtitle">
                Escolha um pacote para carregar sua carteira
              </p>
            </div>
            <button className="buypc-close" onClick={onClose}>
              ×
            </button>
          </header>

          {/* Current Balance */}
          <div className="buypc-balance">
            <span className="buypc-balance-label">Saldo atual:</span>
            <span className="buypc-balance-value">
              {userBalance.toLocaleString()} PC
            </span>
          </div>

          {/* Package Grid */}
          <div className="buypc-grid">
            {PC_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`buypc-card ${pkg.id === "pro" ? "popular" : ""} ${pkg.id === "partner" ? "partner" : ""}`}
                onClick={() => handleSelectPackage(pkg)}
              >
                {pkg.id === "pro" && (
                  <span className="buypc-popular-badge">⭐ Popular</span>
                )}
                {pkg.discount > 0 && (
                  <span className="buypc-discount-badge">
                    -{Math.round(pkg.discount * 100)}%
                  </span>
                )}

                <div className="buypc-card-icon">{pkg.badge}</div>
                <h3 className="buypc-card-label">{pkg.label}</h3>

                <div className="buypc-card-pc">
                  {pkg.pc.toLocaleString()} <small>PC</small>
                </div>

                <div className="buypc-card-price">
                  ${pkg.usd.toLocaleString()}
                  <small> USD</small>
                </div>

                {pkg.discount > 0 && (
                  <div className="buypc-card-savings">
                    ${pricePerPC(pkg)}/1K PC
                  </div>
                )}

                <button className="buypc-card-btn" disabled={isProcessing}>
                  {isProcessing ? "⏳" : "Comprar"}
                </button>
              </div>
            ))}
          </div>

          {/* Payment Methods Info */}
          <div className="buypc-methods">
            <span>💳 Cartão de Crédito</span>
            <span>🏦 Pix</span>
            <span className="buypc-method-soon" title="Em breve">
              🪙 Crypto (em breve)
            </span>
          </div>

          {/* Footer */}
          <footer className="buypc-footer">
            <span>🔒 Pagamento seguro via Stripe</span>
            <span>🐼 Phase 1 — Founder Direct Sales</span>
          </footer>
        </div>
      </div>

      {/* Checkout Modal for selected package */}
      {showCheckout && selectedPkg && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => {
            setShowCheckout(false);
            setSelectedPkg(null);
          }}
          pcPackage={selectedPkg}
          purchasePackage={purchasePackage}
          isProcessing={isProcessing}
          onPurchaseComplete={() => {
            setShowCheckout(false);
            setSelectedPkg(null);
            onClose();
          }}
        />
      )}
    </>
  );
}
