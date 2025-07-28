import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ScannedTicket {
  code: string;
  ticket: string;
  deviceName: string;
}

type ScannedTicketStore = {
  items: ScannedTicket[];
  addItem: (item: ScannedTicket) => void;
  getItems: () => ScannedTicket[];
  setItems: (items: ScannedTicket[]) => void;
  getNextItem: () => ScannedTicket | undefined;
};

const useScannedTicketsStore = create<ScannedTicketStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      getItems: () => get().items,
      setItems: (items) => set({ items }),
      getNextItem: () => {
        const item = get().items.shift();
        return item ?? undefined;
      }, // Get the first item in the list
    }),
    {
      name: "scanned-tickets-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useScannedTicketsStore;
