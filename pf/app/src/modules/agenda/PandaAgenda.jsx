import React, { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./PandaAgenda.css";

import { useAgenda } from "../../hooks/useAgenda";
import { useAuth } from "../../hooks/useAuth";
import EventModal from "./components/EventModal";
import ConfigModal from "./components/ConfigModal";

// Setup localizer for react-big-calendar using date-fns
const locales = {
  "pt-BR": ptBR,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function PandaAgenda({ onClose }) {
  const { user } = useAuth();
  const { events, loading, createEvent, updateEvent, deleteEvent } = useAgenda(
    user?.uid,
  );

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [slotInfo, setSlotInfo] = useState(null);

  // Big Calendar specific styles
  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = event.color || "#6366f1"; // primary indigo
    let style = {
      backgroundColor: backgroundColor,
      borderRadius: "4px",
      opacity: 0.9,
      color: "white",
      border: "0px",
      display: "block",
    };
    return { style: style };
  };

  const handleSelectSlot = (slot) => {
    setSlotInfo(slot);
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setSlotInfo(null);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (eventData) => {
    if (selectedEvent) {
      await updateEvent(selectedEvent.id, eventData);
    } else {
      await createEvent(eventData);
    }
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = async (eventId) => {
    await deleteEvent(eventId);
    setIsEventModalOpen(false);
  };

  return (
    <div className="pf-agenda-container">
      <div className="pf-agenda-header">
        <div className="pf-agenda-title">
          <h2>📅 Agenda</h2>
          {loading && (
            <span className="pf-agenda-loading-badge">Atualizando...</span>
          )}
        </div>
        <div className="pf-agenda-actions">
          <button
            className="pf-btn pf-btn-secondary"
            onClick={() => setIsConfigModalOpen(true)}
          >
            ⚙️ Configurar
          </button>
          <button
            className="pf-btn pf-btn-primary"
            onClick={() =>
              handleSelectSlot({
                start: new Date(),
                end: new Date(new Date().getTime() + 60 * 60000),
              })
            }
          >
            + Novo Evento
          </button>
          <button className="pf-btn pf-btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      <div className="pf-agenda-calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 120px)" }} // Subtract header height
          culture="pt-BR"
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
            date: "Data",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "Nenhum evento neste período.",
          }}
        />
      </div>

      {isEventModalOpen && (
        <EventModal
          event={selectedEvent}
          slot={slotInfo}
          onClose={() => setIsEventModalOpen(false)}
          onSave={handleSaveEvent}
          onDelete={
            selectedEvent ? () => handleDeleteEvent(selectedEvent.id) : null
          }
        />
      )}

      {isConfigModalOpen && (
        <ConfigModal onClose={() => setIsConfigModalOpen(false)} />
      )}
    </div>
  );
}
