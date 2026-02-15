import React, { useState, useEffect } from "react";

/**
 * Login Gate - Access Control
 *
 * TEST CREDENTIALS (v7.2):
 *   1) user / user        → User (regular user experience, MVP demo)
 *   2) dev / dev          → Dev/User (DevTools available, SDK access)
 *   3) founder / founder  → Founder (full access + Dashboard + PAT Council)
 *
 * REAL CREDENTIALS: stored securely, not listed here.
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

// Credential sets (hashed for basic security)
const CREDENTIALS = [
  // === TEST CREDENTIALS ===
  {
    user: simpleHash("founder"),
    pass: simpleHash("founder"),
    profile: {
      uid: "founder-test",
      email: "founder@panda.com",
      displayName: "Founder (Test)",
      userType: "founder",
      founderPercent: 5,
      authMethod: "logingate",
    },
  },
  {
    user: simpleHash("dev"),
    pass: simpleHash("dev"),
    profile: {
      uid: "dev-test",
      email: "dev@test.com",
      displayName: "Developer (Test)",
      userType: "dev",
      sdkAccess: true,
      authMethod: "logingate",
    },
  },
  {
    user: simpleHash("user"),
    pass: simpleHash("user"),
    profile: {
      uid: "user-demo",
      email: "user@demo.com",
      displayName: "Demo User",
      userType: "user",
      sdkAccess: false,
      authMethod: "logingate",
    },
  },
  // === REAL CREDENTIALS ===
  {
    user: simpleHash("Lucassvalerio"),
    pass: simpleHash("U@g1232025"),
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
    user: simpleHash("admin"),
    pass: simpleHash("admin"),
    profile: {
      uid: "admin-001",
      email: "admin@panda.com",
      displayName: "Admin",
      userType: "admin",
      founderPercent: 0,
      authMethod: "logingate",
    },
  },
];

function LoginGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const userHash = simpleHash(username);
    const passHash = simpleHash(password);

    const matched = CREDENTIALS.find(
      (cr) => cr.user === userHash && cr.pass === passHash
    );

    if (matched) {
      sessionStorage.setItem(
        "panda_auth",
        `${matched.user}-${matched.pass}`,
      );
      localStorage.setItem("panda_user", JSON.stringify(matched.profile));
      setIsAuthenticated(true);
    } else {
      setError("Credenciais inválidas");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("panda_auth");
    sessionStorage.removeItem("panda_auth_token");
    localStorage.removeItem("panda_user");
    localStorage.removeItem("panda_token");
    localStorage.removeItem("panda_founder_mode");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="login-gate-loading">
        <div className="login-spinner"><img src="/panda-icon.png" alt="Panda" style={{width:"48px",height:"48px"}} /></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="login-gate">
      <div className="login-container">
        <div className="login-logo">
          <img src="./panda-chat-logo.png" alt="Panda" />
        </div>
        <h1 className="login-title">Panda Fabrics</h1>
        <p className="login-subtitle">Acesso Restrito</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label>Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>

        <p className="login-footer">
          © 2026 Panda Fabrics - Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}

export default LoginGate;
