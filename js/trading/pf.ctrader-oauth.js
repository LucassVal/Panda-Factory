/**
 * 🐼 PANDA TRADING - cTrader OAuth Module
 * ========================================
 * Permite que QUALQUER usuário conecte sua conta cTrader ao Panda
 * usando OAuth (sem precisar criar App própria)
 *
 * @version 1.0.0
 *
 * FLUXO:
 * 1. Usuário clica "Conectar cTrader"
 * 2. Abre popup de autorização cTrader
 * 3. Usuário loga e autoriza app Antigravity
 * 4. cTrader redireciona com code
 * 5. Panda troca code por access token
 * 6. Usuário pode operar!
 */

(function (window) {
  "use strict";

  // ============================================================================
  // CONFIG
  // ============================================================================

  const CONFIG = {
    // Antigravity App credentials
    CLIENT_ID: "19151_S6shjal0uQqcSA9jXpwiRO3FUIETLXFbX1fwQm2zicBQg0dIJG",

    // OAuth URLs
    AUTH_URL: "https://id.ctrader.com/my/settings/openapi/grantingaccess/",
    TOKEN_URL: "https://openapi.ctrader.com/apps/token",

    // Redirect URI - CADASTRADO NO PORTAL CTRADER ✅
    REDIRECT_URI: "https://lucassval.github.io/panda-ctrader-auth/",

    // Scopes
    SCOPE: "trading", // 'accounts' ou 'trading'

    // Storage keys
    STORAGE_KEY_TOKEN: "panda_ctrader_token",
    STORAGE_KEY_REFRESH: "panda_ctrader_refresh",
    STORAGE_KEY_EXPIRES: "panda_ctrader_expires",
    STORAGE_KEY_ACCOUNTS: "panda_ctrader_accounts",
  };

  // ============================================================================
  // OAUTH MODULE
  // ============================================================================

  const CTraderOAuth = {
    /**
     * Inicia o fluxo OAuth - abre popup de autorização
     */
    login() {
      console.log("[cTrader OAuth] 🔐 Iniciando login...");

      // Gerar state para CSRF protection
      const state = this._generateState();
      sessionStorage.setItem("ctrader_oauth_state", state);

      // Montar URL de autorização
      const authUrl = new URL(CONFIG.AUTH_URL);
      authUrl.searchParams.set("client_id", CONFIG.CLIENT_ID);
      authUrl.searchParams.set("redirect_uri", CONFIG.REDIRECT_URI);
      authUrl.searchParams.set("scope", CONFIG.SCOPE);
      authUrl.searchParams.set("product", "web");
      authUrl.searchParams.set("state", state);

      // Abrir popup
      const width = 600;
      const height = 700;
      const left = (screen.width - width) / 2;
      const top = (screen.height - height) / 2;

      const popup = window.open(
        authUrl.toString(),
        "cTrader Login",
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      if (!popup) {
        console.error("[cTrader OAuth] ❌ Popup bloqueado!");
        alert("Por favor, permita popups para conectar ao cTrader.");
        return false;
      }

      // Monitorar popup
      this._watchPopup(popup);

      return true;
    },

    /**
     * Monitora o popup aguardando o redirect com code
     */
    _watchPopup(popup) {
      const checkInterval = setInterval(() => {
        try {
          // Verificar se popup fechou
          if (popup.closed) {
            clearInterval(checkInterval);
            console.log("[cTrader OAuth] Popup fechado");
            return;
          }

          // Verificar se redirecionou para callback
          const currentUrl = popup.location.href;
          if (currentUrl.includes(CONFIG.REDIRECT_URI)) {
            clearInterval(checkInterval);

            // Extrair code da URL
            const url = new URL(currentUrl);
            const code = url.searchParams.get("code");
            const state = url.searchParams.get("state");

            popup.close();

            // Verificar state (CSRF)
            const savedState = sessionStorage.getItem("ctrader_oauth_state");
            if (state !== savedState) {
              console.error(
                "[cTrader OAuth] ❌ State mismatch - possível CSRF!",
              );
              return;
            }

            if (code) {
              this._exchangeCodeForToken(code);
            }
          }
        } catch (e) {
          // Cross-origin error - popup ainda em ctrader.com, ignorar
        }
      }, 500);
    },

    /**
     * Troca authorization code por access token
     */
    async _exchangeCodeForToken(code) {
      console.log("[cTrader OAuth] 🔄 Trocando code por token...");

      try {
        // Chamar API cTrader para trocar code por token
        // NOTA: Em produção, isso deve passar pelo backend para não expor client_secret
        const tokenUrl = new URL(CONFIG.TOKEN_URL);
        tokenUrl.searchParams.set("grant_type", "authorization_code");
        tokenUrl.searchParams.set("code", code);
        tokenUrl.searchParams.set("redirect_uri", CONFIG.REDIRECT_URI);
        tokenUrl.searchParams.set("client_id", CONFIG.CLIENT_ID);
        // client_secret deve vir do backend por segurança!

        // Por enquanto, salvar code e pedir para backend trocar
        // Em produção: POST para seu GAS/Firebase que faz a troca

        const response = await this._backendExchangeToken(code);

        if (response.accessToken) {
          this._saveTokens(response);
          console.log("[cTrader OAuth] ✅ Login bem-sucedido!");
          window.Panda?.Events?.emit("ctrader:login", { success: true });

          // Buscar contas automaticamente
          await this.fetchAccounts();
        } else {
          throw new Error(response.description || "Token exchange failed");
        }
      } catch (error) {
        console.error("[cTrader OAuth] ❌ Erro:", error);
        window.Panda?.Events?.emit("ctrader:login", { success: false, error });
      }
    },

    /**
     * Chama backend para trocar code por token (seguro)
     * Em produção: isso vai para GAS/Firebase
     */
    async _backendExchangeToken(code) {
      // PLACEHOLDER: Em produção, chamar seu backend
      // O backend tem o CLIENT_SECRET e faz a troca segura

      // Por enquanto, simular chamada direta (NÃO USAR EM PRODUÇÃO)
      // pois expõe client_secret no frontend

      const response = await fetch(
        `${CONFIG.TOKEN_URL}?grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(CONFIG.REDIRECT_URI)}&client_id=${CONFIG.CLIENT_ID}&client_secret=BACKEND_SHOULD_HAVE_THIS`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      return await response.json();
    },

    /**
     * Refresh token antes de expirar
     */
    async refreshToken() {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        console.error("[cTrader OAuth] Sem refresh token");
        return false;
      }

      console.log("[cTrader OAuth] 🔄 Refreshing token...");

      try {
        const response = await fetch(
          `${CONFIG.TOKEN_URL}?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${CONFIG.CLIENT_ID}&client_secret=BACKEND_SHOULD_HAVE_THIS`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          },
        );

        const data = await response.json();

        if (data.accessToken) {
          this._saveTokens(data);
          console.log("[cTrader OAuth] ✅ Token refreshed!");
          return true;
        }

        return false;
      } catch (error) {
        console.error("[cTrader OAuth] ❌ Refresh failed:", error);
        return false;
      }
    },

    /**
     * Salva tokens no localStorage
     */
    _saveTokens(response) {
      localStorage.setItem(CONFIG.STORAGE_KEY_TOKEN, response.accessToken);
      localStorage.setItem(CONFIG.STORAGE_KEY_REFRESH, response.refreshToken);

      const expiresAt = Date.now() + response.expiresIn * 1000;
      localStorage.setItem(CONFIG.STORAGE_KEY_EXPIRES, expiresAt.toString());
    },

    /**
     * Busca contas do usuário após login
     */
    async fetchAccounts() {
      const token = this.getAccessToken();
      if (!token) return [];

      // Conectar via WebSocket e listar contas
      if (!window.Panda?.CTrader?.isConnected?.()) {
        await window.Panda?.CTrader?.configure(
          CONFIG.CLIENT_ID,
          "BACKEND_SECRET", // placeholder
          token,
        );
        await window.Panda?.CTrader?.connect(true);
      }

      // As contas serão listadas automaticamente após conexão
      return [];
    },

    // ==========================================
    // GETTERS
    // ==========================================

    getAccessToken() {
      return localStorage.getItem(CONFIG.STORAGE_KEY_TOKEN);
    },

    getRefreshToken() {
      return localStorage.getItem(CONFIG.STORAGE_KEY_REFRESH);
    },

    isLoggedIn() {
      const token = this.getAccessToken();
      const expires = localStorage.getItem(CONFIG.STORAGE_KEY_EXPIRES);

      if (!token || !expires) return false;

      // Verificar se expirou
      if (Date.now() > parseInt(expires)) {
        // Token expirado, tentar refresh
        this.refreshToken();
        return false;
      }

      return true;
    },

    logout() {
      localStorage.removeItem(CONFIG.STORAGE_KEY_TOKEN);
      localStorage.removeItem(CONFIG.STORAGE_KEY_REFRESH);
      localStorage.removeItem(CONFIG.STORAGE_KEY_EXPIRES);
      localStorage.removeItem(CONFIG.STORAGE_KEY_ACCOUNTS);

      window.Panda?.CTrader?.disconnect?.();
      window.Panda?.Events?.emit("ctrader:logout");

      console.log("[cTrader OAuth] 👋 Logged out");
    },

    // ==========================================
    // HELPERS
    // ==========================================

    _generateState() {
      return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
      );
    },

    /**
     * Configuração inicial - PRECISA SER FEITA NO PORTAL CTRADER
     */
    getSetupInstructions() {
      return `
🔧 SETUP NECESSÁRIO NO PORTAL CTRADER:

1. Acesse: https://openapi.ctrader.com/apps/
2. Edite o app "Antigravity"
3. Em "Redirect URIs", adicione:
   ${CONFIG.REDIRECT_URI}
4. Salve as alterações

⚠️ Sem isso, o OAuth não vai funcionar!
      `;
    },
  };

  // ============================================================================
  // EXPOSE
  // ============================================================================

  window.Panda = window.Panda || {};
  window.Panda.CTraderOAuth = CTraderOAuth;

  console.log("[cTrader OAuth] 🐼 OAuth module loaded");
  console.log("[cTrader OAuth] Redirect URI:", CONFIG.REDIRECT_URI);
})(window);
