import { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  remove,
  serverTimestamp,
} from "firebase/database";
import { useAuth } from "../../../../hooks/useAuth";

// pf.sdk.js sets window.Panda as global — no ESM export
const Panda = typeof window !== "undefined" ? window.Panda : {};

/**
 * useAgenda
 * Hook para buscar e gerenciar eventos de calendário no Realtime Database.
 * Path: /pf_cells/{uid}/agenda/events
 */
export function useAgenda() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setEvents([]);
      setLoading(false);
      return;
    }

    const db = getDatabase();
    const agendaRef = ref(db, `pf_cells/${user.uid}/agenda/events`);

    const unsubscribe = onValue(agendaRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Converte objeto do Firebase para Array para o react-big-calendar
        const loadedEvents = Object.keys(data).map((key) => {
          const evt = data[key];
          return {
            id: key,
            title: evt.title || "Sem título",
            // Convertendo os ISO Strings de volta para Objetos Date (exigido pelo react-big-calendar)
            start: evt.start ? new Date(evt.start) : new Date(),
            end: evt.end ? new Date(evt.end) : new Date(),
            description: evt.description || "",
            status: evt.status || "CONFIRMED", // PENDING, CONFIRMED, CANCELLED, DONE
            leadId: evt.leadId || null,
          };
        });
        setEvents(loadedEvents);
      } else {
        setEvents([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Salva ou atualiza um evento
  const saveEvent = async (eventData) => {
    if (!user?.uid) return false;
    try {
      const db = getDatabase();
      const agendaRef = ref(db, `pf_cells/${user.uid}/agenda/events`);

      let targetRef;
      if (eventData.id) {
        // Update
        targetRef = ref(
          db,
          `pf_cells/${user.uid}/agenda/events/${eventData.id}`,
        );
      } else {
        // Create novo
        targetRef = push(agendaRef);
      }

      // Preparar payload limpando keys desnecessárias e convertendo Date pra String ISO
      const payload = {
        title: eventData.title || "",
        start:
          eventData.start instanceof Date
            ? eventData.start.toISOString()
            : eventData.start,
        end:
          eventData.end instanceof Date
            ? eventData.end.toISOString()
            : eventData.end,
        description: eventData.description || "",
        status: eventData.status || "CONFIRMED",
        leadId: eventData.leadId || null,
        updatedAt: serverTimestamp(),
      };

      if (!eventData.id) {
        payload.createdAt = serverTimestamp();
      }

      await set(targetRef, payload);
      Panda.UI.toast(
        `Evento ${eventData.id ? "atualizado" : "criado"} com sucesso.`,
        "success",
      );
      return true;
    } catch (e) {
      console.error("Erro ao salvar evento da agenda", e);
      Panda.UI.toast("Erro ao salvar evento.", "error");
      return false;
    }
  };

  // Remove um evento
  const deleteEvent = async (eventId) => {
    if (!user?.uid || !eventId) return false;
    try {
      const db = getDatabase();
      const targetRef = ref(
        db,
        `pf_cells/${user.uid}/agenda/events/${eventId}`,
      );
      await remove(targetRef);
      Panda.UI.toast("Evento deletado.", "success");
      return true;
    } catch (e) {
      console.error("Erro ao deletar evento", e);
      Panda.UI.toast("Erro ao deletar evento.", "error");
      return false;
    }
  };

  return { events, loading, saveEvent, deleteEvent };
}
