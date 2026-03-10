/* ═══════════════════════════════════════════════════════════
 * 🐼 PFCRMTentacle — CRM Kanban Pipeline (MOD-04)
 * Panda Factory — Sprint E1 Phase 2
 * Pipeline: Novo → Qualificado → Proposta → Fechado / Perdido
 * Auto-capture from WhatsApp/Instagram tentacles
 * Billing: free to 100 contacts, 0.1 PC above
 * ═══════════════════════════════════════════════════════════ */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
  remove,
  off,
} from "firebase/database";
import { useAuth } from "../../../hooks/useAuth";
import "./PFFunnelView.css";

// ── GAS communication ──
const gasPost = async (action, payload = {}) => {
  try {
    const gasUrl = import.meta.env.VITE_GAS_URL;
    if (!gasUrl) throw new Error("VITE_GAS_URL not set");
    const userId = localStorage.getItem("pandaUserId") || "anonymous";
    const res = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, type: action, payload }),
    });
    return await res.json();
  } catch (err) {
    console.error(`[CRM] ${action} error:`, err);
    return { status: "ERROR", message: err.message };
  }
};

// ── Pipeline stages ──
const PIPELINE_STAGES = [
  { id: "novo", label: "Novo", icon: "🆕", color: "#6366f1" },
  { id: "qualificado", label: "Qualificado", icon: "✅", color: "#10b981" },
  { id: "proposta", label: "Proposta", icon: "📋", color: "#f59e0b" },
  { id: "fechado", label: "Fechado", icon: "🏆", color: "#06b6d4" },
  { id: "perdido", label: "Perdido", icon: "❌", color: "#ef4444" },
];

// ── Source icons ──
const SOURCE_ICONS = {
  whatsapp: "💬",
  instagram: "📸",
  manual: "✏️",
  import: "📥",
};

