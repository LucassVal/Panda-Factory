import React, { useState, useEffect } from "react";
import { useI18n, LOCALES } from "../i18n/i18n.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

/**
 * Login Gate — Access Control (v8.1)
 *
 * EMAIL-BASED CREDENTIALS (demo only):
 *   user@panda.com / user → User (MVP demo, can toggle Dev Mode)
 *
 * FOUNDER AUTH: Firebase Google Sign-In only — never hardcoded here.
 * REAL CREDENTIALS: stored in 00.credentials/, NOT listed here.
 */

// Simple hash function (NOT for production security!)
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

// Credential sets — demo user only (Founder uses Firebase Google Sign-In)
const CREDENTIALS = [
  {
    user: simpleHash("user@panda.com"),
    pass: simpleHash("user"),
    profile: {
      uid: "user-demo",
      email: "user@panda.com",
      displayName: "Demo User",
      userType: "user",
      sdkAccess: false,
      authMethod: "logingate",
    },
  },
];

// Feature highlights — positioned as 4th Digital Layer
const FEATURES = [
  {
    icon: "🌐",
    title: "4ª Camada Digital",
    desc: "Orquestre Infra + Plataformas + IA em um único SDK",
  },
  {
    icon: "🔌",
    title: "17 Namespaces",
    desc: "Auth, Brain, Store, Wallet — tudo com um import",
  },
  {
    icon: "💰",
    title: "Co-Produção",
    desc: "Zero custo fixo — Panda só ganha quando você ganha",
  },
  {
    icon: "🧠",
    title: "IA Nativa em Tudo",
    desc: "Gemini Pro, Flash, Think — já integrado por padrão",
  },
  {
    icon: "🐙",
    title: "Medusa + Hotmart",
    desc: "Publique com um comando, distribua para 34M+ compradores",
  },
  {
    icon: "🛡️",
    title: "Panda Defend",
    desc: "A 4ª camada se auto-governa — 14 regras, kill switch",
  },
];

// Social proof stats — 4th Layer focused
const STATS = [
  { value: "17", label: "SDK namespaces" },
  { value: "3", label: "camadas compostas" },
  { value: "0", label: "custo fixo" },
  { value: "∞", label: "co-produção" },
];

// Tech stack badges — layer-aware
const TECH_BADGES = [
  "L1: Firebase", "L2: Hotmart", "L3: Gemini AI", "L4: Panda SDK", "Ed25519", "MCP"
];

const APP_VERSION = "v9.0 — 4th Layer Edition";

