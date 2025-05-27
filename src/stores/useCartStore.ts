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
  calculateTotal: () => { totalAmount: number; totalQuantity: number };
  deleteItem: (item: CartItem) => void;
  updateItem: (item: CartItem) => void;
  getItemQuantity: (itemId: string) => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      itemsMap: {},
      totalAmount: 0,
      totalQuantity: 0,
      itemsList: () => Object.values(get().itemsMap),
      calculateTotal: () => {
        const { itemsMap } = get();

        const totalAmount = Object.values(itemsMap).reduce(
          (sum, item) => sum + item.amount,
          0,
        );

        const totalQuantity = Object.values(itemsMap).reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        return { totalAmount, totalQuantity };
      },
      deleteItem: (item) => {
        const { calculateTotal, itemsMap } = get();
        const newMap = { ...itemsMap };
        delete newMap[item.id];

        const { totalAmount, totalQuantity } = calculateTotal();

        set({
          itemsMap: newMap,
          totalAmount,
          totalQuantity,
        });
      },
      updateItem: (item) => {
        const { calculateTotal, itemsMap } = get();
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

        const { totalAmount, totalQuantity } = calculateTotal();

        set({
          itemsMap: newMap,
          totalAmount,
          totalQuantity,
        });
      },
      getItemQuantity: (itemId) => get().itemsMap[itemId]?.quantity || 0,
      clearCart: () => set({ itemsMap: {}, totalAmount: 0, totalQuantity: 0 }),
    }),
    {
      name: "biru-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
