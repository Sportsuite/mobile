import { create } from "zustand";

type PermissionStatus = "granted" | "denied" | "undetermined";

interface LocationStore {
  savedStatus: PermissionStatus | null;
  setSavedStatus: (status: PermissionStatus | null) => void;
  clearSavedStatus: () => void;
}

const useLocationStore = create<LocationStore>((set) => ({
  savedStatus: null,
  setSavedStatus: (status) => set({ savedStatus: status }),
  clearSavedStatus: () => set({ savedStatus: null }),
}));

export default useLocationStore;
