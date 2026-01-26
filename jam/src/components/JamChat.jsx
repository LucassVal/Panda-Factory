import React, { useState, useRef, useEffect } from "react";
import PandaBrain, { GEMS as GEM_CONFIGS } from "../services/brain";
import { AI_MODELS as MODEL_CONFIGS } from "../services/gemini";

/**
 * 🐼 Jam Chat - Omnichannel AI Chat (Bottom Right)
 *
 * Features:
 * - Floating chat button (pulsing logo)
 * - Expandable chat panel
 * - Fallout terminal style
 * - Model selector: Flash, Pro, Think, Research, Imagen
 * - 6 GEMs: Writer, Analyst, Coder, Designer, Planner, Researcher
 * - INTEGRATED with Panda.Brain (Gemini 3)
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

// 6 GEMs for UI
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

// Initialize PandaBrain singleton
let brainInstance = null;

async function getBrain() {
  if (!brainInstance) {
    brainInstance = new PandaBrain({
      userTier: "founder", // TODO: Get from auth
    });

    // Get API key from environment or localStorage
    const apiKey =
      import.meta.env?.VITE_GOOGLE_AI_API_KEY ||
      localStorage.getItem("GOOGLE_AI_API_KEY") ||
      null;

    if (apiKey) {
      await brainInstance.init(apiKey);
    }
  }
  return brainInstance;
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
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");

  // Session stats
  const [sessionStats, setSessionStats] = useState({
    tokensUsed: 0,
    tokensAvailable: 500000, // Free tier default
    pcUsed: 0,
    pcAvailable: 1000, // Default PC balance
    gasEnabled: false,
    gasRate: 0.03, // 3% when enabled
  });

  const messagesEndRef = useRef(null);

  // Initialize brain on mount
  useEffect(() => {
    const initBrain = async () => {
      try {
        const brain = await getBrain();
        setIsApiReady(brain.isReady());
      } catch (error) {
        console.error("Failed to init brain:", error);
        setIsApiReady(false);
      }
    };
    initBrain();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) return;
    localStorage.setItem("GOOGLE_AI_API_KEY", apiKeyInput);
    brainInstance = null; // Reset to re-init
    const brain = await getBrain();
    setIsApiReady(brain.isReady());
    setShowApiKeyInput(false);
    setApiKeyInput("");
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const brain = await getBrain();

      if (!brain.isReady()) {
        throw new Error(
          "API não configurada. Clique no ⚙️ para adicionar sua API key.",
        );
      }

      let response;

      // Use GEM if active
      if (activeGem) {
        response = await brain.useGem(activeGem, currentInput);
      }
      // Use Imagen for image generation
      else if (activeModel === "imagen") {
        const imageResult = await brain.generateImage(currentInput);
        response = {
          text: imageResult.base64
            ? `![Imagem gerada](data:${imageResult.mimeType};base64,${imageResult.base64})`
            : "Não foi possível gerar a imagem.",
          modelIcon: "🎨",
          modelName: "Imagen",
          billing: imageResult.billing,
        };
      }
      // Regular chat
      else {
        response = await brain.chat(currentInput, {
          model: activeModel,
          useSearch: activeModel === "research",
        });
      }

      const modelInfo = AI_MODELS.find((m) => m.id === activeModel);
      const gemInfo = activeGem ? GEMS.find((g) => g.id === activeGem) : null;

      const prefix = gemInfo
        ? `[${gemInfo.icon} ${gemInfo.name}]`
        : `[${response.modelIcon || modelInfo?.icon} ${response.modelName || modelInfo?.name}]`;

      const billingInfo = response.billing
        ? ` (${response.billing.free ? "FREE" : response.billing.costPC.toFixed(2) + " PC"})`
        : "";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `> ${prefix}${billingInfo}\n\n${response.text}`,
          model: activeModel,
          gem: activeGem,
          billing: response.billing,
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
              className="jam-chat-settings"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              title="Configurar API Key"
            >
              ⚙️
            </button>
            <button
              className="jam-chat-gems-toggle"
              onClick={() => setShowGems(!showGems)}
              title="GEMs - Especialistas"
            >
              {activeGem ? GEMS.find((g) => g.id === activeGem)?.icon : "💎"}
            </button>
          </div>

          {/* API Key Input */}
          {showApiKeyInput && (
            <div className="jam-chat-api-input">
              <input
                type="password"
                placeholder="Cole sua Google AI API Key..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
              />
              <button onClick={handleSaveApiKey}>Salvar</button>
            </div>
          )}

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
