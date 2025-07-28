import { create } from "zustand";

// Define the store's state and actions type
type EventStore = {
  eventDetails: EventObj;
  setEventDetails: (details: EventObj) => void;
};

// Create the store with typed state
const useEventStore = create<EventStore>((set) => ({
  eventDetails: {} as EventObj, // Initial state
  setEventDetails: (details: EventObj) => set({ eventDetails: details }),
}));

export default useEventStore;
