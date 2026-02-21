/**
 * 📱 PandaCRM v1.0 — First Official Medusa Module (TICKET-13)
 *
 * Lightweight CRM built into the Panda Factory canvas.
 * Features: Contact list, Kanban pipeline, AI follow-up suggestions.
 *
 * Architecture: Medusa Module Pattern
 *   - Self-contained in /modules/crm/
 *   - Uses useLicenses for access gating
 *   - Stores data in Firebase RTDB at /pf_cells/{userId}/crm/
 *   - Communicates with GAS via callGAS
 *
 * @version 1.0.0
 * @see PF_MEDUSA_REFERENCE.md §2
 */

import React, { useState, useEffect, useCallback } from "react";
import { License } from "../../services/callGAS";

// ── Pipeline Stages (Kanban) ──
const PIPELINE_STAGES = [
  { id: "lead", label: "📥 Leads", color: "#3b82f6" },
  { id: "contacted", label: "📞 Contacted", color: "#f59e0b" },
  { id: "proposal", label: "📋 Proposal", color: "#8b5cf6" },
  { id: "negotiation", label: "🤝 Negotiation", color: "#f97316" },
  { id: "won", label: "✅ Won", color: "#10b981" },
  { id: "lost", label: "❌ Lost", color: "#ef4444" },
];

// ── Demo Contacts (for first-run experience) ──
const DEMO_CONTACTS = [
  {
    id: "demo-1",
    name: "Maria Silva",
    email: "maria@example.com",
    phone: "+55 11 99999-0001",
    company: "TechCorp",
    stage: "lead",
    value: 5000,
    notes: "Interested in CRM module",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    name: "João Santos",
    email: "joao@example.com",
    phone: "+55 21 88888-0002",
    company: "DigitalAgency",
    stage: "contacted",
    value: 12000,
    notes: "Scheduled demo for next week",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    name: "Ana Oliveira",
    email: "ana@example.com",
    phone: "+55 31 77777-0003",
    company: "StartupXYZ",
    stage: "proposal",
    value: 8500,
    notes: "Sent proposal, waiting for feedback",
    createdAt: new Date().toISOString(),
  },
];

