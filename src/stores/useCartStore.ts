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
  itemsList: CartItem[];
  totalAmount: number;
  totalQuantity: number;
  isEmpty: boolean;
  computeTotals: (map: Record<string, CartItem>) => {
    totalAmount: number;
    totalQuantity: number;
  };
  deleteItem: (item: CartItem) => void;
  updateItem: (item: CartItem) => void;
  getItemQuantity: (itemId: string) => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      itemsMap: {},
      itemsList: [],
      totalAmount: 0,
      totalQuantity: 0,
      isEmpty: true,
      computeTotals: (map) => {
        const totalAmount = Object.values(map).reduce(
          (sum, item) => sum + item.amount,
          0,
        );

        const totalQuantity = Object.values(map).reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        return { totalAmount, totalQuantity };
      },
      deleteItem: (item) => {
        const { computeTotals, itemsMap } = get();
        const newMap = { ...itemsMap };
        delete newMap[item.id];

        const { totalAmount, totalQuantity } = computeTotals(newMap);

        const itemsList = Object.values(newMap);
        const isEmpty = totalQuantity === 0;

        set({
          itemsMap: newMap,
          itemsList,
          totalAmount,
          totalQuantity,
          isEmpty,
        });
      },
      updateItem: (item) => {
        const { computeTotals, itemsMap } = get();
        const itemKey = item.id;
        const existing = itemsMap[itemKey];

        const updatedItem = existing
          ? {
              ...existing,
              amount: existing.amount + item.amount,
              quantity: existing.quantity + item.quantity,
            }
          : { ...item };

        const newMap = { ...itemsMap, [itemKey]: updatedItem };

        const { totalAmount, totalQuantity } = computeTotals(newMap);

        const itemsList = Object.values(newMap);
        const isEmpty = totalQuantity === 0;

        set({
          itemsMap: newMap,
          itemsList,
          totalAmount,
          totalQuantity,
          isEmpty,
        });
      },
      getItemQuantity: (itemId) => get().itemsMap[itemId]?.quantity || 0,
      clearCart: () =>
        set({
          itemsMap: {},
          itemsList: [],
          totalAmount: 0,
          totalQuantity: 0,
          isEmpty: true,
        }),
    }),
    {
      name: "biru-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
