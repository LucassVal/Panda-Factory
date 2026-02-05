/**
 * 🐼 Google Calendar Child
 * ========================
 * Agendamento via Google Calendar
 *
 * @version 1.0.0
 * @parent google
 * @scope https://www.googleapis.com/auth/calendar
 */

(function (window) {
  "use strict";

  const CHILD_NAME = "Calendar";
  const GoogleParent = window.GoogleParent;

  // ==========================================
  // 📅 CALENDAR API
  // ==========================================
  const CalendarAPI = {
    /**
     * Lista eventos
     * @param {string} calendarId - ID do calendário ('primary' para principal)
     * @param {object} options - Filtros
     * @returns {Promise<Array>}
     */
    async listEvents(calendarId = "primary", options = {}) {
      const { timeMin, timeMax, maxResults = 50 } = options;

      const result = await window.Panda.callGAS("calendar_list", {
        calendarId,
        timeMin: timeMin || new Date().toISOString(),
        timeMax,
        maxResults,
      });

      return result.events || [];
    },

    /**
     * Cria evento
     * @param {object} event - Dados do evento
     * @returns {Promise<object>}
     */
    async createEvent(event) {
      const result = await window.Panda.callGAS("calendar_create", {
        calendarId: event.calendarId || "primary",
        summary: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        attendees: event.attendees,
      });

      return result;
    },

    /**
     * Atualiza evento
     * @param {string} eventId
     * @param {object} updates
     * @returns {Promise<object>}
     */
    async updateEvent(eventId, updates) {
      const result = await window.Panda.callGAS("calendar_update", {
        eventId,
        ...updates,
      });

      return result;
    },

    /**
     * Deleta evento
     * @param {string} eventId
     * @returns {Promise<boolean>}
     */
    async deleteEvent(eventId) {
      const result = await window.Panda.callGAS("calendar_delete", {
        eventId,
      });

      return result.success;
    },

    /**
     * Busca próximo slot livre
     * @param {number} durationMinutes
     * @returns {Promise<object>} Slot sugerido
     */
    async findFreeSlot(durationMinutes = 60) {
      const result = await window.Panda.callGAS("calendar_free_slot", {
        durationMinutes,
      });

      return result;
    },
  };

  // ==========================================
  // 🔗 REGISTER WITH PARENT
  // ==========================================
  if (GoogleParent) {
    GoogleParent.registerChild(CHILD_NAME, CalendarAPI);
  } else {
    window.PandaCalendar = CalendarAPI;
  }
})(window);
