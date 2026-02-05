/**
 * 🐼 Education Tentacle - Parent
 * ================================
 * Gerencia integrações com plataformas de infoprodutos e cursos
 *
 * Plataformas suportadas:
 * - Kiwify (BR)
 * - Hotmart (BR/Global)
 * - Eduzz (BR)
 * - Teachable (Global)
 * - Thinkific (Global)
 *
 * Features:
 * - Webhook listeners para compras
 * - Liberação automática de acesso
 * - DRM tokenizado com PC
 * - White-label cursos
 *
 * @version 1.0.0
 * @requires pf.sdk.js, TentacleMonitor
 */

(function (window) {
  "use strict";

  const TENTACLE_ID = "education";
  const TM = window.TentacleMonitor;

  // Registro de children (hooks de plataformas)
  const children = new Map();

  // ==========================================
  // 💰 COSTS (PC por operação)
  // ==========================================
  const COSTS = {
    COURSE_CREATE: 100,
    COURSE_UPDATE: 50,
    WEBHOOK_VERIFY: 0, // Grátis
    ACCESS_GRANT: 10,
    ACCESS_REVOKE: 5,
    CERTIFICATE_GENERATE: 50,
  };

  // ==========================================
  // 📦 PARENT API
  // ==========================================
  const EducationParent = {
    id: TENTACLE_ID,

    /**
     * Initialize tentacle
     */
    init() {
      TM?.registerTentacle(TENTACLE_ID, { category: "education" });
      TM?.registerParent(TENTACLE_ID, "Panda.Education");
      TM?.log("info", TENTACLE_ID, "📚 Education Tentacle initialized");
    },

    /**
     * Register a platform hook (child)
     */
    registerChild(name, childApi) {
      children.set(name, {
        api: childApi,
        status: "ready",
        registeredAt: Date.now(),
      });

      TM?.registerChild(TENTACLE_ID, name);
      TM?.setStatus(`${TENTACLE_ID}:${name}`, "ready");
      this.api[name] = this._wrapChild(name, childApi);
      TM?.log("success", `${TENTACLE_ID}:${name}`, `✓ ${name} hook ready`);
    },

    /**
     * Wrap child methods with FAULT ISOLATION + TELEMETRY
     * If a child hook crashes, it won't bring down the parent
     * Reports all activities to Founder Dashboard
     */
    _wrapChild(name, childApi) {
      const wrapped = {};
      const AT = window.AgentTelemetry;

      Object.keys(childApi).forEach((method) => {
        if (typeof childApi[method] === "function") {
          wrapped[method] = async (...args) => {
            const start = Date.now();

            // FAULT ISOLATION: Wrap in try/catch with graceful degradation
            try {
              const result = await Promise.race([
                childApi[method](...args),
                // Timeout after 30 seconds
                new Promise((_, reject) =>
                  setTimeout(
                    () => reject(new Error(`Timeout: ${name}.${method}`)),
                    30000,
                  ),
                ),
              ]);

              // Report success to Founder Dashboard
              AT?.report?.(`${TENTACLE_ID}:${name}`, method, {
                success: result?.success !== false,
                duration: Date.now() - start,
                cost: result?.cost,
              });

              return result;
            } catch (error) {
              // Log error but DON'T propagate - return graceful failure
              console.error(
                `🔴 [${name}] Hook error in ${method}:`,
                error.message,
              );
              TM?.setStatus(`${TENTACLE_ID}:${name}`, "error");
              TM?.log?.(
                "error",
                `${TENTACLE_ID}:${name}`,
                `${method} failed: ${error.message}`,
              );

              // Report error to Founder Dashboard
              AT?.reportError?.(`${TENTACLE_ID}:${name}`, error, { method });

              // Return standardized error response - DON'T throw
              return {
                success: false,
                error: error.message,
                hook: name,
                method: method,
                isolated: true, // Flag that this was an isolated failure
              };
            }
          };
        } else {
          wrapped[method] = childApi[method];
        }
      });
      return wrapped;
    },

    // ==========================================
    // 🔧 CORE API
    // ==========================================
    api: {
      /**
       * Configure credentials for a platform
       */
      async configure(platform, credentials) {
        const stored = await _loadCredentials();
        stored[platform] = {
          ...credentials,
          configuredAt: Date.now(),
        };
        await _saveCredentials(stored);
        _log(`Configured credentials for ${platform}`);
        return { success: true, platform };
      },

      /**
       * Get configured platforms
       */
      async getConfigured() {
        const stored = await _loadCredentials();
        return Object.keys(stored);
      },

      /**
       * Process purchase webhook from any platform
       * This is the main entry point for course access
       */
      async processWebhook(platform, payload) {
        _log(`Processing webhook from ${platform}...`);

        const hook = children.get(platform);
        if (!hook) {
          return { success: false, error: `No hook for platform: ${platform}` };
        }

        // Validate webhook signature
        const isValid = await hook.api.validateWebhook(payload);
        if (!isValid) {
          _log(`Invalid webhook signature from ${platform}`);
          return { success: false, error: "Invalid signature" };
        }

        // Parse purchase data
        const purchase = await hook.api.parsePurchase(payload);

        // Grant access based on product
        const accessResult = await this.grantAccess(
          purchase.productId,
          purchase.buyerEmail,
          purchase.transaction,
        );

        // Log transaction
        await window.Panda?.Data?.save?.("education_purchases", {
          platform,
          productId: purchase.productId,
          buyerEmail: purchase.buyerEmail,
          transactionId: purchase.transaction,
          amount: purchase.amount,
          currency: purchase.currency,
          timestamp: Date.now(),
          accessGranted: accessResult.success,
        });

        return {
          success: true,
          purchase,
          access: accessResult,
        };
      },

      /**
       * Grant access to a course/product
       */
      async grantAccess(productId, email, transactionId) {
        _log(`Granting access to ${productId} for ${email}...`);

        await _charge(COSTS.ACCESS_GRANT, "EDU_ACCESS_GRANT");

        // Create access record
        const access = {
          productId,
          email,
          transactionId,
          grantedAt: Date.now(),
          expiresAt: null, // null = lifetime
          status: "active",
        };

        await window.Panda?.Data?.save?.("education_access", access);

        // If user exists in Panda, add to their wallet
        const user = await window.Panda?.Data?.query?.("users", {
          where: [["email", "==", email]],
          limit: 1,
        });

        if (user?.[0]) {
          await window.Panda?.Data?.update?.("users", user[0].id, {
            courses: [...(user[0].courses || []), productId],
          });
        }

        return { success: true, access };
      },

      /**
       * Revoke access to a course/product
       */
      async revokeAccess(productId, email, reason = "refund") {
        _log(`Revoking access to ${productId} for ${email}...`);

        await _charge(COSTS.ACCESS_REVOKE, "EDU_ACCESS_REVOKE");

        const records = await window.Panda?.Data?.query?.("education_access", {
          where: [
            ["productId", "==", productId],
            ["email", "==", email],
            ["status", "==", "active"],
          ],
        });

        if (records?.[0]) {
          await window.Panda?.Data?.update?.(
            "education_access",
            records[0].id,
            {
              status: "revoked",
              revokedAt: Date.now(),
              revokeReason: reason,
            },
          );
        }

        return { success: true, reason };
      },

      /**
       * Check if user has access to a product
       */
      async checkAccess(productId, email) {
        const records = await window.Panda?.Data?.query?.("education_access", {
          where: [
            ["productId", "==", productId],
            ["email", "==", email],
            ["status", "==", "active"],
          ],
          limit: 1,
        });

        return {
          hasAccess: records?.length > 0,
          record: records?.[0] || null,
        };
      },

      /**
       * Generate completion certificate
       */
      async generateCertificate(productId, email, completedAt = Date.now()) {
        _log(`Generating certificate for ${email}...`);

        await _charge(COSTS.CERTIFICATE_GENERATE, "EDU_CERTIFICATE");

        const cert = {
          id: `CERT_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          productId,
          email,
          completedAt,
          generatedAt: Date.now(),
          verifyUrl: null, // Will be set after storage
        };

        // Store certificate
        const saved = await window.Panda?.Data?.save?.(
          "education_certificates",
          cert,
        );
        cert.verifyUrl = `https://panda.factory/verify/${saved?.id || cert.id}`;

        return { success: true, certificate: cert };
      },

      /**
       * List all courses for a user
       */
      async listCourses(email) {
        const access = await window.Panda?.Data?.query?.("education_access", {
          where: [
            ["email", "==", email],
            ["status", "==", "active"],
          ],
        });

        return access || [];
      },

      /**
       * Get analytics for a product
       */
      async getAnalytics(productId, period = "30d") {
        // Aggregate from all platforms
        const analytics = {
          totalSales: 0,
          totalRevenue: 0,
          activeStudents: 0,
          completionRate: 0,
          byPlatform: {},
        };

        for (const [name, child] of children) {
          if (child.api.getAnalytics) {
            analytics.byPlatform[name] = await child.api.getAnalytics(
              productId,
              period,
            );
          }
        }

        return analytics;
      },
    },

    /**
     * Get status of all hooks
     */
    getStatus() {
      const status = {};
      children.forEach((child, name) => {
        status[name] = child.status;
      });
      return status;
    },
  };

  // ==========================================
  // 🔧 UTILS
  // ==========================================
  function _log(message) {
    console.log(`📚 [Education] ${message}`);
    TM?.log?.("info", TENTACLE_ID, message);
  }

  async function _charge(amount, reason) {
    if (window.Panda?.Wallet?.charge) {
      const result = await window.Panda.Wallet.charge(amount, reason);
      if (!result?.success) {
        throw new Error(`Saldo insuficiente. Necessário: ${amount} PC`);
      }
    }
  }

  async function _loadCredentials() {
    try {
      const stored = localStorage.getItem("panda_edu_credentials");
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  async function _saveCredentials(creds) {
    localStorage.setItem("panda_edu_credentials", JSON.stringify(creds));
  }

  // ==========================================
  // 🌍 REGISTER
  // ==========================================
  if (window.Panda) {
    window.Panda.Education = EducationParent.api;
    window.Panda._tentacles = window.Panda._tentacles || {};
    window.Panda._tentacles.education = EducationParent;
  }

  window.EducationParent = EducationParent;

  if (TM) {
    EducationParent.init();
  }

  _log("Education Parent loaded");
})(window);
