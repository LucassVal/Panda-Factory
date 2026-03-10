import React, { useState, useMemo, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br"; // PT-BR Support
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./PFAgendaView.css";

import { useAgenda } from "./hooks/useAgenda";
import PFEmptyState from "../../../components/PFEmptyState";

// Set moment language
moment.locale("pt-br");
const localizer = momentLocalizer(moment);

export default function PFAgendaView({ isEmbedded = false, onClose }) {
  const { events, loading, saveEvent, deleteEvent } = useAgenda();

  // States do Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Handlers do Calendar
  const handleSelectSlot = useCallback(({ start, end }) => {
    // Criação de novo evento com datas pre-selecionadas
    setSelectedEvent({ start, end, title: "", description: "" });
    setModalOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    const success = await saveEvent(selectedEvent);
    if (success) handleCloseModal();
  };

  const handleDeleteModal = async () => {
    if (!selectedEvent?.id) return;
    if (window.confirm("Certeza que deseja deletar este evento?")) {
      const success = await deleteEvent(selectedEvent.id);
      if (success) handleCloseModal();
    }
  };

  return (
    <div className={`pf-agenda-container ${isEmbedded ? "embedded" : ""}`}>
      <div className="pf-agenda-header">
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <h2>
            <span>📅</span> Panda Agenda
          </h2>
          <span className="pf-agenda-badge">MOD-05</span>
        </div>
        {onClose && (
          <button
            className="pf-btn-cancel"
            onClick={onClose}
            style={{ padding: "4px 8px" }}
          >
            ✕ Fechar CRM
          </button>
        )}
      </div>

      <div className="pf-agenda-calendar" style={{ flex: 1, height: "100%" }}>
        {loading ? (
          <PFEmptyState title="Carregando Agenda..." icon="⏳" size="md" />
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable={true}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            defaultView="month"
            views={["month", "week", "day", "agenda"]}
            messages={{
              allDay: "O dia todo",
              previous: "Anterior",
              next: "Próximo",
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
              agenda: "Lista",
              date: "Data",
              time: "Hora",
              event: "Evento",
              noEventsInRange: "Sem compromissos neste período",
            }}
          />
        )}
      </div>

      {/* MODAL DE EVENTO */}
      {modalOpen && selectedEvent && (
        <div className="pf-agenda-modal-overlay" onClick={handleCloseModal}>
          <div
            className="pf-agenda-modal-content modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pf-agenda-modal-header">
              <h3>{selectedEvent.id ? "Editar Evento" : "Novo Evento"}</h3>
              <button
                className="pf-agenda-modal-close"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="pf-agenda-modal-body">
                <div className="pf-input-group">
                  <label>Título do Evento</label>
                  <input
                    type="text"
                    required
                    value={selectedEvent.title}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        title: e.target.value,
                      })
                    }
                    placeholder="Ex: Reunião Comercial"
                  />
                </div>

                <div
                  className="pf-input-group"
                  style={{ flexDirection: "row", gap: "12px" }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <label>Data Início</label>
                    <input
                      type="datetime-local"
                      required
                      value={moment(selectedEvent.start).format(
                        "YYYY-MM-DDTHH:mm",
                      )}
                      onChange={(e) =>
                        setSelectedEvent({
                          ...selectedEvent,
                          start: new Date(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <label>Data Fim</label>
                    <input
                      type="datetime-local"
                      required
                      value={moment(selectedEvent.end).format(
                        "YYYY-MM-DDTHH:mm",
                      )}
                      onChange={(e) =>
                        setSelectedEvent({
                          ...selectedEvent,
                          end: new Date(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="pf-input-group">
                  <label>Descrição Opcional</label>
                  <textarea
                    rows={3}
                    value={selectedEvent.description}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        description: e.target.value,
                      })
                    }
                    placeholder="Anotações, links de reunião..."
                  />
                </div>

                {/* Aqui poderemos adicionar Select de CRM/Leads depois */}
              </div>

              <div className="pf-agenda-modal-footer">
                {selectedEvent.id && (
                  <button
                    type="button"
                    className="pf-btn-delete"
                    onClick={handleDeleteModal}
                  >
                    Deletar
                  </button>
                )}
                <button
                  type="button"
                  className="pf-btn-cancel"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="pf-btn-save">
                  Salvar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
