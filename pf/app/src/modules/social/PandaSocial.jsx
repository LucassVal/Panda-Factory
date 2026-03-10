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
import { useAuth } from "../../hooks/useAuth";
import { getDatabase, ref, onValue, off, push, set } from "firebase/database";
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
  const { user } = useAuth();

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

  const getEffectiveUid = useCallback(() => {
    return (
      user?.uid || localStorage.getItem("panda_user") || "admin_placeholder"
    );
  }, [user]);

  // ── 1. Init: Load all active chats via RTDB ──
  useEffect(() => {
    let cancelled = false;
    const db = getDatabase();
    const uid = getEffectiveUid();

    async function initStatus() {
      try {
        const [waStatus, igStatus] = await Promise.all([
          gasPost("WA_STATUS").catch(() => ({ connected: true })),
          gasPost("IG_STATUS").catch(() => ({ connected: true })),
        ]);
        if (cancelled) return;
        setNetworkStatus((prev) => ({
          ...prev,
          whatsapp: {
            ...prev.whatsapp,
            connected: waStatus.connected !== false,
          },
          instagram: {
            ...prev.instagram,
            connected: igStatus.connected !== false,
          },
        }));
      } catch (err) {}
    }
    initStatus();

    const handleData = (snapshot, netId) => {
      if (cancelled) return;
      if (snapshot.exists()) {
        const data = snapshot.val();
        const mappedChats = [];
        Object.entries(data).forEach(([senderId, senderData]) => {
          if (senderId === "status" || senderId === "messages") return;

          const msgObj = senderData.messages || {};
          const msgKeys = Object.keys(msgObj).sort();
          let lastMsg = "...";
          let lastTs = null;
          let unreadCount = 0;

          if (msgKeys.length > 0) {
            const lastKey = msgKeys[msgKeys.length - 1];
            lastMsg =
              msgObj[lastKey].content || msgObj[lastKey].message || "[Mídia]";
            lastTs = msgObj[lastKey].timestamp || null;
            unreadCount = Object.values(msgObj).filter(
              (m) => m.direction === "inbound" && !m.read,
            ).length;
          }

          mappedChats.push({
            chatId: senderId,
            senderName: senderId,
            networkId: netId,
            prefix: NETWORKS.find((n) => n.id === netId)?.prefix,
            unread: unreadCount > 0,
            lastMessage: lastMsg,
            lastTimestamp: lastTs,
          });
        });

        setChats((prev) => {
          const removedOthers = prev.filter((c) => c.networkId !== netId);
          const newAll = [...removedOthers, ...mappedChats];
          newAll.sort(
            (a, b) =>
              new Date(b.lastTimestamp || 0) - new Date(a.lastTimestamp || 0),
          );
          return newAll;
        });
      }
      setLoadingChats(false);
    };

    const waRef = ref(db, `pf_cells/${uid}/whatsapp`);
    const igRef = ref(db, `pf_cells/${uid}/instagram`);

    onValue(waRef, (snap) => handleData(snap, "whatsapp"));
    onValue(igRef, (snap) => handleData(snap, "instagram"));

    return () => {
      cancelled = true;
      off(waRef);
      off(igRef);
    };
  }, [getEffectiveUid]);

  // ── 2. Load messages for selected chat via RTDB ──
  useEffect(() => {
    if (!selectedChat) return;
    let cancelled = false;
    const db = getDatabase();
    const uid = getEffectiveUid();
    const netPath = selectedChat.networkId;
    const msgRef = ref(
      db,
      `pf_cells/${uid}/${netPath}/${selectedChat.chatId}/messages`,
    );

    const listener = onValue(msgRef, (snapshot) => {
      if (cancelled) return;
      if (snapshot.exists()) {
        const data = snapshot.val();
        const mapped = Object.entries(data).map(([msgId, m]) => ({
          id: msgId,
          direction: m.direction === "inbound" ? "incoming" : "outgoing",
          message: m.content || m.message || "[Mídia]",
          timestamp: m.timestamp,
          senderName:
            m.direction === "inbound" ? selectedChat.senderName : "Você",
          processedByAI: m.processedByAI || false,
        }));
        mapped.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(mapped);
      } else {
        setMessages([]);
      }
    });

    return () => {
      cancelled = true;
      off(msgRef);
    };
  }, [selectedChat, getEffectiveUid]);

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

    const uid = getEffectiveUid();
    const db = getDatabase();

    try {
      if (!["WA", "IG"].includes(targetChat.prefix)) {
        setTimeout(() => setSending(false), 1000); // Mock for others
        return;
      }

      // 1. Post to RTDB instantly for persistence
      const newMsgRef = push(
        ref(
          db,
          `pf_cells/${uid}/${targetChat.networkId}/${targetChat.chatId}/messages`,
        ),
      );
      await set(newMsgRef, {
        content: msg,
        direction: "outbound",
        timestamp: new Date().toISOString(),
      });

      // 2. Dispatch to GAS (Tentacle webhook outbound)
      await gasPost("TENTACLE_SEND_MSG", {
        network: targetChat.networkId,
        chatId: targetChat.chatId,
        message: msg,
      });
    } catch (err) {
      console.error("[PandaSocial] Send error:", err);
    } finally {
      setSending(false);
    }
  }, [inputMessage, selectedChat, sending, getEffectiveUid]);

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
