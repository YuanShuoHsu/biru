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
  itemId: string,
  choices: Record<string, string[]>,
): string => {
  if (!choices) return itemId;

  const parts = Object.entries(choices).flatMap(([optionId, selected]) =>
    selected.length > 0
      ? [...selected].sort().map((choiceId) => `${optionId}:${choiceId}`)
      : [],
  );

  return parts.length > 0 ? `${itemId}_${parts.join("_")}` : itemId;
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
  id: string,
  choices: Record<string, string[]>,
  getChoiceAvailableQuantity: (choiceId: string, choiceStock: number) => number,
): AddOnLimitResult => {
  const item = findItemById(menu, id);
  if (!item) return { cap: Infinity, names: [] };

  const selectedIds = choices[ADD_ON_OPTION_ID] ?? [];
  const selectedAddOnItems = getAddOnItems(item).filter(({ id }) =>
    selectedIds.includes(id),
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
  itemId: string,
  choices: Record<string, string[]>,
  { addOnLabel, colon, delimiter, joinWith = "\n" }: CommonSeparators,
): string => {
  const item = findItemById(menu, itemId);
  if (!item) return "";

  const addOnItems = getAddOnItems(item);

  return Object.entries(choices)
    .flatMap(([optionId, choiceIds]) => {
      if (!choiceIds.length) return [];

      const isAddOn = optionId === ADD_ON_OPTION_ID;
      const group = isAddOn
        ? undefined
        : item.modifierGroups.find(({ id }) => id === optionId);
      const label = isAddOn ? (addOnLabel ?? "") : (group?.displayName ?? "");

      const choiceNames = choiceIds
        .map((choiceId) =>
          isAddOn
            ? addOnItems.find(({ id }) => id === choiceId)?.name
            : group?.modifiers.find(({ id }) => id === choiceId)?.displayName,
        )
        .filter(Boolean)
        .join(delimiter);

      return choiceNames ? [`${label}${colon}${choiceNames}`] : [];
    })
    .join(joinWith);
};
