import type { CartItem } from "@/stores/cart-store";

import type { OrderItemResponse } from "@/types/orders";

type ModifierSnapshot = NonNullable<OrderItemResponse["modifiers"]>[number];

const groupModifiers = (
  modifiers: ModifierSnapshot[] | null | undefined,
): Record<string, string[]> => {
  const groups: Record<string, string[]> = {};

  for (const { modifierGroupId, modifierId } of modifiers || []) {
    (groups[modifierGroupId] ||= []).push(modifierId);
  }

  return groups;
};

export const getCartItems = (items: OrderItemResponse[]): CartItem[] =>
  items.map(({ addOns, menuItemId, modifiers, orderQuantity }) => ({
    addOns: (addOns || []).map((addOn) => ({
      menuItemId: addOn.menuItemId,
      modifiers: groupModifiers(addOn.modifiers),
    })),
    menuItemId,
    modifiers: groupModifiers(modifiers),
    quantity: orderQuantity,
  }));