function LoginGate({ children }) {
  const { t, locale, setLocale } = useI18n();
  const auth = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Sync with useAuth state — Firebase or localStorage session
  useEffect(() => {
    if (auth.isAuthenticated) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Fallback: Check logingate session (demo credentials)
    const authToken = sessionStorage.getItem("panda_auth");
    const isValid = CREDENTIALS.some(
      (cr) => authToken === `${cr.user}-${cr.pass}`
    );
    if (isValid) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(auth.isLoading);
  }, [auth.isAuthenticated, auth.isLoading]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 400));

    const userHash = simpleHash(email.toLowerCase().trim());
    const passHash = simpleHash(password);

    const matched = CREDENTIALS.find(
      (cr) => cr.user === userHash && cr.pass === passHash
    );

    if (matched) {
      sessionStorage.setItem(
        "panda_auth",
        `${matched.user}-${matched.pass}`
      );
      // Also register with useAuth for domain-level access
      await auth.loginWithGate(matched.profile);
      setIsAuthenticated(true);
    } else {
      setError(t("login.invalidCredentials"));
    }
    setIsSubmitting(false);
  };

  // Google Sign-In handler
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError("");
    try {
      await auth.loginWithGoogle();
      // onAuthStateChanged in useAuth will set user → isAuthenticated
    } catch (err) {
      setError(auth.error || err.message || "Google login failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="login-gate-loading">
        <div className="login-spinner">
          <img src="./panda-icon.png" alt="Panda" style={{width:"48px",height:"48px"}} />
        </div>
        <p>{t("login.loading")}</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="login-gate">
      {/* i18n Language Selector — top right */}
      <div className="login-lang-selector">
        {Object.entries(LOCALES).map(([key, loc]) => (
          <button
            key={key}
            className={`login-lang-btn${locale === key ? " active" : ""}`}
            onClick={() => setLocale(key)}
            title={loc.name}
          >
            <span className="login-lang-flag">{loc.flag}</span>
            <span className="login-lang-label">{loc.label}</span>
          </button>
        ))}
      </div>

      {/* Animated background orbs */}
      <div className="login-bg-orb login-bg-orb-1" />
      <div className="login-bg-orb login-bg-orb-2" />
      <div className="login-bg-orb login-bg-orb-3" />

      <div className="login-page">
        {/* LEFT — Hero / Branding */}
        <div className="login-hero">
          <div className="login-hero-content">
            <div className="login-logo">
              <img src="./panda-icon.png" alt="Panda Factory" />
            </div>
            <h1 className="login-title">Panda Factory</h1>
            <p className="login-tagline">
              {t("login.tagline")}
            </p>
            <p className="login-description">
              {t("login.description")}
            </p>

            {/* Social Proof Stats */}
            <div className="login-stats">
              {t("login.stats").map((s, i) => (
                <div className="login-stat" key={i}>
                  <span className="login-stat-value">{s.value}</span>
                  <span className="login-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Feature Cards */}
            <div className="login-features">
              {t("login.features").map((f, i) => (
                <div
                  className="login-feature-card"
                  key={i}
                  style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                >
                  <span className="login-feature-icon">{f.icon}</span>
                  <div>
                    <strong>{f.title}</strong>
                    <span>{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tech Badges */}
            <div className="login-tech-badges">
              {TECH_BADGES.map((badge, i) => (
                <span className="login-tech-badge" key={i}>{badge}</span>
              ))}
            </div>

            {/* Version badge */}
            <div className="login-version-badge">{APP_VERSION}</div>
          </div>
        </div>

        {/* RIGHT — Login Form */}
        <div className="login-form-section">
          <div className="login-form-container">
            <h2 className="login-form-title">{t("login.welcomeBack")}</h2>
            <p className="login-form-subtitle">
              {t("login.signInSubtitle")}
            </p>

            {/* Google Sign-in — Real Firebase Auth */}
            <button
              className="login-google-btn"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              title={t("login.signInGoogle")}
            >
              <svg className="login-google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isGoogleLoading ? "Connecting..." : t("login.signInGoogle")}
            </button>

            <div className="login-divider">
              <span>{t("login.or")}</span>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleLogin} className="login-form">
              <div className="login-field">
                <label htmlFor="login-email">{t("login.email")}</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  autoFocus
                />
              </div>

              <div className="login-field">
                <label htmlFor="login-password">{t("login.password")}</label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && <div className="login-error">{error}</div>}

              <button
                type="submit"
                className="login-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="login-btn-loading">{t("login.signingIn")}</span>
                ) : (
                  t("login.signInEmail")
                )}
              </button>

              <p className="login-free-hint">
                {t("login.freeHint")}
              </p>
            </form>

            {/* Forgot password */}
            <button
              className="login-forgot-btn"
              onClick={() => alert("Password reset coming soon. For now, use the demo credentials below.")}
            >
              {t("login.forgotPassword")}
            </button>

            {/* Demo Hint — collapsible */}
            <details className="login-demo-details">
              <summary className="login-demo-summary">
                <span className="login-demo-label">{t("login.demoLabel")}</span>
              </summary>
              <div className="login-demo-content">
                <code>user@panda.com</code> / <code>user</code>
              </div>
            </details>

            {/* Footer */}
            <div className="login-form-footer">
              <span>© 2026 Panda Factory</span>
              <a
                href="https://github.com/LucassVal/Panda-Factory"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginGate;
