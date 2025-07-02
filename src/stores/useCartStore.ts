import { getItemKey } from "@/utils/itemKey";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  amount: number;
  extraCost: number;
  imageUrl: string;
  price: number;
  quantity: number;
  choices: Record<string, string | string[] | null>;
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
  getItemQuantity: (
    id: string,
    choices: Record<string, string | string[] | null>,
  ) => number;
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
        const { id, choices } = item;

        const { computeTotals, itemsMap } = get();
        const newMap = { ...itemsMap };
        const itemKey = getItemKey(id, choices);
        delete newMap[itemKey];

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
        const { id, amount, choices, quantity } = item;

        const { computeTotals, itemsMap } = get();
        const itemKey = getItemKey(id, choices);
        const existing = itemsMap[itemKey];

        const updatedItem = existing
          ? {
              ...existing,
              amount: existing.amount + amount,
              quantity: existing.quantity + quantity,
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
      getItemQuantity: (id, choices) =>
        get().itemsMap[getItemKey(id, choices)]?.quantity || 0,
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
