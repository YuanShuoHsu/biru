import { menu } from "@/constants/menu";

import { useCartStore } from "@/stores/useCartStore";

import type { LocaleCode } from "@/types/locale";
import type { Choice, MenuItem, Option } from "@/types/menu";

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

const findItemById = (itemId: string): MenuItem | undefined =>
  menu.flatMap(({ items }) => items).find(({ id }) => id === itemId);

export const getItemName = (itemId: string, lang: LocaleCode): string => {
  const item = findItemById(itemId);
  if (!item) return "";

  return item.name[lang];
};

export const getItemStock = (itemId: string): number | null => {
  const item = findItemById(itemId);
  if (!item) return 0;

  return item.stock;
};

const findOptionChoiceById = (
  option: Option,
  choiceId: string,
): Choice | undefined => option.choices.find(({ id }) => id === choiceId);

const getOptionChoiceName = (
  option: Option,
  choiceId: string,
  lang: LocaleCode,
): string => {
  const choice = findOptionChoiceById(option, choiceId);

  return choice?.name[lang] || "";
};

const findItemOptionById = (
  item: MenuItem,
  optionId: string,
): Option | undefined => item.options.find(({ id }) => id === optionId);

type OptionLimitResult = { cap: number; names: string[] };

export const getLimitingChoicesCap = (
  id: string,
  choices: Record<string, string[]>,
  lang: LocaleCode,
): OptionLimitResult => {
  const { getChoiceAvailableQuantity } = useCartStore.getState();

  const item = findItemById(id);
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

        const localizedName = name[lang];

        if (available < acc.cap) {
          acc.names = [localizedName];
          acc.cap = available;
        } else if (available === acc.cap && !acc.names.includes(localizedName))
          acc.names.push(localizedName);

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
  itemId: string,
  choices: Record<string, string[]>,
  lang: LocaleCode,
  { colon, delimiter, joinWith = "\n" }: CommonSeparators,
): string => {
  const item = findItemById(itemId);
  if (!item) return "";

  return Object.entries(choices)
    .flatMap(([optionId, choiceIds]) => {
      if (!choiceIds.length) return [];

      const option = findItemOptionById(item, optionId);
      if (!option) return [];

      const choiceNames = choiceIds
        .map((choiceId) => getOptionChoiceName(option, choiceId, lang))
        .filter(Boolean)
        .join(delimiter);

      return choiceNames ? [`${option.name[lang]}${colon}${choiceNames}`] : [];
    })
    .join(joinWith);
};
