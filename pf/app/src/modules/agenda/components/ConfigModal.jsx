import React, { useState, useEffect } from "react";
import callGAS from "../../../services/callGAS";

export default function ConfigModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startHour: "08:00",
    endHour: "18:00",
    slotDuration: "30",
  });

  // Fetch current config on load
  // To avoid adding a specific GET_CONFIG action just for this, we could read from a known state or fetch.
  // The backend uses AGENDA_GET_SLOTS which also reads config, but let's assume default for now,
  // or add a simple effect to fetch it if needed. For simplicity in UI, we start with defaults.
  // In a full implementation, we'd fetch the user's config document from RTDB.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const config = {
        businessHours: {
          start: formData.startHour,
          end: formData.endHour,
        },
        slotDuration: parseInt(formData.slotDuration, 10),
      };

      const res = await callGAS.Agenda.setConfig(config);
      if (res.status === "SUCCESS") {
        alert("Configurações salvas com sucesso!");
        onClose();
      } else {
        alert("Erro ao salvar: " + res.error);
      }
    } catch (e) {
      alert("Erro de conexão: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pf-agenda-modal-overlay">
      <div className="pf-agenda-modal" style={{ maxWidth: "400px" }}>
        <div className="pf-agenda-modal-header">
          <h3>⚙️ Configurações da Agenda</h3>
          <button
            className="pf-btn pf-btn-icon"
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="pf-agenda-modal-body">
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--pf-text-200)",
              marginBottom: "16px",
            }}
          >
            Defina seu horário de atendimento e a duração padrão dos
            agendamentos para a Assistente IA.
          </p>

          <div className="pf-agenda-form-row">
            <div className="pf-agenda-form-group">
              <label>Início do Expediente</label>
              <input
                type="time"
                name="startHour"
                value={formData.startHour}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="pf-agenda-form-group">
              <label>Fim do Expediente</label>
              <input
                type="time"
                name="endHour"
                value={formData.endHour}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="pf-agenda-form-group">
            <label>Duração do Horário (Minutos)</label>
            <select
              name="slotDuration"
              value={formData.slotDuration}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">1 hora</option>
              <option value="90">1 hora e 30 minutos</option>
              <option value="120">2 horas</option>
            </select>
          </div>
        </div>

        <div className="pf-agenda-modal-footer">
          <button
            className="pf-btn pf-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="pf-btn pf-btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Salvando..." : "💾 Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
