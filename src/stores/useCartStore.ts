import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  extraCost: number;
  quantity: number;
  selectedSize?: string;
  unitPrice: number;
}

interface CartState {
  itemsMap: Record<string, CartItem>;
  itemsList: () => CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      itemsMap: {},
      itemsList: () => Object.values(get().itemsMap),
      addItem: (item) =>
        set((state) => ({
          itemsMap: { ...state.itemsMap, [item.id]: item },
        })),
      removeItem: (id: string) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _, ...rest } = state.itemsMap;

          return { itemsMap: rest };
        }),
      clearCart: () => set({ itemsMap: {} }),
    }),
    {
      name: "biru-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
