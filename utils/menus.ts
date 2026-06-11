import { LOW_STOCK_THRESHOLD } from "@/constants/menus";

import type {
  OrderMenu,
  OrderMenuAddOnItem,
  OrderMenuItem,
  OrderMenuOffer,
} from "@/types/menus";

export const isLowStock = (offer?: OrderMenuOffer): boolean => {
  const stock = offer?.inventoryLevel?.value;
  if (stock == null || stock <= 0) return false;
  if (offer?.availability === "SoldOut") return false;

  return stock <= LOW_STOCK_THRESHOLD;
};

export interface PromoInfo {
  price: number;
  validThrough: Date | null;
}

export const getActivePromo = (offer?: OrderMenuOffer): PromoInfo | null => {
  const priceSpecification = offer?.priceSpecification;
  if (!priceSpecification) return null;

  const now = new Date();
  const validFrom = priceSpecification.validFrom
    ? new Date(priceSpecification.validFrom)
    : null;
  const validThrough = priceSpecification.validThrough
    ? new Date(priceSpecification.validThrough)
    : null;

  if (validFrom && now < validFrom) return null;
  if (validThrough && now > validThrough) return null;

  return { price: Number(priceSpecification.price), validThrough };
};

export const ADD_ON_OPTION_ID = "addOns";

export const getAddOnItems = (item: OrderMenuItem): OrderMenuAddOnItem[] => {
  const seen = new Set<string>();

  return item.addOns
    .flatMap(({ menuItems }) => menuItems)
    .filter(({ id }) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
};

export const getAddOnPrice = (addOnItem: OrderMenuAddOnItem): number => {
  const offer = addOnItem.offers[0];

  return getActivePromo(offer)?.price || Number(offer?.price || 0);
};

export const getItemKey = (
  menuItemId: string,
  modifiers: Record<string, string[]>,
  addOns: string[],
): string => {
  const parts = [
    ...Object.entries(modifiers).flatMap(([groupId, selected]) =>
      [...selected].sort().map((modifierId) => `${groupId}:${modifierId}`),
    ),
    ...[...addOns].sort().map((addOnId) => `${ADD_ON_OPTION_ID}:${addOnId}`),
  ];

  return parts.length > 0 ? `${menuItemId}_${parts.join("_")}` : menuItemId;
};

const findItemById = (
  menu: OrderMenu | null,
  itemId: string,
): OrderMenuItem | undefined =>
  menu?.sections
    .flatMap(({ menuItems }) => menuItems)
    .find(({ id }) => id === itemId);

export const getItemName = (menu: OrderMenu | null, itemId: string): string => {
  const item = findItemById(menu, itemId);
  if (!item) return "";

  return item.name;
};

export const getItemStock = (
  menu: OrderMenu | null,
  itemId: string,
): number | null => {
  const item = findItemById(menu, itemId);
  if (!item) return 0;

  return item.offers[0]?.inventoryLevel?.value ?? null;
};

type AddOnLimitResult = { cap: number; names: string[] };

export const getAddOnsCap = (
  selectedAddOnItems: OrderMenuAddOnItem[],
  getChoiceAvailableQuantity: (choiceId: string, choiceStock: number) => number,
): AddOnLimitResult =>
  selectedAddOnItems.reduce<AddOnLimitResult>(
    (acc, { id, name, offers }) => {
      const stock = offers[0]?.inventoryLevel?.value ?? null;
      const available =
        stock === null ? Infinity : getChoiceAvailableQuantity(id, stock);

      if (available < acc.cap) return { cap: available, names: [name] };
      if (
        available === acc.cap &&
        acc.cap !== Infinity &&
        !acc.names.includes(name)
      )
        acc.names.push(name);

      return acc;
    },
    { cap: Infinity, names: [] },
  );

export const getLimitingAddOnsCap = (
  menu: OrderMenu | null,
  menuItemId: string,
  addOns: string[],
  getChoiceAvailableQuantity: (choiceId: string, choiceStock: number) => number,
): AddOnLimitResult => {
  const item = findItemById(menu, menuItemId);
  if (!item) return { cap: Infinity, names: [] };

  const selectedAddOnItems = getAddOnItems(item).filter(({ id }) =>
    addOns.includes(id),
  );

  return getAddOnsCap(selectedAddOnItems, getChoiceAvailableQuantity);
};

interface CommonSeparators {
  addOnLabel?: string;
  colon: string;
  delimiter: string;
  joinWith?: string;
}

export const getChoiceNames = (
  menu: OrderMenu | null,
  menuItemId: string,
  modifiers: Record<string, string[]>,
  addOns: string[],
  { addOnLabel, colon, delimiter, joinWith = "\n" }: CommonSeparators,
): string => {
  const item = findItemById(menu, menuItemId);
  if (!item) return "";

  const modifierParts = Object.entries(modifiers).flatMap(
    ([groupId, modifierIds]) => {
      if (!modifierIds.length) return [];

      const group = item.modifierGroups.find(({ id }) => id === groupId);

      const modifierNames = modifierIds
        .map(
          (modifierId) =>
            group?.modifiers.find(({ id }) => id === modifierId)?.displayName,
        )
        .filter(Boolean)
        .join(delimiter);

      return modifierNames
        ? [`${group?.displayName ?? ""}${colon}${modifierNames}`]
        : [];
    },
  );

  const addOnItems = getAddOnItems(item);
  const addOnNames = addOns
    .map((addOnId) => addOnItems.find(({ id }) => id === addOnId)?.name)
    .filter(Boolean)
    .join(delimiter);

  return [
    ...modifierParts,
    ...(addOnNames ? [`${addOnLabel ?? ""}${colon}${addOnNames}`] : []),
  ].join(joinWith);
};
