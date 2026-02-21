/**
 * 🛡️ PFErrorBoundary v1.0 — React Error Boundary (TICKET-15)
 *
 * Catches unhandled errors in the component tree
 * and displays a graceful fallback UI instead of white-screening.
 *
 * Features:
 *   - Gradient crash screen with error details
 *   - Auto-recovery retry button
 *   - Error logging to console (GAS logging in Phase 2)
 *   - Optional fallback component override
 *
 * Usage:
 *   <PFErrorBoundary>
 *     <App />
 *   </PFErrorBoundary>
 *
 * @version 1.0.0
 */

import React from "react";

class PFErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState((prev) => ({
      errorInfo,
      errorCount: prev.errorCount + 1,
    }));

    // Log to console (extensible to GAS/RTDB in Phase 2)
    console.error("🛡️ [PFErrorBoundary] Caught error:", error);
    console.error(
      "🛡️ [PFErrorBoundary] Component stack:",
      errorInfo?.componentStack,
    );

    // Store last error for diagnostics
    try {
      localStorage.setItem(
        "pf_last_error",
        JSON.stringify({
          message: error?.message,
          stack: error?.stack?.slice(0, 500),
          component: errorInfo?.componentStack?.slice(0, 300),
          timestamp: new Date().toISOString(),
          url: window.location.href,
        }),
      );
    } catch (_) {
      /* quota exceeded — ignore */
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleClearAndReload = () => {
    try {
      // Clear potentially corrupted state
      localStorage.removeItem("pf_crm_contacts");
      localStorage.removeItem("pf_landing_pages");
      localStorage.removeItem("pf_licenses_cache");
    } catch (_) {
      /* ignore */
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback override
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, errorCount } = this.state;
      const tooManyErrors = errorCount >= 3;

      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.iconWrap}>
              <span style={styles.icon}>🐼</span>
            </div>
            <h1 style={styles.title}>Oops! Something went wrong</h1>
            <p style={styles.subtitle}>
              Panda Factory encountered an error. Don't worry — your data is
              safe.
            </p>

            {/* Error details (collapsible) */}
            <details style={styles.details}>
              <summary style={styles.summary}>🔍 Error Details</summary>
              <pre style={styles.errorText}>
                {error?.message || "Unknown error"}
              </pre>
              {errorInfo?.componentStack && (
                <pre style={styles.stackText}>
                  {errorInfo.componentStack.slice(0, 500)}
                </pre>
              )}
            </details>

            {/* Actions */}
            <div style={styles.actions}>
              {!tooManyErrors ? (
                <button style={styles.retryBtn} onClick={this.handleRetry}>
                  🔄 Try Again
                </button>
              ) : (
                <p style={styles.tooMany}>
                  ⚠️ Multiple errors detected. Try a full reload.
                </p>
              )}
              <button style={styles.reloadBtn} onClick={this.handleReload}>
                🔃 Reload Page
              </button>
              <button
                style={styles.clearBtn}
                onClick={this.handleClearAndReload}
              >
                🧹 Clear Cache & Reload
              </button>
            </div>

            <p style={styles.footer}>
              Panda Factory v6.6 • Error #{errorCount}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ── Inline styles (no CSS dependency for reliability) ──
const styles = {
  container: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0d1117, #161b22, #1c2333)",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    zIndex: 99999,
    padding: 20,
  },
  card: {
    maxWidth: 520,
    width: "100%",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: "40px 32px",
    textAlign: "center",
  },
  iconWrap: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 64,
    filter: "grayscale(0.3)",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#e6edf3",
    margin: "0 0 8px",
  },
  subtitle: {
    fontSize: 14,
    color: "#8b949e",
    margin: "0 0 24px",
    lineHeight: 1.5,
  },
  details: {
    textAlign: "left",
    marginBottom: 24,
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    padding: "8px 12px",
  },
  summary: {
    cursor: "pointer",
    fontSize: 12,
    color: "#8b949e",
    padding: "4px 0",
  },
  errorText: {
    fontSize: 11,
    color: "#ef4444",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    margin: "8px 0 4px",
    fontFamily: "'Fira Code', 'Consolas', monospace",
    lineHeight: 1.4,
  },
  stackText: {
    fontSize: 10,
    color: "#6e7681",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    margin: "4px 0 0",
    fontFamily: "'Fira Code', 'Consolas', monospace",
    maxHeight: 120,
    overflow: "auto",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
  },
  retryBtn: {
    padding: "10px 28px",
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    borderRadius: 8,
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    color: "white",
    cursor: "pointer",
    width: "100%",
    maxWidth: 300,
  },
  reloadBtn: {
    padding: "8px 20px",
    fontSize: 12,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 6,
    background: "rgba(255, 255, 255, 0.05)",
    color: "#c9d1d9",
    cursor: "pointer",
    width: "100%",
    maxWidth: 300,
  },
  clearBtn: {
    padding: "8px 20px",
    fontSize: 11,
    border: "none",
    borderRadius: 6,
    background: "transparent",
    color: "#8b949e",
    cursor: "pointer",
    textDecoration: "underline",
  },
  tooMany: {
    fontSize: 12,
    color: "#f59e0b",
    margin: "0 0 8px",
  },
  footer: {
    fontSize: 10,
    color: "#484f58",
    marginTop: 20,
    marginBottom: 0,
  },
};

export default PFErrorBoundary;
