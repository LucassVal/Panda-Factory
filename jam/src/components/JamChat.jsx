import React, { useState, useRef, useEffect } from "react";

/**
 * 🐼 Jam Chat - Omnichannel AI Chat (Bottom Right)
 *
 * Features:
 * - Floating chat button (pulsing logo)
 * - Expandable chat panel
 * - Fallout terminal style
 * - Model selector: Flash, Pro, Think, Research, Imagen
 * - 6 GEMs: Writer, Analyst, Coder, Designer, Planner, Researcher
 *
 * ARCHITECTURE:
 * - JamChat calls Panda.Brain.Gemini (SDK)
 * - SDK translates to GAS backend call
 * - Billing handled by backend
 */

// AI Models for UI
const AI_MODELS = [
  {
    id: "flash",
    name: "Flash",
    icon: "⚡",
    description: "Rápido e eficiente",
    free: true,
  },
  {
    id: "pro",
    name: "Pro",
    icon: "🧠",
    description: "Análises complexas",
    free: false,
  },
  {
    id: "thinking",
    name: "Think",
    icon: "🤔",
    description: "Raciocínio profundo",
    free: true,
  },
  {
    id: "research",
    name: "Research",
    icon: "🔬",
    description: "Pesquisa aprofundada",
    free: false,
  },
  {
    id: "imagen",
    name: "Imagen",
    icon: "🎨",
    description: "Gerar imagens",
    free: false,
  },
];

// 6 GEMs for UI (mirrors backend GEMS)
const GEMS = [
  { id: "writer", name: "Writer", icon: "✍️", description: "Escrita criativa" },
  {
    id: "analyst",
    name: "Analyst",
    icon: "📊",
    description: "Análise de dados",
  },
  { id: "coder", name: "Coder", icon: "💻", description: "Programação" },
  { id: "designer", name: "Designer", icon: "🎨", description: "UI/UX design" },
  { id: "planner", name: "Planner", icon: "📋", description: "Planejamento" },
  { id: "researcher", name: "Researcher", icon: "🔬", description: "Pesquisa" },
];

/**
 * Check if Panda SDK is available (loaded via pf.sdk.js)
 */
function isPandaSDKAvailable() {
  return (
    typeof window !== "undefined" &&
    typeof window.Panda !== "undefined" &&
    typeof window.Panda.Brain !== "undefined"
  );
}

/**
 * Call GAS backend via Panda SDK or direct fetch
 * Falls back to direct GAS call if SDK not loaded
 */
async function callBrain(action, payload) {
  // Use Panda SDK if available
  if (isPandaSDKAvailable()) {
    switch (action) {
      case "chat":
        return window.Panda.Brain.Gemini.chat(payload.message, payload.options);
      case "gems":
        return window.Panda.Brain.Gemini.getGems();
      case "analyze":
        return window.Panda.Brain.Gemini.analyze(
          payload.data,
          payload.question,
        );
      case "code":
        return window.Panda.Brain.Gemini.code(payload.task, payload.language);
      case "write":
        return window.Panda.Brain.Gemini.write(payload.topic, payload.format);
      case "design":
        return window.Panda.Brain.Gemini.design(payload.concept);
      case "plan":
        return window.Panda.Brain.Gemini.plan(payload.objective);
      case "research":
        return window.Panda.Brain.Gemini.research(payload.topic);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  // Direct GAS call fallback (for development/testing)
  const GAS_URL =
    import.meta.env?.VITE_GAS_URL || localStorage.getItem("GAS_URL");

  if (!GAS_URL) {
    throw new Error(
      "SDK não carregado. Configure GAS_URL ou carregue pf.sdk.js",
    );
  }

  const response = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: `brain.${action}`,
      payload,
      token: localStorage.getItem("panda_token") || "",
    }),
  });

  return response.json();
}

function JamChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "> Olá! Sistema online. Como posso ajudar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState("flash");
  const [activeGem, setActiveGem] = useState(null);
  const [showGems, setShowGems] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);

  // Session stats
  const [sessionStats, setSessionStats] = useState({
    tokensUsed: 0,
    tokensAvailable: 500000,
    pcUsed: 0,
    pcAvailable: 1000,
    gasEnabled: false,
    gasRate: 0.03,
  });

  const messagesEndRef = useRef(null);

  // Check SDK/API status on mount
  useEffect(() => {
    const checkApi = () => {
      const sdkReady = isPandaSDKAvailable();
      const gasConfigured = !!localStorage.getItem("GAS_URL");
      setIsApiReady(sdkReady || gasConfigured);
    };

    checkApi();
    // Re-check when SDK might load
    window.addEventListener("panda:ready", checkApi);
    return () => window.removeEventListener("panda:ready", checkApi);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      let response;

      // Use GEM if active
      if (activeGem) {
        const gemAction = activeGem; // writer, analyst, coder, etc.
        response = await callBrain(gemAction, {
          topic: currentInput,
          task: currentInput,
          concept: currentInput,
          objective: currentInput,
          message: currentInput,
        });
      }
      // Regular chat with model
      else {
        response = await callBrain("chat", {
          message: currentInput,
          options: {
            model: activeModel,
            gem: null,
          },
        });
      }

      const modelInfo = AI_MODELS.find((m) => m.id === activeModel);
      const gemInfo = activeGem ? GEMS.find((g) => g.id === activeGem) : null;

      const prefix = gemInfo
        ? `[${gemInfo.icon} ${gemInfo.name}]`
        : `[${modelInfo?.icon} ${modelInfo?.name}]`;

      // Update session stats from response
      if (response.tokens || response.cost) {
        setSessionStats((prev) => ({
          ...prev,
          tokensUsed: prev.tokensUsed + (response.tokens || 0),
          pcUsed: prev.pcUsed + (response.cost || 0),
        }));
      }

      const billingInfo = response.cost
        ? ` (${response.cost.toFixed(2)} PC)`
        : "";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `> ${prefix}${billingInfo}\n\n${response.text || response.response}`,
          model: activeModel,
          gem: activeGem,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `> ERRO: ${error.message || "Falha na conexão. Tente novamente."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectGem = (gemId) => {
    setActiveGem(gemId);
    setShowGems(false);
  };

  const clearGem = () => {
    setActiveGem(null);
    setShowGems(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className={`jam-chat-fab ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Panda AI Chat"
      >
        {isOpen ? (
          "✕"
        ) : (
          <img
            src="/jam/panda-chat-logo.png"
            alt="Chat"
            className="jam-chat-fab-logo"
          />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="jam-chat-panel">
          {/* Header */}
          <div className="jam-chat-header">
            <img
              src="/jam/panda-chat-logo.png"
              alt="Panda"
              className="jam-chat-header-logo"
            />
            <span className="jam-chat-title">Panda AI</span>

            {/* Session Stats with Hover */}
            <div
              className="jam-session-stats"
              title={`
📊 SESSÃO
━━━━━━━━━━
🪙 PC Usado: ${sessionStats.pcUsed.toFixed(2)} PC
🪙 PC Disponível: ${sessionStats.pcAvailable.toFixed(0)} PC
━━━━━━━━━━
📝 Tokens Usados: ${sessionStats.tokensUsed.toLocaleString()}
📝 Tokens Grátis: ${sessionStats.tokensAvailable.toLocaleString()}
━━━━━━━━━━
⛽ Gas: ${sessionStats.gasEnabled ? `ATIVO (${(sessionStats.gasRate * 100).toFixed(0)}%)` : "DESATIVADO"}
            `.trim()}
            >
              <span className="jam-stats-pc">
                {sessionStats.pcUsed.toFixed(1)} PC
              </span>
              <span
                className={`jam-stats-gas ${sessionStats.gasEnabled ? "active" : "inactive"}`}
              >
                ⛽ {sessionStats.gasEnabled ? "ON" : "OFF"}
              </span>
            </div>

            <span
              className={`jam-api-status ${isApiReady ? "ready" : "offline"}`}
            >
              {isApiReady ? "●" : "○"}
            </span>
            <button
              className="jam-chat-gems-toggle"
              onClick={() => setShowGems(!showGems)}
              title="GEMs - Especialistas"
            >
              {activeGem ? GEMS.find((g) => g.id === activeGem)?.icon : "💎"}
            </button>
          </div>

          {/* GEMs Panel */}
          {showGems && (
            <div className="jam-chat-gems-panel">
              <div className="jam-chat-gems-header">
                <span>💎 GEMs - Especialistas</span>
                {activeGem && (
                  <button className="jam-gem-clear" onClick={clearGem}>
                    ✕ Limpar
                  </button>
                )}
              </div>
              <div className="jam-chat-gems-grid">
                {GEMS.map((gem) => (
                  <button
                    key={gem.id}
                    className={`jam-chat-gem ${activeGem === gem.id ? "active" : ""}`}
                    onClick={() => selectGem(gem.id)}
                    title={gem.description}
                  >
                    <span className="jam-gem-icon">{gem.icon}</span>
                    <span className="jam-gem-name">{gem.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Model Selector */}
          <div className="jam-chat-models">
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                className={`jam-chat-model ${activeModel === model.id ? "active" : ""} ${!model.free ? "premium" : ""}`}
                onClick={() => setActiveModel(model.id)}
                title={`${model.name}: ${model.description}`}
              >
                <span className="jam-model-icon">{model.icon}</span>
                <span className="jam-model-name">{model.name}</span>
              </button>
            ))}
          </div>

          {/* Active GEM indicator */}
          {activeGem && (
            <div className="jam-chat-gem-active">
              <span className="jam-gem-badge">
                {GEMS.find((g) => g.id === activeGem)?.icon}{" "}
                {GEMS.find((g) => g.id === activeGem)?.name} ativo
              </span>
            </div>
          )}

          {/* Messages */}
          <div className="jam-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`jam-chat-message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="jam-chat-message assistant loading">
                <span className="jam-typing">●●●</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="jam-chat-input-wrapper">
            <textarea
              className="jam-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                activeGem
                  ? `Pergunte ao ${GEMS.find((g) => g.id === activeGem)?.name}...`
                  : "Digite sua mensagem..."
              }
              rows={1}
            />
            <button
              className="jam-chat-send"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default JamChat;
