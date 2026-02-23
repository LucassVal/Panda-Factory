/**
 * 📸 PFInstagram — Instagram DM Tentacle Module (MOD-02)
 *
 * DM panel with inbox, chat view, story reply support,
 * AI auto-reply, and connection status indicator.
 *
 * Architecture:
 *   callGAS.Instagram → GAS doPost (IG_*) → Meta Graph API → RTDB
 *
 * Billing: 1 PC per AI-processed interaction.
 *
 * @version 1.0.0
 * @see SPRINT_ETAPA1_FASE2.md §MOD-02
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { gasPost } from "../../services/callGAS";

export default function PFInstagram({ onClose }) {
  // ── State ──
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [aiAutoReply, setAiAutoReply] = useState(true);
  const messagesEndRef = useRef(null);

  // ── Load chats + status on mount ──
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const [statusRes, chatsRes] = await Promise.all([
          gasPost("IG_STATUS"),
          gasPost("IG_GET_CHATS"),
        ]);

        if (cancelled) return;

        if (statusRes.status === "SUCCESS") {
          setConnected(statusRes.connected);
          if (statusRes.account) setAccount(statusRes.account);
        }

        if (chatsRes.status === "SUCCESS" && chatsRes.chats) {
          setChats(chatsRes.chats);
        }
      } catch (err) {
        console.error("[PFInstagram] Init error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Load messages when chat selected ──
  useEffect(() => {
    if (!selectedChat) return;
    let cancelled = false;

    async function loadMessages() {
      try {
        const res = await gasPost("IG_GET_MESSAGES", { chatId: selectedChat });
        if (!cancelled && res.status === "SUCCESS") {
          setMessages(res.messages || []);
          setChats((prev) =>
            prev.map((c) =>
              c.chatId === selectedChat ? { ...c, unread: false } : c,
            ),
          );
        }
      } catch (err) {
        console.error("[PFInstagram] Load messages error:", err);
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

  // ── Send message ──
  const handleSend = useCallback(async () => {
    if (!inputMessage.trim() || !selectedChat || sending) return;

    const msg = inputMessage.trim();
    setInputMessage("");
    setSending(true);

    // Optimistic UI
    const tempMsg = {
      id: "temp_" + Date.now(),
      chatId: selectedChat,
      direction: "outgoing",
      message: msg,
      senderName: "You",
      messageType: "text",
      timestamp: new Date().toISOString(),
      sending: true,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await gasPost("IG_SEND", {
        chatId: selectedChat,
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
        setChats((prev) =>
          prev.map((c) =>
            c.chatId === selectedChat
              ? {
                  ...c,
                  lastMessage: msg,
                  lastTimestamp: new Date().toISOString(),
                }
              : c,
          ),
        );
      }
    } catch (err) {
      console.error("[PFInstagram] Send error:", err);
    } finally {
      setSending(false);
    }
  }, [inputMessage, selectedChat, sending]);

  // ── Key handler ──
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Filter chats ──
  const filteredChats = chats.filter(
    (c) =>
      !searchQuery ||
      (c.senderName || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ── Time format ──
  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday)
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
  };

  // ── Render ──
  return (
    <div className="pf-instagram">
      {/* STATUS BAR */}
      <div className="ig-status-bar">
        <div className="ig-status-left">
          <span
            className={`ig-status-dot ${connected ? "connected" : "disconnected"}`}
          />
          <span className="ig-status-label">
            {connected
              ? account?.username
                ? `@${account.username}`
                : "CONNECTED"
              : "DISCONNECTED"}
          </span>
        </div>
        <div className="ig-status-right">
          <button
            className={`ig-ai-toggle ${aiAutoReply ? "active" : ""}`}
            onClick={() => setAiAutoReply(!aiAutoReply)}
            title="Toggle AI Auto-Reply"
          >
            🤖 AI {aiAutoReply ? "ON" : "OFF"}
          </button>
          {onClose && (
            <button className="ig-close-btn" onClick={onClose} title="Close">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="ig-body">
        {/* INBOX SIDEBAR */}
        <div className="ig-sidebar">
          <div className="ig-search">
            <input
              type="text"
              placeholder="🔍 Search inbox..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ig-search-input"
            />
          </div>

          <div className="ig-chat-list">
            {loading ? (
              <div className="ig-loading">Loading inbox...</div>
            ) : filteredChats.length === 0 ? (
              <div className="ig-empty">
                {searchQuery ? "No contacts found" : "No DMs yet"}
                <br />
                <small>
                  Instagram DMs will appear when followers message you
                </small>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.chatId}
                  className={`ig-chat-item ${
                    selectedChat === chat.chatId ? "active" : ""
                  } ${chat.unread ? "unread" : ""}`}
                  onClick={() => setSelectedChat(chat.chatId)}
                >
                  <div className="ig-chat-avatar">
                    {(chat.senderName || "?")[0].toUpperCase()}
                  </div>
                  <div className="ig-chat-info">
                    <div className="ig-chat-name">
                      {chat.senderName || chat.chatId}
                      {chat.unread && <span className="ig-unread-badge" />}
                      {chat.isStoryReply && (
                        <span className="ig-story-badge">📖 Story</span>
                      )}
                    </div>
                    <div className="ig-chat-preview">
                      {chat.lastMessage || "..."}
                    </div>
                  </div>
                  <div className="ig-chat-meta">
                    <span className="ig-chat-time">
                      {formatTime(chat.lastTimestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="ig-chat-area">
          {!selectedChat ? (
            <div className="ig-no-chat">
              <div className="ig-no-chat-icon">📸</div>
              <h3>INSTAGRAM TENTACLE</h3>
              <p>Select a conversation to start messaging</p>
              <small>
                Powered by Meta Graph API • AI Auto-Reply by Panda Brain
              </small>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div className="ig-chat-header">
                <button
                  className="ig-back-btn"
                  onClick={() => setSelectedChat(null)}
                >
                  ←
                </button>
                <div className="ig-chat-header-info">
                  <span className="ig-chat-header-name">
                    {chats.find((c) => c.chatId === selectedChat)?.senderName ||
                      selectedChat}
                  </span>
                  {chats.find((c) => c.chatId === selectedChat)
                    ?.isStoryReply && (
                    <span className="ig-story-indicator">
                      📖 Replied to your story
                    </span>
                  )}
                </div>
              </div>

              {/* MESSAGES */}
              <div className="ig-messages">
                {messages.length === 0 ? (
                  <div className="ig-no-messages">No messages yet</div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`ig-message ${msg.direction} ${
                        msg.processedByAI ? "ai" : ""
                      } ${msg.sending ? "sending" : ""} ${
                        msg.messageType === "story_reply" ? "story-reply" : ""
                      }`}
                    >
                      <div className="ig-message-bubble">
                        {msg.messageType === "story_reply" && (
                          <span className="ig-story-reply-tag">
                            📖 Story Reply
                          </span>
                        )}
                        {msg.processedByAI && (
                          <span className="ig-ai-badge">🤖 AI</span>
                        )}
                        <p className="ig-message-text">{msg.message}</p>
                        <span className="ig-message-time">
                          {formatTime(msg.timestamp)}
                          {msg.sending && " ⏳"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT */}
              <div className="ig-input-bar">
                <textarea
                  className="ig-input"
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button
                  className="ig-send-btn"
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
