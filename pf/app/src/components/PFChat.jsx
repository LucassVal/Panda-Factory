import React, { useState, useRef, useEffect } from "react";
import { injectContext, getUIContext } from "../services/uiContext";
import { useFounderBrain } from "../hooks/useFounderBrain";
import { Brain as GASBrain } from "../services/callGAS";
import Orchestrator from "../services/PFOrchestrator";

/**
 * Jam Chat v2.1 - Omnichannel AI Chat (Bottom Right)
 *
 * v2.1: MCP Tool Context injection (Orchestrator integration)
 * v2.0: Production Gemini wiring via callGAS.Brain (TICKET-11)
 * v1.2: Trail bubble mascot greetings for returning users
 * v1.1: Auto-open on first login + welcome CTA
 *
 * Features:
 * - Floating chat button (pulsing logo)
 * - Expandable chat panel
 * - Fallout terminal style
 * - Model selector: Flash, Pro, Think, Research, Imagen
 * - 6 GEMs: Writer, Analyst, Coder, Designer, Planner, Researcher
 * - MCP Tool Discovery: AI knows which module tools are available
 *
 * ARCHITECTURE:
 * - PFChat calls callGAS.Brain (primary) → GAS doPost → PF_Brain_Core.gs → Gemini API
 * - Falls back to Panda.Brain.Gemini (SDK) if callGAS unavailable
 * - Billing handled by backend (PC debit per request)
 * - MCP context injected via panda:mcp-tools-updated event from App.jsx
 */

// Map UI model IDs → Gemini 3 API model names (PF_GEMINI_REFERENCE.md §2.1)
const MODEL_MAP = {
  flash: "gemini-3-flash-preview",
  pro: "gemini-3-pro-preview",
  thinking: "gemini-3-flash-preview", // Uses thinkingLevel: "high"
  research: "deep-research-pro-preview-12-2025",
  imagen: "gemini-3-pro-image-preview",
};

// AI Models for UI
const AI_MODELS = [
  {
    id: "flash",
    name: "Flash",
    icon: "⚡",
    description: "Fast and efficient",
    free: true,
  },
  {
    id: "pro",
    name: "Pro",
    icon: "🧠",
    description: "Complex analysis",
    free: false,
  },
  {
    id: "thinking",
    name: "Think",
    icon: "🤔",
    description: "Deep reasoning",
    free: true,
  },
  {
    id: "research",
    name: "Research",
    icon: "🔬",
    description: "In-depth research",
    free: false,
  },
  {
    id: "imagen",
    name: "Imagen",
    icon: "🎨",
    description: "Image generation",
    free: false,
  },
];

// 6 GEMs for UI (mirrors backend GEMS)
const GEMS = [
  { id: "writer", name: "Writer", icon: "✍️", description: "Creative writing" },
  {
    id: "analyst",
    name: "Analyst",
    icon: "📊",
    description: "Data analysis",
  },
  { id: "coder", name: "Coder", icon: "💻", description: "Programming" },
  { id: "designer", name: "Designer", icon: "🎨", description: "UI/UX design" },
  { id: "planner", name: "Planner", icon: "📋", description: "Planning" },
  { id: "researcher", name: "Researcher", icon: "🔬", description: "Research" },
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
 * Connection mode: LIVE (GAS configured), SDK (SDK only), OFFLINE
 */
function getConnectionMode() {
  const gasUrl =
    import.meta.env?.VITE_GAS_URL || localStorage.getItem("GAS_URL");
  if (gasUrl) return "LIVE";
  if (isPandaSDKAvailable()) return "SDK";
  return "OFFLINE";
}

/**
 * Call Brain AI — Primary: callGAS.Brain, Fallback: SDK
 * Routes through GAS backend → PF_Brain_Core.gs → Gemini API
 */
async function callBrain(action, payload) {
  const mode = getConnectionMode();

  // PRIMARY: callGAS.Brain (GAS backend → Gemini)
  if (mode === "LIVE") {
    switch (action) {
      case "chat":
        return GASBrain.chat(payload.message, {
          gemId: payload.options?.gem || null,
          model: MODEL_MAP[payload.options?.model] || MODEL_MAP.flash,
          sessionId: payload.options?.sessionId || null,
        });
      case "gems":
        return GASBrain.getGems();
      case "analyze":
        return GASBrain.analyze(payload.data, payload.question);
      default:
        // GEM actions (writer, analyst, coder, etc.) → chat with gemId
        return GASBrain.chat(
          payload.message ||
            payload.topic ||
            payload.task ||
            payload.concept ||
            payload.objective,
          {
            gemId: action,
            model: MODEL_MAP.flash,
          },
        );
    }
  }

  // FALLBACK: Panda SDK (if loaded via pf.sdk.js)
  if (mode === "SDK") {
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
      default:
        return window.Panda.Brain.Gemini.chat(
          payload.message || payload.topic,
          { gem: action },
        );
    }
  }

  // OFFLINE: No backend available
  throw new Error(
    "No AI backend available. Configure GAS_URL or load pf.sdk.js",
  );
}

