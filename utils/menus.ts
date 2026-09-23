import {
  LOW_STOCK_THRESHOLD,
  SERVING_TEMPERATURE_OF_LEVEL,
} from "@/constants/menus";

import type { CartAddOn, CartItem } from "@/stores/cart-store";

import { servingTemperatureLevelValues } from "@/types/api";

import type {
  OrderMenu,
  OrderMenuAddOnItem,
  OrderMenuItem,
  OrderMenuModifierGroup,
  OrderMenuOffer,
  ServingTemperature,
  ServingTemperatureLevel,
  Sweetness,
  SweetnessLevel,
} from "@/types/menus";
import type { ApiOrderMode } from "@/types/orderMode";

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

export const getServingTemperatureLevels = (
  servingTemperatures: ServingTemperature[],
): ServingTemperatureLevel[] =>
  servingTemperatureLevelValues.filter((level) =>
    servingTemperatures.includes(SERVING_TEMPERATURE_OF_LEVEL[level]),
  );

export const hasUnsatisfiableModifierGroup = (
  modifierGroups: OrderMenuModifierGroup[],
  mode: ApiOrderMode,
): boolean =>
  modifierGroups.some(
    ({ minSelectionCount, modifiers }) =>
      modifiers.filter(
        ({ availability, availableModes }) =>
          availability !== "SoldOut" &&
          availability !== "Discontinued" &&
          availableModes.includes(mode),
      ).length < minSelectionCount,
  );

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

export const getItemPrice = (offer?: OrderMenuOffer): number => {
  const promo = getActivePromo(offer);

  return promo !== null ? promo.price : Number(offer?.price || 0);
};

export const getAddOnPrice = (addOnItem: OrderMenuAddOnItem): number =>
  getItemPrice(addOnItem.offers[0]);

export const getGroupsExtraCost = (
  groups: OrderMenuModifierGroup[],
  selections: Record<string, string[]>,
): number =>
  groups.reduce((sum, { id, modifiers }) => {
    const selected = selections[id] || [];

    return (
      sum +
      modifiers.reduce(
        (groupSum, { id, priceAdjustment }) =>
          selected.includes(id)
            ? groupSum + Number(priceAdjustment || 0)
            : groupSum,
        0,
      )
    );
  }, 0);

export const calcCartItemExtraCost = (
  menu: OrderMenu | null,
  menuItemId: string,
  modifiers: Record<string, string[]>,
  addOns: CartAddOn[],
): number => {
  const item = findItemById(menu, menuItemId);
  if (!item) return 0;

  const modifierExtraCost = getGroupsExtraCost(item.modifierGroups, modifiers);

  const addOnMap = new Map(addOns.map((a) => [a.menuItemId, a]));
  const selectedAddOnItems = getAddOnItems(item).filter(({ id }) =>
    addOnMap.has(id),
  );

  const addOnExtraCost = selectedAddOnItems.reduce((sum, addOnItem) => {
    const addOnModifiers = addOnMap.get(addOnItem.id)?.modifiers || {};

    return (
      sum +
      getAddOnPrice(addOnItem) +
      getGroupsExtraCost(addOnItem.modifierGroups, addOnModifiers)
    );
  }, 0);

  return modifierExtraCost + addOnExtraCost;
};

export const calcCartItemAmount = (
  menu: OrderMenu | null,
  item: CartItem,
): number => {
  const { menuItemId, modifiers, addOns, quantity } = item;
  const menuItem = findItemById(menu, menuItemId);
  if (!menuItem) return 0;

  const offer = menuItem.offers[0];
  const price = getItemPrice(offer);
  const extraCost = calcCartItemExtraCost(menu, menuItemId, modifiers, addOns);

  return (price + extraCost) * quantity;
};

export const getCartAvailableHours = (
  menu: OrderMenu | null,
  cartItemsList: CartItem[],
): { availableHours: string; name: string }[] =>
  cartItemsList.flatMap(({ addOns, menuItemId }) => {
    const item = findItemById(menu, menuItemId);
    if (!item) return [];

    const addOnItems = getAddOnItems(item);

    return [
      item,
      ...addOns.flatMap(({ menuItemId }) =>
        addOnItems.filter(({ id }) => id === menuItemId),
      ),
    ].map(({ name, offers }) => ({
      availableHours: offers[0]?.availableHours || "",
      name,
    }));
  });

