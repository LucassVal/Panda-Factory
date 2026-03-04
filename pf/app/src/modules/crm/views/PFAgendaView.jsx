import React, { useState, useEffect, useCallback } from "react";
import { gasPost } from "../../../services/callGAS";
import "./PFAgendaView.css";

/* ═══════════════════════════════════════════════════════════
   PFAgenda — MOD-05: Calendar / Appointment Management
   ═══════════════════════════════════════════════════════════ */

const STATUS_MAP = {
  scheduled: { label: "Agendado", icon: "📅", color: "#6366f1" },
  confirmed: { label: "Confirmado", icon: "✅", color: "#10b981" },
  completed: { label: "Concluído", icon: "🏁", color: "#06b6d4" },
  cancelled: { label: "Cancelado", icon: "❌", color: "#ef4444" },
};

const COLORS = [
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#ef4444",
];

export default function PFAgenda({ onClose }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("week"); // week | month | list
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ── Fetch ──
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await gasPost("AGENDA_LIST", {});
      if (res.status === "SUCCESS") setEvents(res.events || []);
    } catch (err) {
      console.error("[Agenda]", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ── CRUD ──
  const saveEvent = async (evt) => {
    await gasPost("AGENDA_CREATE", { event: evt });
    setShowModal(false);
    setEditEvent(null);
    load();
  };

  const updateEvent = async (eventId, updates) => {
    await gasPost("AGENDA_UPDATE", { eventId, updates });
    load();
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm("Excluir este evento?")) return;
    await gasPost("AGENDA_DELETE", { eventId });
    load();
  };

  // ── Week helpers ──
  const getWeekDays = () => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const getEventsForDate = (date) => {
    const key = date.toISOString().slice(0, 10);
    return events.filter((e) => (e.startTime || "").slice(0, 10) === key);
  };

  const formatTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isToday = (d) =>
    d.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10);

  // ── Navigation ──
  const navigate = (dir) => {
    const d = new Date(selectedDate);
    if (view === "week") d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setSelectedDate(d);
  };

  // ── Render ──
  return (
    <div className="pf-agenda">
      {/* Header */}
      <div className="pf-agenda-header">
        <div className="pf-agenda-title-row">
          <h2 className="pf-agenda-title">📅 Agenda</h2>
          <span className="pf-agenda-badge">MOD-05</span>
          {onClose && (
            <button className="pf-agenda-close" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        <div className="pf-agenda-toolbar">
          <div className="pf-agenda-nav">
            <button onClick={() => navigate(-1)}>◀</button>
            <span className="pf-agenda-period">
              {selectedDate.toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
                ...(view === "week" && { day: "numeric" }),
              })}
            </span>
            <button onClick={() => navigate(1)}>▶</button>
            <button
              className="pf-agenda-today-btn"
              onClick={() => setSelectedDate(new Date())}
            >
              Hoje
            </button>
          </div>

          <div className="pf-agenda-view-toggle">
            {["week", "list"].map((v) => (
              <button
                key={v}
                className={view === v ? "active" : ""}
                onClick={() => setView(v)}
              >
                {v === "week" ? "📆 Semana" : "📋 Lista"}
              </button>
            ))}
          </div>

          <button
            className="pf-agenda-add-btn"
            onClick={() => {
              setEditEvent(null);
              setShowModal(true);
            }}
          >
            ➕ Novo Evento
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pf-agenda-content">
        {loading ? (
          <div className="pf-agenda-loading">
            <div className="pf-agenda-spinner" />
            <span>Carregando agenda...</span>
          </div>
        ) : view === "week" ? (
          /* ── Week View ── */
          <div className="pf-agenda-week">
            {getWeekDays().map((day, i) => {
              const dayEvents = getEventsForDate(day);
              const dayName = day
                .toLocaleDateString("pt-BR", { weekday: "short" })
                .toUpperCase();
              return (
                <div
                  key={i}
                  className={`pf-agenda-day-col ${isToday(day) ? "today" : ""}`}
                >
                  <div className="pf-agenda-day-header">
                    <span className="pf-agenda-day-name">{dayName}</span>
                    <span
                      className={`pf-agenda-day-num ${isToday(day) ? "today-num" : ""}`}
                    >
                      {day.getDate()}
                    </span>
                  </div>
                  <div className="pf-agenda-day-events">
                    {dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="pf-agenda-event-card"
                        style={{ borderLeftColor: evt.color || "#6366f1" }}
                        onClick={() => {
                          setEditEvent(evt);
                          setShowModal(true);
                        }}
                      >
                        <span className="pf-agenda-event-time">
                          {formatTime(evt.startTime)}
                        </span>
                        <span className="pf-agenda-event-title">
                          {evt.title}
                        </span>
                        {evt.client && (
                          <span className="pf-agenda-event-client">
                            👤 {evt.client}
                          </span>
                        )}
                      </div>
                    ))}
                    {!dayEvents.length && (
                      <div
                        className="pf-agenda-day-empty"
                        onClick={() => {
                          setEditEvent({
                            startTime:
                              day.toISOString().slice(0, 10) + "T09:00",
                          });
                          setShowModal(true);
                        }}
                      >
                        +
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── List View ── */
          <div className="pf-agenda-list">
            {events.length === 0 && (
              <div className="pf-agenda-empty">
                <div className="pf-agenda-empty-icon">📅</div>
                <p>Nenhum evento agendado</p>
              </div>
            )}
            {events.map((evt) => {
              const st = STATUS_MAP[evt.status] || STATUS_MAP.scheduled;
              return (
                <div
                  key={evt.id}
                  className="pf-agenda-list-item"
                  onClick={() => {
                    setEditEvent(evt);
                    setShowModal(true);
                  }}
                >
                  <div
                    className="pf-agenda-list-color"
                    style={{ background: evt.color || "#6366f1" }}
                  />
                  <div className="pf-agenda-list-info">
                    <div className="pf-agenda-list-title">{evt.title}</div>
                    <div className="pf-agenda-list-meta">
                      {formatTime(evt.startTime)}
                      {evt.endTime
                        ? ` – ${formatTime(evt.endTime)}`
                        : ""} · {st.icon} {st.label}
                      {evt.client && ` · 👤 ${evt.client}`}
                    </div>
                  </div>
                  <div className="pf-agenda-list-date">
                    {new Date(evt.startTime).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <EventModal
          event={editEvent}
          onSave={saveEvent}
          onUpdate={updateEvent}
          onDelete={deleteEvent}
          onClose={() => {
            setShowModal(false);
            setEditEvent(null);
          }}
        />
      )}
    </div>
  );
}

/* ── Event Modal ── */
function EventModal({ event, onSave, onUpdate, onDelete, onClose }) {
  const isEdit = event?.id;
  const [form, setForm] = useState({
    title: event?.title || "",
    description: event?.description || "",
    startTime: event?.startTime ? event.startTime.slice(0, 16) : "",
    endTime: event?.endTime ? event.endTime.slice(0, 16) : "",
    client: event?.client || "",
    clientPhone: event?.clientPhone || "",
    location: event?.location || "",
    color: event?.color || "#6366f1",
    status: event?.status || "scheduled",
    reminder: event?.reminder || 30,
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (isEdit) {
      onUpdate(event.id, form);
      onClose();
    } else {
      onSave(form);
    }
  };

  return (
    <div className="pf-agenda-overlay" onClick={onClose}>
      <div className="pf-agenda-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pf-agenda-modal-header">
          <h3>{isEdit ? "✏️ Editar Evento" : "➕ Novo Evento"}</h3>
          <button className="pf-agenda-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="pf-agenda-form">
          <input
            placeholder="Título do evento *"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
          />
          <div className="pf-agenda-form-row">
            <label>
              Início
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => set("startTime", e.target.value)}
              />
            </label>
            <label>
              Fim
              <input
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => set("endTime", e.target.value)}
              />
            </label>
          </div>
          <div className="pf-agenda-form-row">
            <input
              placeholder="👤 Cliente"
              value={form.client}
              onChange={(e) => set("client", e.target.value)}
            />
            <input
              placeholder="📱 Telefone"
              value={form.clientPhone}
              onChange={(e) => set("clientPhone", e.target.value)}
            />
          </div>
          <input
            placeholder="📍 Local"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
          <div className="pf-agenda-form-row">
            <label>
              Cor
              <div className="pf-agenda-colors">
                {COLORS.map((c) => (
                  <span
                    key={c}
                    className={`pf-agenda-color-dot ${form.color === c ? "active" : ""}`}
                    style={{ background: c }}
                    onClick={() => set("color", c)}
                  />
                ))}
              </div>
            </label>
            <label>
              Status
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {Object.entries(STATUS_MAP).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.icon} {v.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="pf-agenda-modal-actions">
            {isEdit && (
              <button
                type="button"
                className="pf-agenda-delete-btn"
                onClick={() => {
                  onDelete(event.id);
                  onClose();
                }}
              >
                🗑️ Excluir
              </button>
            )}
            <button
              type="button"
              className="pf-agenda-cancel-btn"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="pf-agenda-save-btn">
              {isEdit ? "Atualizar" : "Criar Evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
