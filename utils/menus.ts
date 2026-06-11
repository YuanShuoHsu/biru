import { LOW_STOCK_THRESHOLD } from "@/constants/menus";

import type { OrderMenu, OrderMenuItem, OrderMenuOffer } from "@/types/menus";

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

export interface Choice {
  id: string;
  name: string;
  extraCost: number;
  stock: number | null;
  isShared: boolean;
  isActive: boolean;
}

export interface Option {
  id: string;
  name: string;
  choices: Choice[];
  multiple: boolean;
  required: boolean;
  minSelections: number;
  maxSelections: number | null;
}

export const ADD_ON_OPTION_ID = "addOns";

export const getItemOptions = (
  item: OrderMenuItem,
  addOnLabel = "",
): Option[] => {
  const modifierOptions = item.modifierGroups.map(
    ({ id, displayName, minSelectionCount, maxSelectionCount, modifiers }) => ({
      id,
      name: displayName,
      multiple: maxSelectionCount !== 1,
      required: minSelectionCount >= 1,
      minSelections: minSelectionCount,
      maxSelections: maxSelectionCount ?? null,
      choices: modifiers.map(
        ({ id, displayName, priceAdjustment, availability }) => ({
          id,
          name: displayName,
          extraCost: Number(priceAdjustment ?? 0),
          stock: null,
          isShared: false,
          isActive: availability !== "SoldOut",
        }),
      ),
    }),
  );

  const seen = new Set<string>();
  const addOnChoices = item.addOns
    .flatMap(({ menuItems }) => menuItems)
    .filter(({ id }) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .map(({ id, name, offers }) => {
      const offer = offers[0];
      const basePrice = Number(offer?.price || 0);

      return {
        id,
        name,
        extraCost: getActivePromo(offer)?.price || basePrice,
        stock: offer?.inventoryLevel?.value ?? null,
        isShared: true,
        isActive: offer?.availability !== "SoldOut",
      };
    });

  return [
    ...modifierOptions,
    ...(addOnChoices.length > 0
      ? [
          {
            id: ADD_ON_OPTION_ID,
            name: addOnLabel,
            multiple: true,
            required: false,
            minSelections: 0,
            maxSelections: null,
            choices: addOnChoices,
          },
        ]
      : []),
  ];
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

const findOptionChoiceById = (
  option: Option,
  choiceId: string,
): Choice | undefined => option.choices.find(({ id }) => id === choiceId);

const getOptionChoiceName = (option: Option, choiceId: string): string => {
  const choice = findOptionChoiceById(option, choiceId);

  return choice?.name || "";
};

export const getSelectedChoices = (
  options: Option[],
  choices: Record<string, string[]>,
): Choice[] =>
  Object.entries(choices).flatMap(([optionId, choiceIds]) => {
    const option = options.find(({ id }) => id === optionId);
    if (!option) return [];

    return choiceIds.flatMap((choiceId) => {
      const choice = findOptionChoiceById(option, choiceId);
      return choice ? [choice] : [];
    });
  });

type OptionLimitResult = { cap: number; names: string[] };

export const getChoicesCap = (
  selectedChoices: Choice[],
  itemId: string,
  getChoiceAvailableQuantity: (
    choiceId: string,
    choiceStock: number | null,
    isShared: boolean,
    itemId: string,
  ) => number,
): OptionLimitResult =>
  selectedChoices.reduce<OptionLimitResult>(
    (acc, { id, name, stock, isShared }) => {
      const available =
        stock === null
          ? Infinity
          : getChoiceAvailableQuantity(id, stock, isShared, itemId);

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

export const getLimitingChoicesCap = (
  menu: OrderMenu | null,
  id: string,
  choices: Record<string, string[]>,
  getChoiceAvailableQuantity: (
    choiceId: string,
    choiceStock: number | null,
    isShared: boolean,
    itemId: string,
  ) => number,
): OptionLimitResult => {
  const item = findItemById(menu, id);
  if (!item) return { cap: Infinity, names: [] };

  const selectedChoices = getSelectedChoices(getItemOptions(item), choices);

  return getChoicesCap(selectedChoices, id, getChoiceAvailableQuantity);
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

  const options = getItemOptions(item, addOnLabel);

  return Object.entries(choices)
    .flatMap(([optionId, choiceIds]) => {
      if (!choiceIds.length) return [];

      const option = options.find(({ id }) => id === optionId);
      if (!option) return [];

      const choiceNames = choiceIds
        .map((choiceId) => getOptionChoiceName(option, choiceId))
        .filter(Boolean)
        .join(delimiter);

      return choiceNames ? [`${option.name}${colon}${choiceNames}`] : [];
    })
    .join(joinWith);
};
