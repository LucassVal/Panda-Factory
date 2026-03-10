import React, { useState, useEffect } from "react";
import { useI18n } from "../i18n/i18n.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

/**
 * Login Gate — Access Control (v9.0)
 *
 * DDD: Login UI now lives on the landing page (index.html).
 * This gate only checks if the user is authenticated via Firebase.
 * If not authenticated → redirect to landing page.
 * If authenticated → render children (the app).
 */

function LoginGate({ children }) {
  const { t } = useI18n();
  const auth = useAuth();

  // Redirect to landing page when not authenticated
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      if (isLocalDev) {
        // DEV MODE LOGIN UI
        // Instead of auto-logging in or infinite redirecting, pause here.
        // We will render a DEV LOGIN UI below so the user can test real Google Auth.
        return;
      }

      // Production: redirect to landing page (GitHub Pages)
      const basePath = window.location.pathname
        .replace(/\/app\/.*$/, "/")
        .replace(/\/app\/?$/, "/");
      window.location.href = basePath;
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  // Loading state (Firebase checking auth)
  if (auth.isLoading) {
    return (
      <div className="login-gate-loading">
        <div className="login-spinner">
          <img
            src="./panda-icon.png"
            alt="Panda"
            style={{ width: "48px", height: "48px" }}
          />
        </div>
        <p>{t("login.loading") || "Loading..."}</p>
      </div>
    );
  }

  // Authenticated → render the app
  if (auth.isAuthenticated) {
    return <>{children}</>;
  }

  // Not authenticated → In Dev Mode, show a local login panel. In Prod, this shows briefly before redirecting.
  const isLocalDev =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocalDev) {
    return (
      <div
        className="login-gate-loading"
        style={{ flexDirection: "column", gap: "20px" }}
      >
        <img
          src="./panda-icon.png"
          alt="Panda"
          style={{ width: "64px", height: "64px" }}
        />
        <h2 style={{ margin: 0 }}>Panda Dev Login</h2>
        <p
          style={{
            color: "#aaa",
            fontSize: "14px",
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          Localhost bypass detected. To test official accounts
          (lucassvalerio@gmail.com & lucassvalerio2@gmail.com), use the buttons
          below.
        </p>

        <button
          onClick={() => auth.loginWithGoogle()}
          style={{
            padding: "12px 24px",
            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width="18"
            alt="G"
          />
          Testar com Conta Google Real
        </button>

        <button
          onClick={() => {
            auth.loginWithGate({
              uid: "dev-local",
              email: "dev@panda.local",
              displayName: "Dev Mock",
              userType: "user",
              pcBalance: 999,
            });
          }}
          style={{
            padding: "12px 24px",
            background: "transparent",
            color: "#aaa",
            border: "1px solid #444",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Usar Conta Dev (Mock Local)
        </button>
      </div>
    );
  }

  // Not authenticated → show spinner while redirecting
  return (
    <div className="login-gate-loading">
      <div className="login-spinner">
        <img
          src="./panda-icon.png"
          alt="Panda"
          style={{ width: "48px", height: "48px" }}
        />
      </div>
      <p>{"Redirecting..."}</p>
    </div>
  );
}

export default LoginGate;
