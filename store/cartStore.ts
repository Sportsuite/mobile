import { create } from "zustand";

interface SimplifiedTicket {
  ticket: string;
  qty: number;
}

interface SimplifiedEventTickets {
  event: string;
  tickets: SimplifiedTicket[];
}

export interface EventWithTickets {
  event: EventObj;
  tickets: Ticket[];
}

interface CartState {
  currentEvent: EventWithTickets | null;
  getCurrentEventId: () => string | null;
  addEventTicket: (
    ticket: Ticket,
    event: EventObj,
    count: number
  ) => { success: boolean; message?: string };
  removeEventTicket: (eventId: string, ticketIndex: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalTicketCount: () => number;
  getGroupedEventTickets: () => SimplifiedEventTickets | null;
}

export const useCartStore = create<CartState>((set, get) => ({
  currentEvent: null,

  getCurrentEventId: () => get().currentEvent?.event.id || null,

  addEventTicket: (ticket, event, count) => {
    const { currentEvent } = get();
    // Block if cart has tickets from a different event
    if (currentEvent && currentEvent.event.id !== event.id) {
      return {
        success: false,
        message:
          "You can only add tickets from one event at a time. Clear your cart or checkout first.",
      };
    }

    set((state) => {
      const duplicates = Array(count).fill(ticket);

      if (currentEvent) {
        // Add to existing event
        return {
          currentEvent: {
            ...currentEvent,
            tickets: [...currentEvent.tickets, ...duplicates],
          },
        };
      } else {
        // Add new event
        return {
          currentEvent: { event, tickets: duplicates },
        };
      }
    });

    return { success: true };
  },

  removeEventTicket: (eventId, ticketIndex) => {
    set((state) => {
      if (!state.currentEvent || state.currentEvent.event.id !== eventId) {
        return state; // Ignore if event doesn't match
      }

      const updatedTickets = [...state.currentEvent.tickets];
      updatedTickets.splice(ticketIndex, 1); // Remove single ticket by index

      return {
        currentEvent:
          updatedTickets.length === 0
            ? null // Clear cart if no tickets left
            : {
                ...state.currentEvent,
                tickets: updatedTickets,
              },
      };
    });
  },

  clearCart: () => set({ currentEvent: null }),

  getTotalTicketCount: () => get().currentEvent?.tickets.length || 0,

  getTotalPrice: () => {
    const { currentEvent } = get();
    if (!currentEvent) return 0;

    return currentEvent.tickets.reduce((sum, ticket) => {
      const price = parseFloat(ticket.price as unknown as string);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
  },

  getGroupedEventTickets: () => {
    const { currentEvent } = get();
    if (!currentEvent) return null;

    const ticketMap = new Map<string, number>();
    currentEvent.tickets.forEach((ticket) => {
      const count = ticketMap.get(ticket.id.toString()) || 0;
      ticketMap.set(ticket.id.toString(), count + 1);
    });

    return {
      event: currentEvent.event.id,
      tickets: Array.from(ticketMap.entries()).map(([ticket, qty]) => ({
        ticket,
        qty,
      })),
    };
  },
}));
