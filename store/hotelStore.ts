import { create } from "zustand";

type SearchParams = {
  checkInDate: string;
  checkOutDate: string;
  adultCount: number;
  kidsCount: number;
  roomCount: number;
};

type HotelStore = {
  searchParams: SearchParams;
  setSearchParams: (params: Partial<SearchParams>) => void;
  getSearchParams: () => SearchParams;
  hotel: HotelDetails | null;
  setHotel: (hotel: HotelDetails) => void;
  clearHotel: () => void;
};

// Create the store with typed state
const useHotelStore = create<HotelStore>((set, get) => ({
  // Initial state
  searchParams: {
    checkInDate: "",
    checkOutDate: "",
    adultCount: 0,
    kidsCount: 0,
    roomCount: 0,
  },
  // Accepts partial updates (only the fields you want to change)
  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),

  // Helper to get current params
  getSearchParams: () => get().searchParams,

  hotel: null,
  setHotel: (hotel) => set({ hotel }),
  clearHotel: () => set({ hotel: null }),
}));

export default useHotelStore;