// ── Contact Card ──
function ContactCard({ contact, onSelect, onDragStart }) {
  const sourceIcon = SOURCE_ICONS[contact.source] || "📇";
  const initials = (contact.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="crm-contact-card"
      draggable
      onDragStart={(e) => onDragStart(e, contact.id)}
      onClick={() => onSelect(contact)}
    >
      <div className="crm-card-header">
        <div className="crm-avatar">{initials}</div>
        <div className="crm-card-info">
          <span className="crm-card-name">{contact.name || "Sem nome"}</span>
          <span className="crm-card-source">
            {sourceIcon} {contact.source || "manual"}
          </span>
        </div>
        {contact.value > 0 && (
          <span className="crm-card-value">
            R$ {contact.value.toLocaleString("pt-BR")}
          </span>
        )}
      </div>
      {(contact.phone || contact.email) && (
        <div className="crm-card-meta">
          {contact.phone && <span>📱 {contact.phone}</span>}
          {contact.email && <span>✉️ {contact.email}</span>}
        </div>
      )}
      {contact.tags?.length > 0 && (
        <div className="crm-card-tags">
          {contact.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="crm-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Contact Detail Modal ──
function ContactModal({ contact, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "manual",
    pipeline: "novo",
    tags: "",
    notes: "",
    value: 0,
    ...contact,
  });
  const isNew = !contact?.id;

  const handleSave = async () => {
    const tagArray =
      typeof form.tags === "string"
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : form.tags || [];

    await onSave({
      ...form,
      tags: tagArray,
      value: parseFloat(form.value) || 0,
    });
  };

  return (
    <div className="crm-modal-overlay" onClick={onClose}>
      <div className="crm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="crm-modal-header">
          <h3>{isNew ? "➕ Novo Contato" : "✏️ Editar Contato"}</h3>
          <button className="crm-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="crm-modal-body">
          <div className="crm-form-row">
            <label>Nome</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nome completo"
            />
          </div>
          <div className="crm-form-row crm-form-split">
            <div>
              <label>Telefone</label>
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="+55 11 99999-0000"
              />
            </div>
            <div>
              <label>Email</label>
              <input
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div className="crm-form-row crm-form-split">
            <div>
              <label>Pipeline</label>
              <select
                value={form.pipeline}
                onChange={(e) =>
                  setForm((p) => ({ ...p, pipeline: e.target.value }))
                }
              >
                {PIPELINE_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Valor (R$)</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) =>
                  setForm((p) => ({ ...p, value: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="crm-form-row">
            <label>Tags (separar por vírgula)</label>
            <input
              value={
                Array.isArray(form.tags) ? form.tags.join(", ") : form.tags
              }
              onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              placeholder="vip, whatsapp, lead"
            />
          </div>
          <div className="crm-form-row">
            <label>Notas</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) =>
                setForm((p) => ({ ...p, notes: e.target.value }))
              }
              placeholder="Observações sobre o contato..."
            />
          </div>
        </div>

        <div className="crm-modal-footer">
          {!isNew && (
            <button
              className="crm-btn crm-btn-danger"
              onClick={() => onDelete(contact.id)}
            >
              🗑️ Excluir
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button className="crm-btn crm-btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="crm-btn crm-btn-primary" onClick={handleSave}>
            {isNew ? "➕ Criar" : "💾 Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function PFCRMTentacle() {
  const { user } = useAuth();
  const getEffectiveUid = useCallback(() => {
    return (
      user?.uid || localStorage.getItem("panda_user") || "admin_placeholder"
    );
  }, [user]);

  const [contacts, setContacts] = useState([]);
  const [pipelineCounts, setPipelineCounts] = useState({});
  const [total, setTotal] = useState(0);
  const [freeTier, setFreeTier] = useState(true);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("kanban"); // 'kanban' | 'list'
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dragOverStage, setDragOverStage] = useState(null);

  // ── Load contacts ──
  useEffect(() => {
    let cancelled = false;
    const db = getDatabase();
    const uid = getEffectiveUid();
    const contactsRef = ref(db, `pf_cells/${uid}/crm/contacts`);

    setLoading(true);
    onValue(contactsRef, (snapshot) => {
      if (cancelled) return;
      if (snapshot.exists()) {
        const data = snapshot.val();
        const contactList = Object.entries(data).map(([id, c]) => ({
          ...c,
          id,
        }));

        // Count pipelines
        const counts = {};
        contactList.forEach((c) => {
          const p = c.pipeline || "novo";
          counts[p] = (counts[p] || 0) + 1;
        });

        setContacts(contactList);
        setPipelineCounts(counts);
        setTotal(contactList.length);
        setFreeTier(contactList.length <= 100);
      } else {
        setContacts([]);
        setPipelineCounts({});
        setTotal(0);
        setFreeTier(true);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
      off(contactsRef);
    };
  }, [getEffectiveUid]);

  // ── Save contact ──
  const handleSave = useCallback(
    async (contactData) => {
      try {
        const db = getDatabase();
        const uid = getEffectiveUid();
        const isNew = !contactData.id;
        const contactId = isNew ? "manual_" + Date.now() : contactData.id;

        const contactRef = ref(db, `pf_cells/${uid}/crm/contacts/${contactId}`);
        await update(contactRef, {
          ...contactData,
          id: contactId,
          lastContact: new Date().toISOString(),
        });
        // Remoção da regra de billing, o CRM nativo não consumirá saldo PC em leads.

        setShowModal(false);
        setSelectedContact(null);
      } catch (err) {
        console.error("Save error:", err);
      }
    },
    [getEffectiveUid],
  );

  // ── Delete contact ──
  const handleDelete = useCallback(
    async (contactId) => {
      if (!window.confirm("Tem certeza que deseja excluir este contato?"))
        return;
      const db = getDatabase();
      const uid = getEffectiveUid();
      await remove(ref(db, `pf_cells/${uid}/crm/contacts/${contactId}`));
      setShowModal(false);
      setSelectedContact(null);
    },
    [getEffectiveUid],
  );

  // ── Pipeline drag & drop ──
  const handleDragStart = useCallback((e, contactId) => {
    e.dataTransfer.setData("text/plain", contactId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDrop = useCallback(
    async (e, stageId) => {
      e.preventDefault();
      setDragOverStage(null);
      const contactId = e.dataTransfer.getData("text/plain");
      if (!contactId) return;

      const db = getDatabase();
      const uid = getEffectiveUid();
      const contactRef = ref(db, `pf_cells/${uid}/crm/contacts/${contactId}`);

      // Update pipeline stage directly
      await update(contactRef, { pipeline: stageId });
    },
    [getEffectiveUid],
  );

  // ── Filtered contacts ──
  const filteredContacts = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return contacts.filter((c) => {
      if (!lowerSearch) return true;
      return (
        (c.name || "").toLowerCase().includes(lowerSearch) ||
        (c.phone || "").toLowerCase().includes(lowerSearch) ||
        (c.email || "").toLowerCase().includes(lowerSearch)
      );
    });
  }, [contacts, search]);

  // ── Filtered contacts per stage ──
  const contactsByStage = useMemo(() => {
    const map = {};
    PIPELINE_STAGES.forEach((s) => {
      map[s.id] = [];
    });
    filteredContacts.forEach((c) => {
      const stage = c.pipeline || "novo";
      if (map[stage]) map[stage].push(c);
    });
    return map;
  }, [filteredContacts]);

  // ── Pipeline total value ──
  const totalValue = useMemo(
    () =>
      filteredContacts.reduce((sum, c) => sum + (parseFloat(c.value) || 0), 0),
    [filteredContacts],
  );

  // ── Open new contact modal ──
  const openNewContact = () => {
    setSelectedContact(null);
    setShowModal(true);
  };

  const openEditContact = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  return (
    <div className="crm-container">
      {/* ── Header ── */}
      <div className="crm-header">
        <div className="crm-header-left">
          <h2 className="crm-title">📇 CRM Tentacle</h2>
          <span className="crm-badge">Tentáculo</span>
          {!freeTier && (
            <span className="crm-badge crm-badge-premium">💎 Premium</span>
          )}
        </div>

        <div className="crm-header-center">
          <div className="crm-stats">
            <div className="crm-stat">
              <span className="crm-stat-value">{total}</span>
              <span className="crm-stat-label">Contatos</span>
            </div>
            <div className="crm-stat">
              <span className="crm-stat-value">
                R$ {totalValue.toLocaleString("pt-BR")}
              </span>
              <span className="crm-stat-label">Pipeline Total</span>
            </div>
            <div className="crm-stat">
              <span className="crm-stat-value">
                {pipelineCounts.fechado || 0}
              </span>
              <span className="crm-stat-label">Fechados</span>
            </div>
          </div>
        </div>

        <div className="crm-header-right">
          <input
            type="text"
            className="crm-search"
            placeholder="🔍 Buscar contatos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="crm-view-toggle">
            <button
              className={`crm-toggle-btn ${viewMode === "kanban" ? "active" : ""}`}
              onClick={() => setViewMode("kanban")}
              title="Kanban"
            >
              ▦
            </button>
            <button
              className={`crm-toggle-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="Lista"
            >
              ≡
            </button>
          </div>
          <button className="crm-btn crm-btn-primary" onClick={openNewContact}>
            ➕ Novo Contato
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="crm-loading">
          <div className="crm-spinner" />
          <p>Carregando CRM...</p>
        </div>
      ) : viewMode === "kanban" ? (
        /* ── Kanban View ── */
        <div className="crm-kanban">
          {PIPELINE_STAGES.map((stage) => (
            <div
              key={stage.id}
              className={`crm-kanban-column ${dragOverStage === stage.id ? "drag-over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverStage(stage.id);
              }}
              onDragLeave={() => setDragOverStage(null)}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div
                className="crm-column-header"
                style={{ borderTopColor: stage.color }}
              >
                <span className="crm-column-icon">{stage.icon}</span>
                <span className="crm-column-name">{stage.label}</span>
                <span className="crm-column-count">
                  {contactsByStage[stage.id]?.length || 0}
                </span>
              </div>
              <div className="crm-column-body">
                {contactsByStage[stage.id]?.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onSelect={openEditContact}
                    onDragStart={handleDragStart}
                  />
                ))}
                {(contactsByStage[stage.id]?.length || 0) === 0 && (
                  <div className="crm-column-empty">
                    <span style={{ opacity: 0.4 }}>{stage.icon}</span>
                    <span>Sem contatos</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── List View ── */
        <div className="crm-list">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Pipeline</th>
                <th>Fonte</th>
                <th>Valor</th>
                <th>Último Contato</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((c) => {
                const stage =
                  PIPELINE_STAGES.find((s) => s.id === c.pipeline) ||
                  PIPELINE_STAGES[0];
                return (
                  <tr
                    key={c.id}
                    onClick={() => openEditContact(c)}
                    className="crm-table-row"
                  >
                    <td className="crm-table-name">{c.name || "—"}</td>
                    <td>{c.phone || "—"}</td>
                    <td>{c.email || "—"}</td>
                    <td>
                      <span
                        className="crm-pipeline-badge"
                        style={{
                          background: stage.color + "20",
                          color: stage.color,
                          borderColor: stage.color,
                        }}
                      >
                        {stage.icon} {stage.label}
                      </span>
                    </td>
                    <td>
                      {SOURCE_ICONS[c.source] || "📇"} {c.source}
                    </td>
                    <td>
                      {c.value > 0
                        ? `R$ ${c.value.toLocaleString("pt-BR")}`
                        : "—"}
                    </td>
                    <td className="crm-table-date">
                      {c.lastContact
                        ? new Date(c.lastContact).toLocaleDateString("pt-BR")
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredContacts.length === 0 && (
            <div className="crm-empty">
              <span style={{ fontSize: 48, opacity: 0.3 }}>📇</span>
              <p>Nenhum contato encontrado</p>
              <button
                className="crm-btn crm-btn-primary"
                onClick={openNewContact}
              >
                ➕ Adicionar primeiro contato
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <ContactModal
          contact={selectedContact}
          onClose={() => {
            setShowModal(false);
            setSelectedContact(null);
          }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
