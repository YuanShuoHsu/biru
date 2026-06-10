import type { OrderMenu, OrderMenuItem, OrderMenuOffer } from "@/types/menus";

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
}

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
  menus: OrderMenu[],
  itemId: string,
): OrderMenuItem | undefined =>
  menus.flatMap(({ menuItems }) => menuItems).find(({ id }) => id === itemId);

export const getItemName = (menus: OrderMenu[], itemId: string): string => {
  const item = findItemById(menus, itemId);
  if (!item) return "";

  return item.name;
};

export const getItemStock = (
  menus: OrderMenu[],
  itemId: string,
): number | null => {
  const item = findItemById(menus, itemId);
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

const findItemOptionById = (
  item: OrderMenuItem & { options: Option[] },
  optionId: string,
): Option | undefined => item.options.find(({ id }) => id === optionId);

type OptionLimitResult = { cap: number; names: string[] };

export const getLimitingChoicesCap = (
  menus: OrderMenu[],
  id: string,
  choices: Record<string, string[]>,
  getChoiceAvailableQuantity: (
    choiceId: string,
    choiceStock: number | null,
    isShared: boolean,
    itemId: string,
  ) => number,
): OptionLimitResult => {
  const item = findItemById(menus, id) as
    | (OrderMenuItem & { options: Option[] })
    | undefined;
  if (!item) return { cap: Infinity, names: [] };

  const { names, cap } = Object.entries(choices).reduce<OptionLimitResult>(
    (acc, [optionId, choiceIds]) => {
      if (!choiceIds.length) return acc;

      const option = findItemOptionById(item, optionId);
      if (!option) return acc;

      const optionCap = choiceIds.reduce((min, choiceId) => {
        const choice = findOptionChoiceById(option, choiceId);
        if (!choice) return min;

        const { stock: choiceStock, isShared, name } = choice;
        const available = getChoiceAvailableQuantity(
          choiceId,
          choiceStock,
          isShared,
          id,
        );

        if (available < acc.cap) {
          acc.names = [name];
          acc.cap = available;
        } else if (available === acc.cap && !acc.names.includes(name))
          acc.names.push(name);

        return Math.min(min, available);
      }, Infinity);

      acc.cap = Math.min(acc.cap, optionCap);
      return acc;
    },
    { cap: Infinity, names: [] },
  );

  return { names, cap };
};

interface CommonSeparators {
  colon: string;
  delimiter: string;
  joinWith?: string;
}

export const getChoiceNames = (
  menus: OrderMenu[],
  itemId: string,
  choices: Record<string, string[]>,
  { colon, delimiter, joinWith = "\n" }: CommonSeparators,
): string => {
  const item = findItemById(menus, itemId) as
    | (OrderMenuItem & { options: Option[] })
    | undefined;
  if (!item) return "";

  return Object.entries(choices)
    .flatMap(([optionId, choiceIds]) => {
      if (!choiceIds.length) return [];

      const option = findItemOptionById(item, optionId);
      if (!option) return [];

      const choiceNames = choiceIds
        .map((choiceId) => getOptionChoiceName(option, choiceId))
        .filter(Boolean)
        .join(delimiter);

      return choiceNames ? [`${option.name}${colon}${choiceNames}`] : [];
    })
    .join(joinWith);
};
