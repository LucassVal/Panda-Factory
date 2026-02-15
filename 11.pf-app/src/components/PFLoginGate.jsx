import React, { useState, useEffect } from "react";

/**
 * Login Gate — Access Control (v8.0)
 *
 * EMAIL-BASED CREDENTIALS:
 *   1) founder@panda.com / founder  → Founder (full access)
 *   2) user@panda.com / user        → User (MVP demo, can toggle Dev Mode)
 *
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

// Credential sets — email-based, 2 tiers only
const CREDENTIALS = [
  {
    user: simpleHash("founder@panda.com"),
    pass: simpleHash("founder"),
    profile: {
      uid: "founder-001",
      email: "founder@panda.com",
      displayName: "Lucas Valério",
      userType: "founder",
      founderPercent: 5,
      authMethod: "logingate",
    },
  },
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

// Feature highlights for the landing page
const FEATURES = [
  {
    icon: "🤖",
    title: "6 Specialist AIs",
    desc: "Autonomous agents for design, code, and business",
  },
  {
    icon: "🧩",
    title: "Modular Platform",
    desc: "Install only what you need from the Store",
  },
  {
    icon: "🚀",
    title: "Instant Deploy",
    desc: "GitHub Pages CI/CD — push and ship",
  },
];

// Tech stack badges
const TECH_BADGES = [
  "React", "Gemini AI", "Firebase", "tldraw", "GitHub Actions", "Ed25519"
];

function LoginGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check existing session
    const authToken = sessionStorage.getItem("panda_auth");
    const isValid = CREDENTIALS.some(
      (cr) => authToken === `${cr.user}-${cr.pass}`
    );
    if (isValid) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    const indexToken = sessionStorage.getItem("panda_auth_token");
    if (indexToken) {
      try {
        const decoded = JSON.parse(atob(indexToken));
        if (decoded.email && decoded.exp > Date.now()) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.warn("Invalid panda_auth_token");
      }
    }

    const pandaUser = localStorage.getItem("panda_user");
    if (pandaUser) {
      try {
        const user = JSON.parse(pandaUser);
        if (user.email) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.warn("Invalid panda_user");
      }
    }

    setIsLoading(false);
  }, []);

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
      localStorage.setItem("panda_user", JSON.stringify(matched.profile));
      setIsAuthenticated(true);
    } else {
      setError("Invalid email or password");
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="login-gate-loading">
        <div className="login-spinner">
          <img src="/panda-icon.png" alt="Panda" style={{width:"48px",height:"48px"}} />
        </div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="login-gate">
      {/* Animated background orbs */}
      <div className="login-bg-orb login-bg-orb-1" />
      <div className="login-bg-orb login-bg-orb-2" />
      <div className="login-bg-orb login-bg-orb-3" />

      <div className="login-page">
        {/* LEFT — Hero / Branding */}
        <div className="login-hero">
          <div className="login-hero-content">
            <div className="login-logo">
              <img src="/panda-icon.png" alt="Panda Factory" />
            </div>
            <h1 className="login-title">Panda Factory</h1>
            <p className="login-tagline">
              AI-powered tools to create, automate and monetize
            </p>

            {/* Feature Cards */}
            <div className="login-features">
              {FEATURES.map((f, i) => (
                <div
                  className="login-feature-card"
                  key={i}
                  style={{ animationDelay: `${0.1 + i * 0.15}s` }}
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
          </div>
        </div>

        {/* RIGHT — Login Form */}
        <div className="login-form-section">
          <div className="login-form-container">
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-subtitle">
              Sign in to access your workspace
            </p>

            {/* Google Sign-in (Coming Soon) */}
            <button
              className="login-google-btn"
              disabled
              title="Google Sign-in coming soon"
            >
              <svg className="login-google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
              <span className="login-badge-soon">Soon</span>
            </button>

            <div className="login-divider">
              <span>or</span>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleLogin} className="login-form">
              <div className="login-field">
                <label htmlFor="login-email">Email</label>
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
                <label htmlFor="login-password">Password</label>
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
                  <span className="login-btn-loading">Signing in...</span>
                ) : (
                  "Sign in with Email"
                )}
              </button>
            </form>

            {/* Demo Hint */}
            <div className="login-demo-hint">
              <span className="login-demo-label">MVP Demo</span>
              <code>user@panda.com</code> / <code>user</code>
            </div>

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
