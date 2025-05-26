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
      addItem: (item) => {
        const currentItems = get().itemsMap;
        const itemKey = item.id;

        const updatedItem = currentItems[itemKey]
          ? {
              ...currentItems[itemKey],
              quantity: currentItems[itemKey].quantity + item.quantity,
              amount: currentItems[itemKey].amount + item.amount,
            }
          : item;

        const updatedItemsMap = { ...currentItems, [itemKey]: updatedItem };

        const updatedTotalAmount = Object.values(updatedItemsMap).reduce(
          (sum, item) => sum + item.amount,
          0,
        );

        const updatedTotalQuantity = Object.values(updatedItemsMap).reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        set({
          itemsMap: updatedItemsMap,
          totalAmount: updatedTotalAmount,
          totalQuantity: updatedTotalQuantity,
        });
      },
      clearCart: () => set({ itemsMap: {}, totalQuantity: 0, totalAmount: 0 }),
      removeItem: (item) => {
        const currentItems = get().itemsMap;
        const itemKey = item.id;

        const updatedItemsMap = { ...currentItems };
        delete updatedItemsMap[itemKey];

        const updatedTotalAmount = Object.values(updatedItemsMap).reduce(
          (sum, item) => sum + item.amount,
          0,
        );

        const updatedTotalQuantity = Object.values(updatedItemsMap).reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        set({
          itemsMap: updatedItemsMap,
          totalAmount: updatedTotalAmount,
          totalQuantity: updatedTotalQuantity,
        });
      },
    }),
    {
      name: "biru-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