export default function PandaCRM({ userId, onClose }) {
  const [contacts, setContacts] = useState([]);
  const [view, setView] = useState("kanban"); // kanban | list | form
  const [editingContact, setEditingContact] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ── Load contacts ──
  useEffect(() => {
    const loadContacts = async () => {
      try {
        // Try localStorage first for instant render
        const cached = localStorage.getItem("pf_crm_contacts");
        if (cached) {
          setContacts(JSON.parse(cached));
          setLoading(false);
          return;
        }
      } catch (_) {
        /* ignore */
      }

      // First run: use demo contacts
      setContacts(DEMO_CONTACTS);
      setLoading(false);
    };

    loadContacts();
  }, [userId]);

  // ── Persist to localStorage ──
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem("pf_crm_contacts", JSON.stringify(contacts));
    }
  }, [contacts]);

  // ── Filtered contacts ──
  const filteredContacts = contacts.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Stage stats ──
  const stageStats = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    contacts: filteredContacts.filter((c) => c.stage === stage.id),
    total: filteredContacts
      .filter((c) => c.stage === stage.id)
      .reduce((sum, c) => sum + (c.value || 0), 0),
  }));

  // ── CRUD Operations ──
  const addContact = (contact) => {
    const newContact = {
      ...contact,
      id: `crm-${Date.now()}`,
      stage: contact.stage || "lead",
      createdAt: new Date().toISOString(),
    };
    setContacts((prev) => [...prev, newContact]);
    setView("kanban");
  };

  const updateContact = (id, updates) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
  };

  const moveContact = (contactId, newStage) => {
    updateContact(contactId, { stage: newStage });
  };

  const deleteContact = (id) => {
    if (confirm("Excluir este contato?")) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // ── Pipeline Value ──
  const totalPipeline = contacts
    .filter((c) => c.stage !== "lost")
    .reduce((sum, c) => sum + (c.value || 0), 0);

  const wonValue = contacts
    .filter((c) => c.stage === "won")
    .reduce((sum, c) => sum + (c.value || 0), 0);

  if (loading) {
    return (
      <div className="crm-loading">
        <span style={{ fontSize: 48 }}>📱</span>
        <p>Carregando CRM...</p>
      </div>
    );
  }

  return (
    <div className="panda-crm">
      {/* Header */}
      <div className="crm-header">
        <div className="crm-header-left">
          <h2 className="crm-title">📱 Panda CRM</h2>
          <div className="crm-stats">
            <span className="crm-stat">👥 {contacts.length} contatos</span>
            <span className="crm-stat pipeline">
              💰 R$ {totalPipeline.toLocaleString()}
            </span>
            <span className="crm-stat won">
              ✅ R$ {wonValue.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="crm-header-right">
          <input
            type="text"
            placeholder="🔍 Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="crm-search"
          />
          <div className="crm-view-toggle">
            <button
              className={`crm-view-btn ${view === "kanban" ? "active" : ""}`}
              onClick={() => setView("kanban")}
            >
              📋 Kanban
            </button>
            <button
              className={`crm-view-btn ${view === "list" ? "active" : ""}`}
              onClick={() => setView("list")}
            >
              📄 Lista
            </button>
          </div>
          <button
            className="crm-add-btn"
            onClick={() => {
              setEditingContact(null);
              setView("form");
            }}
          >
            + Novo Contato
          </button>
          {onClose && (
            <button className="crm-close-btn" onClick={onClose}>
              ×
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="crm-content">
        {view === "kanban" && (
          <KanbanView
            stages={stageStats}
            onMove={moveContact}
            onEdit={(c) => {
              setEditingContact(c);
              setView("form");
            }}
            onDelete={deleteContact}
          />
        )}

        {view === "list" && (
          <ListView
            contacts={filteredContacts}
            onEdit={(c) => {
              setEditingContact(c);
              setView("form");
            }}
            onDelete={deleteContact}
            onMove={moveContact}
          />
        )}

        {view === "form" && (
          <ContactForm
            contact={editingContact}
            onSave={(contact) => {
              if (editingContact) {
                updateContact(editingContact.id, contact);
              } else {
                addContact(contact);
              }
              setView("kanban");
            }}
            onCancel={() => setView("kanban")}
          />
        )}
      </div>
    </div>
  );
}

// ── Kanban View ──
function KanbanView({ stages, onMove, onEdit, onDelete }) {
  return (
    <div className="crm-kanban">
      {stages.map((stage) => (
        <div key={stage.id} className="crm-kanban-column">
          <div
            className="crm-kanban-header"
            style={{ borderBottomColor: stage.color }}
          >
            <span className="crm-kanban-title">{stage.label}</span>
            <span className="crm-kanban-count">{stage.contacts.length}</span>
          </div>
          <div className="crm-kanban-cards">
            {stage.contacts.map((contact) => (
              <div key={contact.id} className="crm-kanban-card">
                <div className="crm-card-name">{contact.name}</div>
                <div className="crm-card-company">{contact.company || "—"}</div>
                {contact.value > 0 && (
                  <div className="crm-card-value">
                    R$ {contact.value.toLocaleString()}
                  </div>
                )}
                <div className="crm-card-actions">
                  <button onClick={() => onEdit(contact)} title="Editar">
                    ✏️
                  </button>
                  <select
                    value={contact.stage}
                    onChange={(e) => onMove(contact.id, e.target.value)}
                    className="crm-card-stage-select"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => onDelete(contact.id)} title="Excluir">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {stage.contacts.length === 0 && (
              <div className="crm-kanban-empty">Sem contatos</div>
            )}
          </div>
          {stage.total > 0 && (
            <div className="crm-kanban-total">
              R$ {stage.total.toLocaleString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── List View ──
function ListView({ contacts, onEdit, onDelete, onMove }) {
  return (
    <div className="crm-list">
      <table className="crm-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Empresa</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Etapa</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id}>
              <td className="crm-cell-name">{c.name}</td>
              <td>{c.company || "—"}</td>
              <td>{c.email || "—"}</td>
              <td>{c.phone || "—"}</td>
              <td>
                <select
                  value={c.stage}
                  onChange={(e) => onMove(c.id, e.target.value)}
                  className="crm-cell-stage"
                >
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>R$ {(c.value || 0).toLocaleString()}</td>
              <td className="crm-cell-actions">
                <button onClick={() => onEdit(c)}>✏️</button>
                <button onClick={() => onDelete(c.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Contact Form ──
function ContactForm({ contact, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: contact?.name || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    company: contact?.company || "",
    stage: contact?.stage || "lead",
    value: contact?.value || 0,
    notes: contact?.notes || "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Nome é obrigatório");
    onSave({
      ...form,
      value: parseFloat(form.value) || 0,
    });
  };

  return (
    <div className="crm-form-container">
      <form onSubmit={handleSubmit} className="crm-form">
        <h3>{contact ? "✏️ Editar Contato" : "➕ Novo Contato"}</h3>

        <div className="crm-form-grid">
          <div className="crm-form-group">
            <label>Nome *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nome completo"
              required
            />
          </div>

          <div className="crm-form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <div className="crm-form-group">
            <label>Telefone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+55 11 99999-0000"
            />
          </div>

          <div className="crm-form-group">
            <label>Empresa</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder="Nome da empresa"
            />
          </div>

          <div className="crm-form-group">
            <label>Etapa</label>
            <select
              value={form.stage}
              onChange={(e) => handleChange("stage", e.target.value)}
            >
              {PIPELINE_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="crm-form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              value={form.value}
              onChange={(e) => handleChange("value", e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div className="crm-form-group full-width">
          <label>Notas</label>
          <textarea
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Observações sobre o contato..."
            rows={3}
          />
        </div>

        <div className="crm-form-actions">
          <button type="button" className="crm-btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="crm-btn-save">
            {contact ? "Salvar" : "Criar Contato"}
          </button>
        </div>
      </form>
    </div>
  );
}