export const getItemKey = ({
  addOns,
  menuItemId,
  modifiers,
  servingTemperatureLevel,
  sweetnessLevel,
}: Omit<CartItem, "quantity">): string => {
  const parts = [
    ...(servingTemperatureLevel
      ? [`servingTemperatureLevel:${servingTemperatureLevel}`]
      : []),
    ...(sweetnessLevel ? [`sweetnessLevel:${sweetnessLevel}`] : []),
    ...Object.entries(modifiers).flatMap(([groupId, selected]) =>
      [...selected].sort().map((modifierId) => `${groupId}:${modifierId}`),
    ),
    ...[...addOns]
      .sort((a, b) => a.menuItemId.localeCompare(b.menuItemId))
      .flatMap(
        ({
          menuItemId: addOnId,
          modifiers,
          servingTemperatureLevel: addOnServingTemperatureLevel,
          sweetnessLevel: addOnSweetnessLevel,
        }) => [
          `${ADD_ON_OPTION_ID}:${addOnId}`,
          ...(addOnServingTemperatureLevel
            ? [
                `${ADD_ON_OPTION_ID}:${addOnId}:servingTemperatureLevel:${addOnServingTemperatureLevel}`,
              ]
            : []),
          ...(addOnSweetnessLevel
            ? [
                `${ADD_ON_OPTION_ID}:${addOnId}:sweetnessLevel:${addOnSweetnessLevel}`,
              ]
            : []),
          ...Object.entries(modifiers).flatMap(([groupId, selected]) =>
            [...selected]
              .sort()
              .map(
                (modifierId) =>
                  `${ADD_ON_OPTION_ID}:${addOnId}:${groupId}:${modifierId}`,
              ),
          ),
        ],
      ),
  ];

  return parts.length > 0 ? `${menuItemId}_${parts.join("_")}` : menuItemId;
};

export const findItemById = (
  menu: OrderMenu | null,
  itemId: string,
): OrderMenuItem | undefined =>
  menu?.sections
    ?.flatMap(({ menuItems }) => menuItems)
    .find(({ id }) => id === itemId);

export const getOfferStock = (offer?: OrderMenuOffer): number | null => {
  if (
    offer?.availability === "SoldOut" ||
    offer?.availability === "Discontinued"
  )
    return 0;

  // || 把 0 當 null，null 代表無追蹤，缺貨變無限制
  return offer?.inventoryLevel?.value ?? null;
};

export const getItemStock = (
  menu: OrderMenu | null,
  itemId: string,
  mode: ApiOrderMode,
): number | null => {
  const item = findItemById(menu, itemId);
  if (!item) return 0;
  if (!item.availableModes.includes(mode)) return 0;

  return getOfferStock(item.offers[0]);
};

const isInvalidServingTemperatureLevel = (
  servingTemperatures: ServingTemperature[],
  servingTemperatureLevel: ServingTemperatureLevel | null,
): boolean =>
  servingTemperatures.length > 0
    ? !servingTemperatureLevel ||
      !servingTemperatures.includes(
        SERVING_TEMPERATURE_OF_LEVEL[servingTemperatureLevel],
      )
    : !!servingTemperatureLevel;

// 只有可調才看客人選的值；不可調時後端以品項設定為準，再訂一次帶回的固定甜度不算錯
const isInvalidSweetnessLevel = (
  sweetness: Sweetness,
  sweetnessLevel: SweetnessLevel | null,
): boolean => sweetness === "Adjustable" && !sweetnessLevel;

// 可調為客人所選、固定為品項當下的設定
export const getDisplaySweetnessLevel = (
  { fixedSweetnessLevel, sweetness }: OrderMenuItem | OrderMenuAddOnItem,
  sweetnessLevel: SweetnessLevel | null,
): SweetnessLevel | null =>
  sweetness === "Adjustable"
    ? sweetnessLevel
    : sweetness === "Fixed"
      ? fixedSweetnessLevel || null
      : null;

export const hasInvalidChoices = (
  menu: OrderMenu | null,
  item: CartItem,
  mode: ApiOrderMode,
): boolean => {
  const menuItem = findItemById(menu, item.menuItemId);
  if (!menuItem) return false;

  const hasInvalidSelections = (
    modifierGroups: OrderMenuModifierGroup[],
    selections: Record<string, string[]>,
  ) => {
    const modifiers = modifierGroups.flatMap(({ modifiers }) => modifiers);

    return (
      Object.values(selections)
        .flat()
        .some((selectedId) => {
          const modifier = modifiers.find(({ id }) => id === selectedId);

          return (
            !modifier ||
            !modifier.availableModes.includes(mode) ||
            modifier.availability === "SoldOut" ||
            modifier.availability === "Discontinued"
          );
        }) ||
      modifierGroups.some(({ id, maxSelectionCount, minSelectionCount }) => {
        const selected = selections[id] || [];

        return (
          selected.length < minSelectionCount ||
          (maxSelectionCount != null && selected.length > maxSelectionCount)
        );
      })
    );
  };

  if (
    isInvalidServingTemperatureLevel(
      menuItem.servingTemperatures,
      item.servingTemperatureLevel,
    ) ||
    isInvalidSweetnessLevel(menuItem.sweetness, item.sweetnessLevel) ||
    hasInvalidSelections(menuItem.modifierGroups, item.modifiers)
  )
    return true;

  const addOnItems = getAddOnItems(menuItem);

  return item.addOns.some(
    ({ menuItemId, modifiers, servingTemperatureLevel, sweetnessLevel }) => {
      const addOnItem = addOnItems.find(({ id }) => id === menuItemId);
      if (!addOnItem) return true;

      return (
        !addOnItem.availableModes.includes(mode) ||
        isInvalidServingTemperatureLevel(
          addOnItem.servingTemperatures,
          servingTemperatureLevel,
        ) ||
        isInvalidSweetnessLevel(addOnItem.sweetness, sweetnessLevel) ||
        hasInvalidSelections(addOnItem.modifierGroups, modifiers)
      );
    },
  );
};