function PFChat() {
  // 🧠 Founder Brain — personality compass for ALL users, evolves for Founder
  const { systemPrompt, appendInsight, isFounderBrain, insightCount } =
    useFounderBrain();

  // Auto-open on first login for onboarding
  const isFirstVisit = !localStorage.getItem("pf_chat_welcomed");
  const [isOpen, setIsOpen] = useState(isFirstVisit);
  const [showTrailBubble, setShowTrailBubble] = useState(false);
  const [trailMessage, setTrailMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: isFirstVisit
        ? "> Welcome to Panda Fabrics!\n\nI'm your AI assistant. I can help you:\n\n🎨 Create and organize projects on the canvas\n🛍️ Explore extensions in the Store\n💡 Answer any questions about the platform\n\n**Chat with me to learn more!** ✍️"
        : "> Hello! System online. How can I help?",
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

  // 📡 MCP Tool Context — received from App.jsx via global event
  const [mcpContext, setMcpContext] = useState("");

  // Check SDK/API status on mount
  useEffect(() => {
    const checkApi = () => {
      const mode = getConnectionMode();
      setIsApiReady(mode !== "OFFLINE");
    };

    checkApi();
    // Re-check when SDK might load
    window.addEventListener("panda:ready", checkApi);

    // 🧠 Listen for MCP tools updates from Orchestrator
    const handleMCPUpdate = (e) => {
      if (e.detail?.context) {
        setMcpContext(e.detail.context);
        console.log("📡 PFChat: MCP tools context updated");
      }
    };
    window.addEventListener("panda:mcp-tools-updated", handleMCPUpdate);

    return () => {
      window.removeEventListener("panda:ready", checkApi);
      window.removeEventListener("panda:mcp-tools-updated", handleMCPUpdate);
    };
  }, []);

  // Mark as welcomed after first open
  useEffect(() => {
    if (isOpen && !localStorage.getItem("pf_chat_welcomed")) {
      localStorage.setItem("pf_chat_welcomed", "true");
    }
  }, [isOpen]);

  // Trail bubble for returning users — friendly mascot reminder
  useEffect(() => {
    if (isFirstVisit || isOpen) return;

    const hour = new Date().getHours();
    const greetings = [
      hour < 12
        ? "☀️ Good morning! I'm here if you need me."
        : hour < 18
          ? "🌤️ Good afternoon! Any questions, just ask."
          : "🌙 Good evening! Need any help?",
      "Hi! Want to explore something new?",
      "💡 Tip: try opening the Store!",
      "✨ I'm here if you need me!",
    ];
    const msg = greetings[Math.floor(Math.random() * greetings.length)];

    const showTimer = setTimeout(() => {
      setTrailMessage(msg);
      setShowTrailBubble(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setShowTrailBubble(false);
    }, 8000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isFirstVisit, isOpen]);

  // External toggle support (Welcome Overlay, Dock, etc.)
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("panda:chat-toggle-internal", handleToggle);
    return () =>
      window.removeEventListener("panda:chat-toggle-internal", handleToggle);
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

    // AUTO-INJECT UI CONTEXT (all agents, all tiers)
    const messageWithContext = injectContext(currentInput);

    // 🧠 [S1B] Inject Tool Format Instruction
    const toolInstruction = `
[REGRAS DE EXECUÇÃO MCP]
Se precisar executar uma ferramenta, use EXATAMENTE este formato no final da sua resposta:
<tool_call:nome_da_ferramenta>{"parametro": "valor"}</tool_call>
Não use blocos de código markdown (\`\`\`) para a tag de ferramenta.
`;

    // 🧠 Inject Founder Brain personality + MCP tool context into every call
    let enrichedMessage = messageWithContext;
    if (mcpContext) {
      enrichedMessage = `[MCP Tools Available]\n${mcpContext}\n${toolInstruction}\n\n${enrichedMessage}`;
    }
    const messageWithBrain = systemPrompt
      ? `[System Context]\n${systemPrompt}\n\n[User Message]\n${enrichedMessage}`
      : enrichedMessage;

    try {
      let response;

      // Use GEM if active
      if (activeGem) {
        const gemAction = activeGem; // writer, analyst, coder, etc.
        response = await callBrain(gemAction, {
          topic: messageWithBrain,
          task: messageWithBrain,
          concept: messageWithBrain,
          objective: messageWithBrain,
          message: messageWithBrain,
        });
      }
      // Regular chat with model
      else {
        response = await callBrain("chat", {
          message: messageWithBrain,
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

      const aiText = response.text || response.response;

      // 🧠 [S1B] TOOL DISCOVERY & EXECUTION LOOP
      const toolMatch = aiText.match(/<tool_call:(\w+)>(.*?)<\/tool_call>/s);

      if (toolMatch) {
        const toolName = toolMatch[1];
        let args = {};
        try {
          args = JSON.parse(toolMatch[2]);
        } catch (e) {
          console.warn("Failed to parse tool args", e);
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `> 🛠️ **Executando:** \`${toolName}\`...`,
          },
        ]);

        const result = await Orchestrator.executeTool(toolName, args);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              result.status === "SUCCESS"
                ? `> ✅ **Sucesso:** Ação \`${toolName}\` concluída.`
                : `> ❌ **Erro:** Falha ao executar \`${toolName}\`: ${result.message}`,
          },
        ]);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `> ${prefix}${billingInfo}\n\n${aiText.replace(/<tool_call:.*?<\/tool_call>/gs, "").trim()}`,
          model: activeModel,
          gem: activeGem,
        },
      ]);

      // 🧠 Founder-only: evolve brain with conversation insights
      if (isFounderBrain) {
        appendInsight(currentInput, aiText);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `> ERROR: ${error.message || "Connection failed. Please try again."}`,
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
      {/* Floating Button Removed - Now triggered from Dock via pf:chat-toggle-internal */}

      {/* Chat Panel */}
      {isOpen && (
        <div className="pf-chat-panel">
          {/* Header */}
          <div className="pf-chat-header">
            <img
              src="./panda-chat-logo.png"
              alt="Panda"
              className="pf-chat-header-logo"
            />
            <span className="pf-chat-title">PANDA AI</span>

            {/* Session Stats with Hover */}
            <div
              className="pf-session-stats"
              title={`
📊 SESSION
━━━━━━━━━━
🪙 PC Used: ${sessionStats.pcUsed.toFixed(2)} PC
🪙 PC Available: ${sessionStats.pcAvailable.toFixed(0)} PC
━━━━━━━━━━
📝 Tokens Used: ${sessionStats.tokensUsed.toLocaleString()}
📝 Free Tokens: ${sessionStats.tokensAvailable.toLocaleString()}
━━━━━━━━━━
⛽ Gas: ${sessionStats.gasEnabled ? `ACTIVE (${(sessionStats.gasRate * 100).toFixed(0)}%)` : "DISABLED"}
            `.trim()}
            >
              <span className="pf-stats-pc">
                {sessionStats.pcUsed.toFixed(1)} PC
              </span>
              <span
                className={`pf-stats-gas ${sessionStats.gasEnabled ? "active" : "inactive"}`}
              >
                ⛽ {sessionStats.gasEnabled ? "ON" : "OFF"}
              </span>
            </div>

            <span
              className={`pf-api-status ${isApiReady ? "ready" : "offline"}`}
              title={`Mode: ${getConnectionMode()}`}
            >
              {getConnectionMode() === "LIVE"
                ? "🟢"
                : getConnectionMode() === "SDK"
                  ? "🟡"
                  : "🔴"}
            </span>
            {/* Brain indicator — shows insight count */}
            <span
              className="pf-brain-indicator"
              title={`🧠 Founder Brain: ${insightCount} insights${isFounderBrain ? " (evolving)" : " (read-only)"}`}
            >
              🧠 {insightCount}
            </span>
            <button
              className="pf-chat-gems-toggle"
              onClick={() => setShowGems(!showGems)}
              title="GEMs - SPECIALISTS"
            >
              {activeGem ? GEMS.find((g) => g.id === activeGem)?.icon : "💎"}
            </button>
          </div>

          {/* GEMs Panel */}
          {showGems && (
            <div className="pf-chat-gems-panel">
              <div className="pf-chat-gems-header">
                <span>💎 GEMs - SPECIALISTS</span>
                {activeGem && (
                  <button className="pf-gem-clear" onClick={clearGem}>
                    ✕ Clear
                  </button>
                )}
              </div>
              <div className="pf-chat-gems-grid">
                {GEMS.map((gem) => (
                  <button
                    key={gem.id}
                    className={`pf-chat-gem ${activeGem === gem.id ? "active" : ""}`}
                    onClick={() => selectGem(gem.id)}
                    title={gem.description}
                  >
                    <span className="pf-gem-icon">{gem.icon}</span>
                    <span className="pf-gem-name">{gem.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Model Selector */}
          <div className="pf-chat-models">
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                className={`pf-chat-model ${activeModel === model.id ? "active" : ""} ${!model.free ? "premium" : ""}`}
                onClick={() => setActiveModel(model.id)}
                title={`${model.name}: ${model.description}`}
              >
                <span className="pf-model-icon">{model.icon}</span>
                <span className="pf-model-name">{model.name}</span>
              </button>
            ))}
          </div>

          {/* Active GEM indicator */}
          {activeGem && (
            <div className="pf-chat-gem-active">
              <span className="pf-gem-badge">
                {GEMS.find((g) => g.id === activeGem)?.icon}{" "}
                {GEMS.find((g) => g.id === activeGem)?.name} active
              </span>
            </div>
          )}

          {/* Messages */}
          <div className="pf-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`pf-chat-message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="pf-chat-message assistant loading">
                <span className="pf-typing">●●●</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="pf-chat-input-wrapper">
            <textarea
              className="pf-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                activeGem
                  ? `Ask ${GEMS.find((g) => g.id === activeGem)?.name}...`
                  : "Type your message..."
              }
              rows={1}
            />
            <button
              className="pf-chat-send"
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

export default PFChat;
