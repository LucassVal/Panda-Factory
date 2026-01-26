import React, { useState, useEffect } from "react";

/**
 * 🔒 Login Gate - Proteção de Acesso
 *
 * Credenciais armazenadas como hash para segurança básica.
 * Em produção, usar Auth Firebase/Google/etc.
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

// Pre-computed hashes (username:password)
// Lucassvalerio : U@g1232025
const AUTH_HASH = {
  user: simpleHash("Lucassvalerio"),
  pass: simpleHash("U@g1232025"),
};

function LoginGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Check if already authenticated
  useEffect(() => {
    const authToken = sessionStorage.getItem("panda_auth");
    if (authToken === `${AUTH_HASH.user}-${AUTH_HASH.pass}`) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const userHash = simpleHash(username);
    const passHash = simpleHash(password);

    if (userHash === AUTH_HASH.user && passHash === AUTH_HASH.pass) {
      sessionStorage.setItem(
        "panda_auth",
        `${AUTH_HASH.user}-${AUTH_HASH.pass}`,
      );
      setIsAuthenticated(true);
    } else {
      setError("Credenciais inválidas");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("panda_auth");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="login-gate-loading">
        <div className="login-spinner">🐼</div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        {/* Logout button in corner */}
        <button
          className="login-logout-btn"
          onClick={handleLogout}
          title="Sair"
        >
          🚪
        </button>
        {children}
      </>
    );
  }

  return (
    <div className="login-gate">
      <div className="login-container">
        <div className="login-logo">
          <img src="/jam/panda-chat-logo.png" alt="Panda" />
        </div>
        <h1 className="login-title">Panda Factory</h1>
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
          © 2026 Panda Factory - Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}

export default LoginGate;
