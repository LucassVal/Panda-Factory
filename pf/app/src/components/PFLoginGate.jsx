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
      // Build landing page URL (works on localhost + GitHub Pages)
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
