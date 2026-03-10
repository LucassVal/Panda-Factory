import { useState, useEffect, useCallback } from "react";
import callGAS from "../services/callGAS";

/**
 * Custom hook to manage Agenda state and operations.
 */
export function useAgenda(userId) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events for a given period (or all if not specified)
  const fetchEvents = useCallback(async (dateFrom = null, dateTo = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await callGAS.Agenda.list(dateFrom, dateTo);
      if (res.status === "SUCCESS") {
        // Parse dates for React Big Calendar
        const parsedEvents = (res.events || []).map((e) => ({
          ...e,
          start: new Date(e.start || e.startTime),
          end: e.end
            ? new Date(e.end || e.endTime)
            : new Date(new Date(e.start || e.startTime).getTime() + 60 * 60000), // Default 1h if no end
        }));
        setEvents(parsedEvents);
      } else {
        setError(res.error || "Failed to load events");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Create event
  const createEvent = async (eventData) => {
    try {
      // Optimistic update (optional, but good for UX)
      const tempId = "temp_" + Date.now();
      const tempEvent = {
        ...eventData,
        id: tempId,
        start: new Date(eventData.start),
        end: new Date(eventData.end),
      };
      setEvents((prev) => [...prev, tempEvent]);

      const res = await callGAS.Agenda.create(eventData);

      if (res.status === "SUCCESS") {
        // Replace temp with real
        const realEvent = {
          ...res.event,
          start: new Date(res.event.start),
          end: new Date(res.event.end),
        };
        setEvents((prev) => prev.map((e) => (e.id === tempId ? realEvent : e)));
        return { success: true, eventId: res.eventId };
      } else {
        // Revert optimistic
        setEvents((prev) => prev.filter((e) => e.id !== tempId));
        setError(res.error);
        return { success: false, error: res.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Update event
  const updateEvent = async (eventId, updates) => {
    try {
      // Optimistic update
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, ...updates } : e)),
      );

      const res = await callGAS.Agenda.update(eventId, updates);
      if (res.status !== "SUCCESS") {
        // If fail, refetch to restore truth
        fetchEvents();
        setError(res.error);
        return { success: false, error: res.error };
      }
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    try {
      // Optimistic delete
      setEvents((prev) => prev.filter((e) => e.id !== eventId));

      const res = await callGAS.Agenda.remove(eventId);
      if (res.status !== "SUCCESS") {
        // Revert
        fetchEvents();
        setError(res.error);
        return { success: false, error: res.error };
      }
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    events,
    loading,
    error,
    refresh: fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
