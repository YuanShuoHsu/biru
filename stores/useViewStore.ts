import { create } from "zustand";

import { ViewMode } from "@/types/view";

interface ViewState {
  view: ViewMode;
  setView: (view: ViewMode) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  view: "module",
  setView: (view) => set({ view }),
}));
