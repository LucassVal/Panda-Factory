import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "./PFLoginModal.css";

/**
 * LoginModal - Authentication modal with Google + Email/Password + Service Plans
 */
export function LoginModal({ isOpen, onClose }) {
  const [method, setMethod] = useState(null); // null | 'google' | 'email'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginWithGoogle, loginWithEmail, error, clearError } = useAuth();

  if (!isOpen) return null;

  const PLANS = [
    {
      id: "free",
      name: "Free",
      tokens: "1 Mi Tokens Gemini Pro",
      images: "1",
      price: "0",
      color: "#9e9e9e",
    },
    {
      id: "start",
      name: "Start",
      tokens: "1 Mi Tokens Gemini Pro",
      images: "5",
      price: "19.90",
      color: "#00bcd4",
      popular: false,
    },
    {
      id: "creator",
      name: "Creator",
      tokens: "1 Mi Tokens Gemini Pro",
      images: "15",
      price: "49.90",
      color: "#673ab7",
      popular: true,
      video: "1/day",
    },
    {
      id: "agency",
      name: "Agency",
      tokens: "1 Mi Tokens Gemini Pro",
      images: "30",
      price: "97.00",
      color: "#f44336",
      popular: false,
      video: "3/day",
    },
  ];

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      // Error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await loginWithEmail(email, password);
      onClose();
    } catch (err) {
      // Error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setMethod(null);
    clearError();
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-close" onClick={onClose}>
          ✕
        </button>

        <div className="login-header">
          <div className="login-logo-container">
            <img
              src="./panda-icon.png"
              alt="Panda"
              className="login-logo-img"
            />
            <div className="wrach-shield">
              <span className="shield-icon">🛡️</span>
              <span className="shield-text">WRACH SECURED</span>
            </div>
          </div>
          <h1>Welcome to the 4th Layer</h1>
          <p className="login-tagline">
            Panda Factory — Orchestration & Social Power
          </p>
        </div>

        <div className="login-body">
          {!method && (
            <div className="login-welcome-content">
              <div className="plans-grid">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`plan-card ${plan.popular ? "popular" : ""}`}
                  >
                    {plan.popular && (
                      <div className="plan-badge">BEST VALUE</div>
                    )}
                    <h3 style={{ color: plan.color }}>{plan.name}</h3>
                    <div className="plan-price">
                      <span className="currency">$</span>
                      {plan.price}
                      <span className="period">/mo</span>
                    </div>
                    <ul className="plan-features">
                      <li>
                        <strong>{plan.tokens}</strong> Tokens/mo
                      </li>
                      <li>
                        <strong>{plan.images}</strong> Images/day
                      </li>
                      {plan.video && (
                        <li>
                          <strong>{plan.video}</strong> Video Gen
                        </li>
                      )}
                      <li>SDK Access</li>
                    </ul>
                  </div>
                ))}
              </div>

              <div className="login-actions">
                <button
                  className="login-option login-google"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                >
                  <svg className="google-icon" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Connect with Founder ID
                </button>

                <button
                  className="login-option login-email-trigger"
                  onClick={() => setMethod("email")}
                >
                  ✉️ Standard Login
                </button>
              </div>

              <div className="rust-agent-badge">
                🚀 Rust Agent v1.0 Found • WRACH Active
              </div>
            </div>
          )}

          {method === "email" && (
            <form onSubmit={handleEmailLogin} className="login-email-form">
              <button type="button" className="login-back" onClick={handleBack}>
                ← Return to Plans
              </button>

              <div className="login-field">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoFocus
                />
              </div>

              <div className="login-field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {error && <p className="login-error">{error}</p>}

              <button
                type="submit"
                className="login-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Authenticating..." : "Enter Factory"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
