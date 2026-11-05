import { create } from "zustand";

import type { City } from "../types/shift";

type ShiftStore = {
  selectedCity: City | "All";
  setSelectedCity: (city: City | "All") => void;
};

export const useShiftStore = create<ShiftStore>((set) => ({
  selectedCity: "All",

  setSelectedCity: (city) => set({ selectedCity: city }),
}));