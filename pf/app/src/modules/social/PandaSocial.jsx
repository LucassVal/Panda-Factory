/**
 * 💬 Panda Social Hub v2.0
 *
 * Módulo unificado de redes sociais. Agrega WhatsApp, Instagram e futuros
 * canais num Inbox consolidado com AI Auto-Reply isolado por rede.
 *
 * @version 2.0.0
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { gasPost } from "../../services/callGAS";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdAllInbox } from "react-icons/md";
import "./PandaSocial.css";

const NETWORKS = [
  {
    id: "all",
    label: "Tudo",
    icon: <MdAllInbox />,
    prefix: null,
    color: "#94a3b8",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: <FaWhatsapp />,
    prefix: "WA",
    color: "#25D366",
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: <FaInstagram />,
    prefix: "IG",
    color: "#E1306C",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: <FaFacebook />,
    prefix: "FB",
    color: "#1877F2",
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: <FaTiktok />,
    prefix: "TK",
    color: "#00f2fe",
  },
  {
    id: "twitter",
    label: "Twitter / X",
    icon: <FaXTwitter />,
    prefix: "TW",
    color: "#ffffff",
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: <FaYoutube />,
    prefix: "YT",
    color: "#FF0000",
  },
];

export default function PandaSocial({ onClose }) {
  // ── State ──
  const [activeNetwork, setActiveNetwork] = useState("all");
  const [chats, setChats] = useState([]); // { networkId, prefix, ...chatData }
  const [selectedChat, setSelectedChat] = useState(null); // The exact chat object
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Network connection states
  const [networkStatus, setNetworkStatus] = useState({
    whatsapp: { connected: false, aiOn: true },
    instagram: { connected: false, aiOn: true },
  });

  // ── 1. Init: Load all active chats ──
  useEffect(() => {
    let cancelled = false;

    async function init() {
      // In a real scenario we could ping all enabled networks. Start with WA+IG.
      try {
        const [waStatus, igStatus] = await Promise.all([
          gasPost("WA_STATUS").catch(() => ({ status: "ERROR" })),
          gasPost("IG_STATUS").catch(() => ({ status: "ERROR" })),
        ]);

        if (cancelled) return;

        setNetworkStatus((prev) => ({
          ...prev,
          whatsapp: {
            ...prev.whatsapp,
            connected: waStatus.connected || false,
          },
          instagram: {
            ...prev.instagram,
            connected: igStatus.connected || false,
          },
        }));

        // Load chats
        const fetchPromises = [];
        if (waStatus.connected)
          fetchPromises.push(
            gasPost("WA_GET_CHATS")
              .then((r) => ({ res: r, net: "whatsapp" }))
              .catch(() => ({ res: null })),
          );
        if (igStatus.connected)
          fetchPromises.push(
            gasPost("IG_GET_CHATS")
              .then((r) => ({ res: r, net: "instagram" }))
              .catch(() => ({ res: null })),
          );

        const results = await Promise.all(fetchPromises);
        let allChats = [];

        results.forEach(({ res, net }) => {
          if (res && res.status === "SUCCESS" && res.chats) {
            const mapped = res.chats.map((c) => ({
              ...c,
              networkId: net,
              prefix: NETWORKS.find((n) => n.id === net)?.prefix,
            }));
            allChats = [...allChats, ...mapped];
          }
        });

        // Sort by recency
        allChats.sort(
          (a, b) =>
            new Date(b.lastTimestamp || 0) - new Date(a.lastTimestamp || 0),
        );

        if (!cancelled) {
          setChats(allChats);
          setLoadingChats(false);
        }
      } catch (err) {
        console.error("[PandaSocial] Init error:", err);
      } finally {
        if (!cancelled) setLoadingChats(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── 2. Load messages for selected chat ──
  useEffect(() => {
    if (!selectedChat) return;
    let cancelled = false;

    async function loadMessages() {
      try {
        const payload = { chatId: selectedChat.chatId };
        const actionName = `${selectedChat.prefix}_GET_MESSAGES`;

        // Mock if not WA or IG
        if (!["WA", "IG"].includes(selectedChat.prefix)) {
          setMessages([
            {
              id: 1,
              direction: "incoming",
              message: "Inbox não integrado à API real ainda.",
              timestamp: new Date().toISOString(),
            },
          ]);
          return;
        }

        const res = await gasPost(actionName, payload);
        if (!cancelled && res.status === "SUCCESS") {
          setMessages(res.messages || []);
          // Mark as read in local state
          setChats((prev) =>
            prev.map((c) =>
              c.chatId === selectedChat.chatId ? { ...c, unread: false } : c,
            ),
          );
        }
      } catch (err) {
        console.error("[PandaSocial] Load messages error:", err);
      }
    }

    loadMessages();
    return () => {
      cancelled = true;
    };
  }, [selectedChat]);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send Message ──
  const handleSend = useCallback(async () => {
    if (!inputMessage.trim() || !selectedChat || sending) return;

    const msg = inputMessage.trim();
    const targetChat = { ...selectedChat };
    setInputMessage("");
    setSending(true);

    const tempMsg = {
      id: "temp_" + Date.now(),
      chatId: targetChat.chatId,
      direction: "outgoing",
      message: msg,
      senderName: "Você",
      messageType: "text",
      timestamp: new Date().toISOString(),
      sending: true,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      if (!["WA", "IG"].includes(targetChat.prefix)) {
        // Mock sending
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempMsg.id ? { ...m, sending: false } : m,
            ),
          );
          setSending(false);
        }, 1000);
        return;
      }

      const res = await gasPost(`${targetChat.prefix}_SEND`, {
        chatId: targetChat.chatId,
        message: msg,
      });

      if (res.status === "SUCCESS") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempMsg.id
              ? { ...m, id: res.messageId, sending: false }
              : m,
          ),
        );
        // Elevate chat on list
        setChats((prev) => {
          const others = prev.filter((c) => c.chatId !== targetChat.chatId);
          const updated = prev.find((c) => c.chatId === targetChat.chatId);
          if (updated) {
            updated.lastMessage = msg;
            updated.lastTimestamp = new Date().toISOString();
            return [updated, ...others];
          }
          return prev;
        });
      }
    } catch (err) {
      console.error("[PandaSocial] Send error:", err);
    } finally {
      setSending(false);
    }
  }, [inputMessage, selectedChat, sending]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Filters & Formatting ──
  const filteredChats = useMemo(() => {
    return chats.filter((c) => {
      const matchSearch =
        !searchQuery ||
        (c.senderName || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (c.chatId || "").includes(searchQuery);

      const matchNetwork =
        activeNetwork === "all" || c.networkId === activeNetwork;
      return matchSearch && matchNetwork;
    });
  }, [chats, searchQuery, activeNetwork]);

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
  };

  const netIcon = (netId) => NETWORKS.find((n) => n.id === netId)?.icon || "💬";

  return (
    <div className="pf-social-hub">
      {/* ── Navbar Topo: Seleção de Canais ── */}
      <div className="sh-navbar">
        <div className="sh-nav-brand">
          <div className="sh-nav-logo">💬</div>
          <h3>Panda Social</h3>
        </div>
        <div className="sh-nav-networks">
          {NETWORKS.map((net) => {
            // Quick offline/online indicator dot for real networks
            const status = networkStatus[net.id];
            const isConnected = status?.connected;

            return (
              <button
                key={net.id}
                className={`sh-nav-btn ${activeNetwork === net.id ? "active" : ""}`}
                onClick={() => setActiveNetwork(net.id)}
              >
                {net.icon} {net.label}
                {net.id !== "all" && status && (
                  <span
                    className={`sh-nav-dot ${isConnected ? "online" : "offline"}`}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="sh-nav-actions">
          {onClose && (
            <button className="sh-close-btn" onClick={onClose} title="Fechar">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="sh-body">
        {/* ── Inbox Sidebar ── */}
        <div className="sh-sidebar">
          <div className="sh-search">
            <input
              type="text"
              placeholder="🔍 Buscar conversas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sh-search-input"
            />
          </div>

          <div className="sh-chat-list">
            {loadingChats ? (
              <div className="sh-loading">Sincronizando Inbox...</div>
            ) : filteredChats.length === 0 ? (
              <div className="sh-empty">
                {searchQuery
                  ? "Nenhum resultado 🐼"
                  : "Caixa de Entrada limpa ✨"}
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={`${chat.networkId}-${chat.chatId}`}
                  className={`sh-chat-item ${
                    selectedChat?.chatId === chat.chatId ? "active" : ""
                  } ${chat.unread ? "unread" : ""}`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="sh-chat-avatar">
                    {(chat.senderName || "?")[0].toUpperCase()}
                    <span
                      className="sh-avatar-badge"
                      style={{
                        color: NETWORKS.find((n) => n.id === chat.networkId)
                          ?.color,
                      }}
                    >
                      {netIcon(chat.networkId)}
                    </span>
                  </div>
                  <div className="sh-chat-info">
                    <div className="sh-chat-name">
                      {chat.senderName || chat.chatId}
                      {chat.unread && <span className="sh-unread-badge" />}
                    </div>
                    <div className="sh-chat-preview">
                      {chat.lastMessage || "..."}
                    </div>
                  </div>
                  <div className="sh-chat-meta">
                    <span className="sh-chat-time">
                      {formatTime(chat.lastTimestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Chat Area ── */}
        <div className="sh-chat-area">
          {!selectedChat ? (
            <div className="sh-no-chat">
              <div className="sh-no-chat-icon">💬</div>
              <h3>SOCIAL HUB INBOX</h3>
              <p>Selecione uma conversa para começar</p>
              <small>
                Responda Whatsapp, Instagram e Facebook no mesmo lugar.
              </small>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="sh-chat-header">
                <button
                  className="sh-back-btn"
                  onClick={() => setSelectedChat(null)}
                >
                  ←
                </button>
                <div className="sh-chat-header-info">
                  <span
                    className="sh-chat-header-name"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color:
                        NETWORKS.find((n) => n.id === selectedChat.networkId)
                          ?.color || "#fff",
                    }}
                  >
                    {netIcon(selectedChat.networkId)}{" "}
                    <span style={{ color: "#fff" }}>
                      {selectedChat.senderName || selectedChat.chatId}
                    </span>
                  </span>
                  <span className="sh-chat-header-detail">
                    via{" "}
                    {
                      NETWORKS.find((n) => n.id === selectedChat.networkId)
                        ?.label
                    }
                  </span>
                </div>
                <div className="sh-chat-header-actions">
                  <button
                    className="sh-ai-toggle active"
                    title="AI Auto-Reply ativo para esta rede"
                  >
                    🤖 AI ON
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="sh-messages">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`sh-message ${msg.direction} ${msg.processedByAI ? "ai" : ""} ${msg.sending ? "sending" : ""}`}
                  >
                    <div className="sh-message-bubble">
                      {msg.processedByAI && (
                        <span className="sh-ai-badge">🤖 AI</span>
                      )}
                      <p className="sh-message-text">{msg.message}</p>
                      <span className="sh-message-time">
                        {formatTime(msg.timestamp)} {msg.sending && " ⏳"}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="sh-input-bar">
                <textarea
                  className="sh-input"
                  placeholder="Escreva sua mensagem..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button
                  className="sh-send-btn"
                  onClick={handleSend}
                  disabled={!inputMessage.trim() || sending}
                >
                  {sending ? "⏳" : "➤"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
