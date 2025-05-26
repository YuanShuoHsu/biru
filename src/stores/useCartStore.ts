import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  amount: number;
  extraCost: number;
  price: number;
  quantity: number;
  size?: string;
}

interface CartState {
  itemsMap: Record<string, CartItem>;
  itemsList: () => CartItem[];
  addItem: (item: CartItem) => void;
  clearCart: () => void;
  removeItem: (id: string) => void;
  totalAmount: () => number;
  totalQuantity: () => number;
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
      clearCart: () => set({ itemsMap: {} }),
      removeItem: (id: string) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _, ...rest } = state.itemsMap;

          return { itemsMap: rest };
        }),
      totalAmount: () =>
        Object.values(get().itemsMap).reduce(
          (sum, item) => sum + item.amount,
          0,
        ),
      totalQuantity: () =>
        Object.values(get().itemsMap).reduce(
          (sum, item) => sum + item.quantity,
          0,
        ),
    }),
    {
      name: "biru-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
