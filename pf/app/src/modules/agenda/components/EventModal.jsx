import React, { useState, useEffect } from "react";

// Utility to format Date to Input datetime-local string (YYYY-MM-DDThh:mm)
const formatForInput = (dateObj) => {
  if (!dateObj) return "";
  const d = new Date(dateObj);
  // adjust for local timezone offset
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

export default function EventModal({ event, slot, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    client: "",
    clientPhone: "",
    notes: "",
    color: "#6366f1",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        start: formatForInput(event.start),
        end: formatForInput(event.end),
        client: event.clientId || event.client || "",
        clientPhone: event.clientPhone || "",
        notes: event.notes || "",
        color: event.color || "#6366f1",
      });
    } else if (slot) {
      setFormData((prev) => ({
        ...prev,
        start: formatForInput(slot.start),
        end: formatForInput(
          slot.end || new Date(slot.start.getTime() + 60 * 60000),
        ),
      }));
    }
  }, [event, slot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.start || !formData.end) {
      alert("Preencha título, início e fim.");
      return;
    }

    onSave({
      ...formData,
      start: new Date(formData.start).toISOString(),
      end: new Date(formData.end).toISOString(),
    });
  };

  return (
    <div className="pf-agenda-modal-overlay">
      <div className="pf-agenda-modal">
        <div className="pf-agenda-modal-header">
          <h3>{event ? "Editar Evento" : "Novo Evento"}</h3>
          <button className="pf-btn pf-btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pf-agenda-modal-body">
            <div className="pf-agenda-form-group">
              <label>Título / Assunto</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Consulta Dr. Lucas"
                required
                autoFocus
              />
            </div>

            <div className="pf-agenda-form-row">
              <div className="pf-agenda-form-group">
                <label>Início</label>
                <input
                  type="datetime-local"
                  name="start"
                  value={formData.start}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="pf-agenda-form-group">
                <label>Fim</label>
                <input
                  type="datetime-local"
                  name="end"
                  value={formData.end}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="pf-agenda-form-row">
              <div className="pf-agenda-form-group">
                <label>Cliente / Paciente</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  placeholder="Nome do cliente"
                />
              </div>
              <div className="pf-agenda-form-group">
                <label>WhatsApp (opcional)</label>
                <input
                  type="text"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  placeholder="+55 11 99999-9999"
                />
              </div>
            </div>

            <div className="pf-agenda-form-row">
              <div className="pf-agenda-form-group">
                <label>Cor</label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                >
                  <option value="#6366f1">Indigo (Padrão)</option>
                  <option value="#10b981">Esmeralda (Confirmado)</option>
                  <option value="#f59e0b">Âmbar (Pendente)</option>
                  <option value="#ef4444">Vermelho (Urgente)</option>
                  <option value="#8b5cf6">Roxo (Pessoal)</option>
                </select>
              </div>
            </div>

            <div className="pf-agenda-form-group">
              <label>Observações internas</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Notas visíveis apenas para a equipe"
              />
            </div>
          </div>

          <div className="pf-agenda-modal-footer">
            {event && onDelete && (
              <button
                type="button"
                className="pf-btn pf-agenda-btn-danger"
                onClick={onDelete}
              >
                🗑️ Excluir
              </button>
            )}
            <button
              type="button"
              className="pf-btn pf-btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="pf-btn pf-btn-primary">
              💾 Salvar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
