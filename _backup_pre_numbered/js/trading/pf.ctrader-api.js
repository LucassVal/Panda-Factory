/**
 * 🐼 PANDA TRADING - cTrader Open API Connector
 * ==============================================
 * Integração com cTrader para trading automatizado
 *
 * @version 1.0.0
 * @marketplace TRUE
 * @price 0 (FREE - monetização via tokens)
 *
 * DOCS: https://help.ctrader.com/open-api/
 *
 * FEATURES:
 * - Conexão WebSocket com cTrader backend
 * - Market data real-time
 * - Operações de trading
 * - Histórico de posições
 * - AI Assistant para análise
 */

(function (window) {
  "use strict";

  // ============================================================================
  // CONFIG
  // ============================================================================

  const CONFIG = {
    // Endpoints cTrader (Demo e Live)
    WS_DEMO: "wss://demo.ctraderapi.com:5035",
    WS_LIVE: "wss://live.ctraderapi.com:5035",

    // Rate limits
    MAX_REQUESTS_SEC: 50,
    MAX_HISTORY_REQUESTS_SEC: 5,

    // Token costs (Panda Coins)
    COSTS: {
      ANALYSIS: 20,
      SIGNAL: 30,
      BACKTEST: 100,
      AI_TRADE_IDEA: 50,
    },
  };

  let _ws = null;
  let _isConnected = false;
  let _credentials = null;
  let _requestId = 1;
  let _pendingRequests = new Map();

  // ============================================================================
  // CTRADER API
  // ============================================================================

  const CTraderAPI = {
    version: "1.0.0",

    // ==========================================
    // CONNECTION
    // ==========================================

    /**
     * Configura credenciais da aplicação
     * @param {string} clientId - App Client ID
     * @param {string} clientSecret - App Client Secret
     * @param {string} accessToken - User access token (OAuth)
     */
    configure(clientId, clientSecret, accessToken) {
      _credentials = { clientId, clientSecret, accessToken };
      console.log("[cTrader] ✅ Credenciais configuradas");
    },

    /**
     * Conecta ao cTrader backend
     * @param {boolean} isDemo - Usar ambiente demo
     */
    async connect(isDemo = true) {
      if (_isConnected) return true;

      const url = isDemo ? CONFIG.WS_DEMO : CONFIG.WS_LIVE;

      return new Promise((resolve, reject) => {
        try {
          _ws = new WebSocket(url);

          _ws.onopen = async () => {
            console.log("[cTrader] 🔌 WebSocket conectado");

            // Autenticar aplicação
            try {
              await this._authenticate();
              _isConnected = true;
              window.Panda?.Events?.emit("ctrader:connected");
              resolve(true);
            } catch (e) {
              reject(e);
            }
          };

          _ws.onmessage = (event) => this._handleMessage(event);

          _ws.onerror = (error) => {
            console.error("[cTrader] ❌ Erro:", error);
            reject(error);
          };

          _ws.onclose = () => {
            _isConnected = false;
            console.log("[cTrader] 🔌 Desconectado");
            window.Panda?.Events?.emit("ctrader:disconnected");
          };
        } catch (e) {
          reject(e);
        }
      });
    },

    disconnect() {
      if (_ws) {
        _ws.close();
        _ws = null;
        _isConnected = false;
      }
    },

    isConnected() {
      return _isConnected;
    },

    async _authenticate() {
      if (!_credentials) throw new Error("Credenciais não configuradas");

      // ProtoOAApplicationAuthReq
      const authReq = {
        payloadType: 2100,
        clientId: _credentials.clientId,
        clientSecret: _credentials.clientSecret,
      };

      const response = await this._send(authReq);

      if (response.payloadType !== 2101) {
        throw new Error("Falha na autenticação da aplicação");
      }

      // ProtoOAAccountAuthReq
      const accountAuth = {
        payloadType: 2102,
        accessToken: _credentials.accessToken,
      };

      const accResponse = await this._send(accountAuth);

      if (accResponse.payloadType === 2103) {
        console.log("[cTrader] ✅ Autenticado com sucesso");
        return true;
      }

      throw new Error("Falha na autenticação da conta");
    },

    // ==========================================
    // MARKET DATA
    // ==========================================

    /**
     * Obtém símbolo por nome
     */
    async getSymbol(symbolName, ctidTraderAccountId) {
      const request = {
        payloadType: 2114, // ProtoOASymbolByIdReq
        ctidTraderAccountId,
        symbolId: symbolName,
      };
      return await this._send(request);
    },

    /**
     * Obtém preços em tempo real (subscribe)
     */
    async subscribeSpots(symbolIds, ctidTraderAccountId) {
      const request = {
        payloadType: 2123, // ProtoOASubscribeSpotsReq
        ctidTraderAccountId,
        symbolId: symbolIds,
      };
      return await this._send(request);
    },

    /**
     * Obtém dados históricos (OHLC)
     */
    async getHistoricalData(
      symbolId,
      period,
      fromTimestamp,
      toTimestamp,
      ctidTraderAccountId,
    ) {
      const request = {
        payloadType: 2134, // ProtoOAGetTrendbarsReq
        ctidTraderAccountId,
        symbolId,
        period, // M1, M5, H1, D1, etc
        fromTimestamp,
        toTimestamp,
      };
      return await this._send(request);
    },

    // ==========================================
    // TRADING
    // ==========================================

    /**
     * Abre nova ordem
     */
    async placeOrder(orderParams, ctidTraderAccountId) {
      const request = {
        payloadType: 2126, // ProtoOANewOrderReq
        ctidTraderAccountId,
        symbolId: orderParams.symbolId,
        orderType: orderParams.type, // MARKET, LIMIT, STOP
        tradeSide: orderParams.side, // BUY, SELL
        volume: orderParams.volume,
        limitPrice: orderParams.limitPrice,
        stopPrice: orderParams.stopPrice,
        takeProfit: orderParams.takeProfit,
        stopLoss: orderParams.stopLoss,
        comment: orderParams.comment || "Panda Trading",
      };
      return await this._send(request);
    },

    /**
     * Fecha posição
     */
    async closePosition(positionId, volume, ctidTraderAccountId) {
      const request = {
        payloadType: 2128, // ProtoOAClosePositionReq
        ctidTraderAccountId,
        positionId,
        volume,
      };
      return await this._send(request);
    },

    /**
     * Modifica posição (SL/TP)
     */
    async modifyPosition(
      positionId,
      stopLoss,
      takeProfit,
      ctidTraderAccountId,
    ) {
      const request = {
        payloadType: 2130, // ProtoOAAmendPositionSLTPReq
        ctidTraderAccountId,
        positionId,
        stopLoss,
        takeProfit,
      };
      return await this._send(request);
    },

    /**
     * Lista posições abertas
     */
    async getOpenPositions(ctidTraderAccountId) {
      const request = {
        payloadType: 2132, // ProtoOAReconcileReq
        ctidTraderAccountId,
      };
      return await this._send(request);
    },

    // ==========================================
    // AI ASSISTANT (Consome Panda Coins)
    // ==========================================

    AI: {
      /**
       * Analisa mercado com IA
       */
      async analyzeMarket(symbol, timeframe = "H1") {
        await _charge(CONFIG.COSTS.ANALYSIS, "CTRADER_ANALYSIS");

        // Obter dados
        const now = Date.now();
        const from = now - 24 * 60 * 60 * 1000; // 24h

        const data = await CTraderAPI.getHistoricalData(
          symbol,
          timeframe,
          from,
          now,
          _credentials?.accountId,
        );

        const prompt = `Analise estes dados de ${symbol} (${timeframe}):
${JSON.stringify(data.trendbar?.slice(-20))}

Forneça:
1. Tendência atual (alta/baixa/lateral)
2. Suportes e resistências chave
3. Sugestão de entrada
4. Stop Loss e Take Profit recomendados`;

        return await window.Panda?.Brain?.chat(prompt, { gem: "analyst" });
      },

      /**
       * Gera sinal de trading
       */
      async generateSignal(symbol) {
        await _charge(CONFIG.COSTS.SIGNAL, "CTRADER_SIGNAL");

        const analysis = await this.analyzeMarket(symbol);

        const prompt = `Baseado nesta análise:
${analysis}

Gere um sinal de trading estruturado:
{
  "symbol": "${symbol}",
  "direction": "BUY ou SELL",
  "entry": preço_entrada,
  "stopLoss": sl_price,
  "takeProfit": tp_price,
  "confidence": 0-100,
  "reasoning": "motivo breve"
}`;

        const response = await window.Panda?.Brain?.chat(prompt);
        try {
          return JSON.parse(response?.text || response);
        } catch {
          return { raw: response };
        }
      },

      /**
       * Backtest simples
       */
      async backtest(strategy, symbol, period = "1M") {
        await _charge(CONFIG.COSTS.BACKTEST, "CTRADER_BACKTEST");

        const prompt = `Simule este backtest:
Estratégia: ${JSON.stringify(strategy)}
Símbolo: ${symbol}
Período: ${period}

Retorne métricas: Win Rate, Profit Factor, Max Drawdown, Total Trades`;

        return await window.Panda?.Brain?.chat(prompt);
      },
    },

    // ==========================================
    // HELPERS
    // ==========================================

    async _send(payload) {
      if (!_ws || _ws.readyState !== WebSocket.OPEN) {
        throw new Error("WebSocket não conectado");
      }

      const clientMsgId = `${Date.now()}_${_requestId++}`;

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          _pendingRequests.delete(clientMsgId);
          reject(new Error("Timeout"));
        }, 30000);

        _pendingRequests.set(clientMsgId, { resolve, reject, timeout });

        const message = JSON.stringify({
          ...payload,
          clientMsgId,
        });

        _ws.send(message);
      });
    },

    _handleMessage(event) {
      try {
        const data = JSON.parse(event.data);
        const clientMsgId = data.clientMsgId;

        if (clientMsgId && _pendingRequests.has(clientMsgId)) {
          const { resolve, timeout } = _pendingRequests.get(clientMsgId);
          clearTimeout(timeout);
          _pendingRequests.delete(clientMsgId);
          resolve(data);
        }

        // Emit events for real-time data
        if (data.payloadType === 2124) {
          // SpotEvent
          window.Panda?.Events?.emit("ctrader:spot", data);
        } else if (data.payloadType === 2127) {
          // ExecutionEvent
          window.Panda?.Events?.emit("ctrader:execution", data);
        }
      } catch (e) {
        console.error("[cTrader] Parse error:", e);
      }
    },
  };

  // ============================================================================
  // HELPER
  // ============================================================================

  async function _charge(amount, reason) {
    const result = await window.Panda?.Wallet?.charge(amount, reason);
    if (!result?.success) {
      throw new Error(`Saldo insuficiente: ${amount} PC`);
    }
  }

  // ============================================================================
  // EXPOSE
  // ============================================================================

  window.Panda = window.Panda || {};
  window.Panda.CTrader = CTraderAPI;

  console.log("[cTrader] 🐼 Panda Trading API loaded");
})(window);