type AddOnLimitResult = { cap: number; names: string[] };

export const getAddOnsCap = (
  selectedAddOnItems: OrderMenuAddOnItem[],
  getUsedQuantity: (addOnId: string) => number,
): AddOnLimitResult =>
  selectedAddOnItems.reduce<AddOnLimitResult>(
    (acc, { id, name, offers }) => {
      const stock = getOfferStock(offers[0]);
      const available = stock === null ? Infinity : stock - getUsedQuantity(id);

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
  addOns: CartAddOn[],
  getUsedQuantity: (addOnId: string) => number,
): AddOnLimitResult => {
  const item = findItemById(menu, menuItemId);
  if (!item) return { cap: Infinity, names: [] };

  const selectedAddOnItems = getAddOnItems(item).filter(({ id }) =>
    addOns.some((addOn) => addOn.menuItemId === id),
  );

  return getAddOnsCap(selectedAddOnItems, getUsedQuantity);
};

interface ChoiceNameOptions {
  addOnLabel?: string;
  colon: string;
  delimiter: string;
  getServingTemperatureLevelLabel: (level: ServingTemperatureLevel) => string;
  getServingTemperatureLevelName: (level: ServingTemperatureLevel) => string;
  getSweetnessLevelName: (level: SweetnessLevel) => string;
  parenthesisOpen: string;
  parenthesisClose: string;
  sweetnessLabel: string;
}

export const getChoiceNames = (
  menu: OrderMenu | null,
  {
    addOns,
    menuItemId,
    modifiers,
    servingTemperatureLevel,
    sweetnessLevel,
  }: CartItem,
  {
    addOnLabel,
    colon,
    delimiter,
    getServingTemperatureLevelLabel,
    getServingTemperatureLevelName,
    getSweetnessLevelName,
    parenthesisOpen,
    parenthesisClose,
    sweetnessLabel,
  }: ChoiceNameOptions,
): string => {
  const item = findItemById(menu, menuItemId);
  if (!item) return "";

  const getSelectionParts = (
    modifierGroups: OrderMenuModifierGroup[],
    selections: Record<string, string[]>,
    level: ServingTemperatureLevel | null,
    displaySweetnessLevel: SweetnessLevel | null,
  ): string[] => [
    ...(level
      ? [
          `${getServingTemperatureLevelLabel(level)}${colon}${getServingTemperatureLevelName(level)}`,
        ]
      : []),
    ...(displaySweetnessLevel
      ? [
          `${sweetnessLabel}${colon}${getSweetnessLevelName(displaySweetnessLevel)}`,
        ]
      : []),
    ...Object.entries(selections).flatMap(([groupId, modifierIds]) => {
      if (!modifierIds.length) return [];

      const group = modifierGroups.find(({ id }) => id === groupId);
      const names = modifierIds
        .map(
          (modifierId) =>
            group?.modifiers.find(({ id }) => id === modifierId)?.displayName,
        )
        .filter(Boolean)
        .join(delimiter);

      return names ? [`${group?.displayName ?? ""}${colon}${names}`] : [];
    }),
  ];

  const addOnItems = getAddOnItems(item);
  const addOnNames = addOns
    .map(
      ({
        menuItemId: addOnId,
        modifiers,
        servingTemperatureLevel: addOnServingTemperatureLevel,
        sweetnessLevel: addOnSweetnessLevel,
      }) => {
        const addOnItem = addOnItems.find(({ id }) => id === addOnId);
        if (!addOnItem) return "";

        const modifierParts = getSelectionParts(
          addOnItem.modifierGroups,
          modifiers,
          addOnServingTemperatureLevel,
          getDisplaySweetnessLevel(addOnItem, addOnSweetnessLevel),
        ).join(delimiter);

        return modifierParts
          ? `${addOnItem.name}${parenthesisOpen}${modifierParts}${parenthesisClose}`
          : addOnItem.name;
      },
    )
    .filter(Boolean)
    .join(delimiter);

  return [
    ...getSelectionParts(
      item.modifierGroups,
      modifiers,
      servingTemperatureLevel,
      getDisplaySweetnessLevel(item, sweetnessLevel),
    ),
    ...(addOnNames ? [`${addOnLabel ?? ""}${colon}${addOnNames}`] : []),
  ].join(delimiter);
};
