/**
 * 💬 PFWhatsApp — WhatsApp Tentacle Module (MOD-01)
 *
 * Full chat panel with contact list, chat view, AI auto-reply toggle,
 * follow-up scheduler, and connection status indicator.
 *
 * Architecture:
 *   callGAS.WhatsApp → GAS doPost (WA_*) → Evolution API → RTDB
 *
 * Billing: 1 PC per AI-processed message.
 *
 * @version 1.0.0
 * @see SPRINT_ETAPA1_FASE2.md §MOD-01
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { gasPost } from "../../services/callGAS";

export default function PFWhatsApp({ onClose }) {
  // ── State ──
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [connected, setConnected] = useState(false);
  const [connectionState, setConnectionState] = useState("checking");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [aiAutoReply, setAiAutoReply] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const messagesEndRef = useRef(null);

  // ── Load chats + status on mount ──
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const [statusRes, chatsRes] = await Promise.all([
          gasPost("WA_STATUS"),
          gasPost("WA_GET_CHATS"),
        ]);

        if (cancelled) return;

        if (statusRes.status === "SUCCESS") {
          setConnected(statusRes.connected);
          setConnectionState(
            statusRes.state || (statusRes.connected ? "open" : "disconnected"),
          );
        }

        if (chatsRes.status === "SUCCESS" && chatsRes.chats) {
          setChats(chatsRes.chats);
          // Count today's messages
          const today = new Date().toISOString().split("T")[0];
          const count = chatsRes.chats.reduce((acc, c) => {
            if (c.lastTimestamp && c.lastTimestamp.startsWith(today)) acc++;
            return acc;
          }, 0);
          setTodayCount(count);
        }
      } catch (err) {
        console.error("[PFWhatsApp] Init error:", err);
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
        const res = await gasPost("WA_GET_MESSAGES", { chatId: selectedChat });
        if (!cancelled && res.status === "SUCCESS") {
          setMessages(res.messages || []);
          // Mark as read in local state
          setChats((prev) =>
            prev.map((c) =>
              c.chatId === selectedChat ? { ...c, unread: false } : c,
            ),
          );
        }
      } catch (err) {
        console.error("[PFWhatsApp] Load messages error:", err);
      }
    }

    loadMessages();
    return () => {
      cancelled = true;
    };
  }, [selectedChat]);

  // ── Auto-scroll to bottom ──
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
      const res = await gasPost("WA_SEND", {
        chatId: selectedChat,
        message: msg,
      });

      if (res.status === "SUCCESS") {
        // Replace temp with real
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempMsg.id
              ? { ...m, id: res.messageId, sending: false }
              : m,
          ),
        );
        // Update chat list preview
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
      console.error("[PFWhatsApp] Send error:", err);
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
      (c.senderName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.chatId || "").includes(searchQuery),
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
    <div className="pf-whatsapp">
      {/* STATUS BAR */}
      <div className="wa-status-bar">
        <div className="wa-status-left">
          <span
            className={`wa-status-dot ${connected ? "connected" : "disconnected"}`}
          />
          <span className="wa-status-label">
            {connected
              ? "CONNECTED"
              : connectionState === "checking"
                ? "CHECKING..."
                : "DISCONNECTED"}
          </span>
        </div>
        <div className="wa-status-right">
          <span className="wa-msg-count">📨 {todayCount} today</span>
          <button
            className={`wa-ai-toggle ${aiAutoReply ? "active" : ""}`}
            onClick={() => setAiAutoReply(!aiAutoReply)}
            title="Toggle AI Auto-Reply"
          >
            🤖 AI {aiAutoReply ? "ON" : "OFF"}
          </button>
          {onClose && (
            <button className="wa-close-btn" onClick={onClose} title="Close">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="wa-body">
        {/* CONTACT LIST */}
        <div className="wa-sidebar">
          <div className="wa-search">
            <input
              type="text"
              placeholder="🔍 Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="wa-search-input"
            />
          </div>

          <div className="wa-chat-list">
            {loading ? (
              <div className="wa-loading">Loading chats...</div>
            ) : filteredChats.length === 0 ? (
              <div className="wa-empty">
                {searchQuery ? "No contacts found" : "No conversations yet"}
                <br />
                <small>
                  Messages will appear here when customers contact you via
                  WhatsApp
                </small>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.chatId}
                  className={`wa-chat-item ${
                    selectedChat === chat.chatId ? "active" : ""
                  } ${chat.unread ? "unread" : ""}`}
                  onClick={() => setSelectedChat(chat.chatId)}
                >
                  <div className="wa-chat-avatar">
                    {(chat.senderName || "?")[0].toUpperCase()}
                  </div>
                  <div className="wa-chat-info">
                    <div className="wa-chat-name">
                      {chat.senderName || chat.chatId}
                      {chat.unread && <span className="wa-unread-badge" />}
                    </div>
                    <div className="wa-chat-preview">
                      {chat.lastMessage || "..."}
                    </div>
                  </div>
                  <div className="wa-chat-meta">
                    <span className="wa-chat-time">
                      {formatTime(chat.lastTimestamp)}
                    </span>
                    {chat.messageCount > 0 && (
                      <span className="wa-chat-count">{chat.messageCount}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="wa-chat-area">
          {!selectedChat ? (
            <div className="wa-no-chat">
              <div className="wa-no-chat-icon">💬</div>
              <h3>WHATSAPP TENTACLE</h3>
              <p>Select a conversation to start messaging</p>
              <small>
                Powered by Evolution API • AI Auto-Reply by Panda Brain
              </small>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div className="wa-chat-header">
                <button
                  className="wa-back-btn"
                  onClick={() => setSelectedChat(null)}
                >
                  ←
                </button>
                <div className="wa-chat-header-info">
                  <span className="wa-chat-header-name">
                    {chats.find((c) => c.chatId === selectedChat)?.senderName ||
                      selectedChat}
                  </span>
                  <span className="wa-chat-header-id">{selectedChat}</span>
                </div>
              </div>

              {/* MESSAGES */}
              <div className="wa-messages">
                {messages.length === 0 ? (
                  <div className="wa-no-messages">No messages yet</div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`wa-message ${msg.direction} ${
                        msg.processedByAI ? "ai" : ""
                      } ${msg.sending ? "sending" : ""}`}
                    >
                      <div className="wa-message-bubble">
                        {msg.processedByAI && (
                          <span className="wa-ai-badge">🤖 AI</span>
                        )}
                        <p className="wa-message-text">{msg.message}</p>
                        <span className="wa-message-time">
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
              <div className="wa-input-bar">
                <textarea
                  className="wa-input"
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={!connected && false /* allow offline compose */}
                />
                <button
                  className="wa-send-btn"
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
