import { create } from "zustand";

interface LocationCoordinate {
  latitude: number;
  longitude: number;
}

interface LocationStore {
  selectedLocation: LocationCoordinate | null;
  setSelectedLocation: (location: LocationCoordinate) => void;
  clearSelectedLocation: () => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  selectedLocation: null,
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  clearSelectedLocation: () => set({ selectedLocation: null }),
}));
