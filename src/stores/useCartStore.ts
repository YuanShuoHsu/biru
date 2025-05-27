import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  amount: number;
  extraCost: number;
  imageUrl: string;
  price: number;
  quantity: number;
  size?: string;
}

interface CartState {
  itemsMap: Record<string, CartItem>;
  totalAmount: number;
  totalQuantity: number;
  itemsList: () => CartItem[];
  getItemQuantity: (itemId: string) => number;
  addItem: (item: CartItem) => void;
  clearCart: () => void;
  removeItem: (item: CartItem) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      itemsMap: {},
      totalAmount: 0,
      totalQuantity: 0,
      itemsList: () => Object.values(get().itemsMap),
      getItemQuantity: (itemId) => {
        const currentItems = get().itemsMap;

        return currentItems[itemId]?.quantity || 0;
      },
      addItem: (item) => {
        const { itemsMap } = get();
        const itemKey = item.id;
        const existing = itemsMap[itemKey];

        const updatedItem = existing
          ? {
              ...existing,
              quantity: existing.quantity + item.quantity,
              amount: existing.amount + item.amount,
            }
          : { ...item };

        const newMap = { ...itemsMap, [itemKey]: updatedItem };

        const totalAmount = Object.values(newMap).reduce(
          (sum, item) => sum + item.amount,
          0,
        );

        const totalQuantity = Object.values(newMap).reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        set({
          itemsMap: newMap,
          totalAmount,
          totalQuantity,
        });
      },
      clearCart: () => set({ itemsMap: {}, totalQuantity: 0, totalAmount: 0 }),
      removeItem: (item) => {
        const { itemsMap } = get();
        const newMap = { ...itemsMap };
        delete newMap[item.id];

        const totalAmount = Object.values(itemsMap).reduce(
          (sum, item) => sum + item.amount,
          0,
        );

        const totalQuantity = Object.values(itemsMap).reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        set({
          itemsMap: itemsMap,
          totalAmount,
          totalQuantity,
        });
      },
    }),
    {
      name: "biru-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
