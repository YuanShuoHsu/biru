import { create } from "zustand";

interface OrderSearchState {
  orderSearchText: string;
  setOrderSearchText: (text: string) => void;
}

export const useOrderSearchStore = create<OrderSearchState>((set) => ({
  orderSearchText: "",
  setOrderSearchText: (text) =>
    set({ orderSearchText: text.trim().toLowerCase() }),
}));
