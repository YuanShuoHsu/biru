import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { type AddToCartFormInput, useAddToCartFormSchema } from "./definitions";

import CheckboxesGroup from "@/components/CheckboxesGroup";
import FormBox from "@/components/FormBox";
import NumberSpinner from "@/components/NumberSpinner";
import RadioButtonsGroup from "@/components/RadioButtonsGroup";

import { MAX_QUANTITY } from "@/constants/cart";
import { API_ORDER_MODE } from "@/constants/orderMode";
import { STORE_TIMEZONE } from "@/constants/timezone";

import { useAvailableHoursLabel } from "@/hooks/useAvailableHoursLabel";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import { useOutsideAvailableHours } from "@/hooks/useOutsideAvailableHours";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  AccessTime,
  EventAvailable,
  RestaurantMenu,
} from "@mui/icons-material";
import { Box, Chip, Divider, Radio, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/providers/cart-store-provider";
import { useDialogStore } from "@/providers/dialog-store-provider";

import type { CartItem } from "@/stores/cart-store";

import type {
  ItemAvailability,
  OrderMenuItem,
  OrderMenuModifierGroup,
  ServingTemperature,
} from "@/types/menus";
import type { ApiOrderMode } from "@/types/orderMode";
import type { RouteParams } from "@/types/routeParams";

import {
  ADD_ON_OPTION_ID,
  getActivePromo,
  getAddOnItems,
  getAddOnPrice,
  getAddOnsCap,
  getApplicableModifierGroups,
  getDefaultServingTemperature,
  getGroupsExtraCost,
  getOfferStock,
  hasUnsatisfiableModifierGroup,
  isLowStock,
  isMenuItemUnsatisfiable,
} from "@/utils/menus";

const ImageBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  aspectRatio: "16/9",
  overflow: "hidden",
}));

const StyledRestaurantMenu = styled(RestaurantMenu)(({ theme }) => ({
  fontSize: theme.spacing(6),
}));

const WrapTypography = styled(Typography)({
  overflowWrap: "anywhere",
});

const StyledNumberSpinner = styled(NumberSpinner)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    flex: 1,
  },
}));

const OriginalPriceTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isPromo",
})<{ isPromo: boolean }>(({ isPromo }) => ({
  ...(isPromo && {
    textDecoration: "line-through",
    lineHeight: 1.2,
  }),
}));

interface CardDialogContentProps {
  cartItem?: CartItem;
  menuItem: OrderMenuItem;
}

const CardDialogContent = ({ cartItem, menuItem }: CardDialogContentProps) => {
  const {
    id,
    name,
    description,
    image,
    offers,
    suitableForDiet,
    nutrition,
    modifierGroups,
    servingTemperatures,
  } = menuItem;
  const offer = offers[0];
  const basePrice = Number(offer?.price || 0);
  const priceCurrency = offer?.priceCurrency;
  const stock = getOfferStock(offer);
  const stockUnit = offer?.inventoryLevel?.unitText;
  const leadTimeMinutes = offer?.deliveryLeadTimeMinutes;

  const promoInfo = getActivePromo(offer);
  const price = promoInfo?.price || basePrice;
  const showLowStock = isLowStock(offer);

  const { addCartItem, getCartItemTotalQuantity, updateCartItem } =
    useCartStore((state) => state);

  const format = useFormatter();

  const formatMoney = useFormatMoney();

  const { mode } = useParams<RouteParams<"mode">>();
  const apiMode = API_ORDER_MODE[mode];

  const getAvailableHoursLabel = useAvailableHoursLabel();
  const isOutsideAvailableHours = useOutsideAvailableHours();
  const itemAvailableHoursLabel = getAvailableHoursLabel(offer?.availableHours);

  const tCommon = useTranslations("common");
  const tDialog = useTranslations("dialog");
  const tOrder = useTranslations("order");

  const addToCartFormSchema = useAddToCartFormSchema(menuItem);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<AddToCartFormInput>({
    defaultValues: {
      quantity: cartItem?.quantity || 1,
      servingTemperature:
        cartItem?.servingTemperature ||
        getDefaultServingTemperature(servingTemperatures),
      choices: cartItem
        ? {
            ...cartItem.modifiers,
            [ADD_ON_OPTION_ID]: cartItem.addOns.map(
              ({ menuItemId }) => menuItemId,
            ),
          }
        : {},
      addOnServingTemperatures: cartItem
        ? Object.fromEntries(
            cartItem.addOns.map(({ menuItemId, servingTemperature }) => [
              menuItemId,
              servingTemperature,
            ]),
          )
        : {},
      addOnChoices: cartItem
        ? Object.fromEntries(
            cartItem.addOns.map(({ menuItemId, modifiers }) => [
              menuItemId,
              modifiers,
            ]),
          )
        : {},
    },
    resolver: zodResolver(addToCartFormSchema),
  });

  const [
    servingTemperature = null,
    choices = {},
    addOnServingTemperatures = {},
    addOnChoices = {},
    rawQuantity = 1,
  ] = useWatch({
    control,
    name: [
      "servingTemperature",
      "choices",
      "addOnServingTemperatures",
      "addOnChoices",
      "quantity",
    ],
  });

  const applicableModifierGroups = getApplicableModifierGroups(
    modifierGroups,
    servingTemperature,
  );

  const addOnItems = useMemo(() => getAddOnItems(menuItem), [menuItem]);

  const selectedAddOnIds = choices[ADD_ON_OPTION_ID] || [];
  const selectedAddOnItems = addOnItems.filter(({ id }) =>
    selectedAddOnIds.includes(id),
  );

  const modifierExtraCost = getGroupsExtraCost(
    applicableModifierGroups,
    choices,
  );

  const getAddOnServingTemperature = ({
    id,
    servingTemperatures,
  }: Pick<OrderMenuItem, "id" | "servingTemperatures">) =>
    addOnServingTemperatures[id] ||
    getDefaultServingTemperature(servingTemperatures);

  const addOnExtraCost = selectedAddOnItems.reduce(
    (sum, addOnItem) =>
      sum +
      getAddOnPrice(addOnItem) +
      getGroupsExtraCost(
        getApplicableModifierGroups(
          addOnItem.modifierGroups,
          getAddOnServingTemperature(addOnItem),
        ),
        addOnChoices[addOnItem.id] || {},
      ),
    0,
  );

  const extraCost = modifierExtraCost + addOnExtraCost;

  const editingItem = cartItem || null;
  const cartItemTotalQuantity = getCartItemTotalQuantity(id, editingItem);
  const itemStockLeft = stock === null ? Infinity : stock;

  const perItemCapLeft = MAX_QUANTITY - cartItemTotalQuantity;
  const itemStockCapLeft = itemStockLeft - cartItemTotalQuantity;

  const { names: limitingAddOnNames, cap: addOnCapLeft } = getAddOnsCap(
    selectedAddOnItems,
    (addOnId) => getCartItemTotalQuantity(addOnId, editingItem),
  );

  const availableToAdd = Math.min(
    perItemCapLeft,
    itemStockCapLeft,
    addOnCapLeft,
  );
  const minQuantity = availableToAdd > 0 ? 1 : 0;
  const clampQuantity = (value: number) =>
    Math.max(Math.min(value, availableToAdd), minQuantity);
  const quantity = clampQuantity(rawQuantity);

  const { closeDialog, setDialog } = useDialogStore((state) => state);

  const amount = (price + extraCost) * quantity;
  const displayPrice = formatMoney(amount, priceCurrency);
  const isAtLimit = quantity >= availableToAdd;

  const limitingLabel = [
    ...(itemStockCapLeft === availableToAdd ? [name] : []),
    ...(addOnCapLeft === availableToAdd ? limitingAddOnNames : []),
  ].join(tCommon("delimiter"));

  const formHelperText =
    perItemCapLeft === availableToAdd
      ? tCommon("maxQuantity", { quantity: MAX_QUANTITY })
      : availableToAdd > 0
        ? tDialog("maxStock", {
            label: limitingLabel,
            quantity: availableToAdd,
          })
        : itemStockLeft === 0
          ? tCommon("soldOut")
          : tCommon("reachStockLimit", { label: limitingLabel });

  useEffect(() => {
    setDialog({ confirmDisabled: quantity <= 0 });
  }, [quantity, setDialog]);

  const handleChoicesChange = (groupId: string, next: string[]) =>
    setValue(`choices.${groupId}`, next, { shouldValidate: isSubmitted });

  const handleAddOnChoicesChange =
    (addOnId: string) => (groupId: string, next: string[]) =>
      setValue(`addOnChoices.${addOnId}.${groupId}`, next, {
        shouldValidate: isSubmitted,
      });

  // 換溫度後不再適用的群組，連同已選的選項一起清掉
  const pickApplicableChoices = (
    selections: Record<string, string[]>,
    groups: OrderMenuModifierGroup[],
    next: ServingTemperature,
  ) =>
    Object.fromEntries(
      Object.entries(selections).filter(
        ([groupId]) =>
          groupId === ADD_ON_OPTION_ID ||
          getApplicableModifierGroups(groups, next).some(
            ({ id }) => id === groupId,
          ),
      ),
    );

  const handleServingTemperatureChange = (next: ServingTemperature) => {
    setValue("servingTemperature", next, { shouldValidate: isSubmitted });
    setValue("choices", pickApplicableChoices(choices, modifierGroups, next), {
      shouldValidate: isSubmitted,
    });
  };

  const handleAddOnServingTemperatureChange =
    (addOnId: string, groups: OrderMenuModifierGroup[]) =>
    (next: ServingTemperature) => {
      setValue(`addOnServingTemperatures.${addOnId}`, next, {
        shouldValidate: isSubmitted,
      });
      setValue(
        `addOnChoices.${addOnId}`,
        pickApplicableChoices(addOnChoices[addOnId] || {}, groups, next),
        { shouldValidate: isSubmitted },
      );
    };

  const onSubmit = handleSubmit(
    ({ servingTemperature, choices, addOnChoices }) => {
      if (quantity <= 0) return;

      const modifiers = Object.fromEntries(
        Object.entries(choices).filter(([key]) => key !== ADD_ON_OPTION_ID),
      );
      const addOns = selectedAddOnItems.map((addOnItem) => ({
        menuItemId: addOnItem.id,
        modifiers: addOnChoices[addOnItem.id] || {},
        servingTemperature: getAddOnServingTemperature(addOnItem),
      }));

      const newItem = {
        addOns,
        menuItemId: id,
        modifiers,
        quantity,
        servingTemperature,
      };

      if (cartItem) {
        updateCartItem(cartItem, newItem);
      } else {
        addCartItem(newItem);
      }

      closeDialog();
    },
  );

  const getUnavailableLabel = (
    availability: ItemAvailability | null | undefined,
    availableModes: ApiOrderMode[],
    availableHours: string | null | undefined,
  ) =>
    !availableModes.includes(apiMode)
      ? tOrder(`mode.${apiMode}.unavailable`)
      : isOutsideAvailableHours(availableHours)
        ? tOrder("menuItem.outsideAvailableHours")
        : availability === "SoldOut" || availability === "Discontinued"
          ? tCommon("soldOut")
          : "";

  const renderChoiceLabel = (
    choiceName: string,
    choiceExtraCost: number,
    unavailableLabel: string,
    availableHoursLabel: string,
  ) => (
    <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
      <WrapTypography variant="body2">{choiceName}</WrapTypography>
      {choiceExtraCost !== 0 && (
        <Typography color="text.secondary" variant="caption">
          {choiceExtraCost > 0 ? "+" : "-"}
          {formatMoney(Math.abs(choiceExtraCost), priceCurrency)}
        </Typography>
      )}
      {availableHoursLabel && (
        <Typography color="text.secondary" variant="caption">
          {availableHoursLabel}
        </Typography>
      )}
      {unavailableLabel && (
        <Typography color="error" variant="caption">
          {unavailableLabel}
        </Typography>
      )}
    </Stack>
  );

  const getModifierGroupHint = ({
    minSelectionCount,
    maxSelectionCount,
  }: OrderMenuModifierGroup) => {
    const hints = [
      ...(minSelectionCount > 1
        ? [tOrder("menuItem.selectAtLeast", { count: minSelectionCount })]
        : []),
      ...(maxSelectionCount != null && maxSelectionCount !== 1
        ? [tOrder("menuItem.selectUpTo", { count: maxSelectionCount })]
        : []),
    ];

    return hints.length > 0 ? hints.join(tCommon("delimiter")) : null;
  };

  const renderServingTemperatureGroup = (
    options: ServingTemperature[],
    value: ServingTemperature | null,
    groups: OrderMenuModifierGroup[],
    onValueChange: (next: ServingTemperature) => void,
    error?: { message?: string },
  ) => (
    <RadioButtonsGroup
      error={!!error}
      fullWidth
      helperText={error?.message}
      label={tOrder("menuItem.servingTemperatures.label")}
      onChange={(event, next) => onValueChange(next as ServingTemperature)}
      options={options.map((option) => {
        const unavailableLabel = hasUnsatisfiableModifierGroup(
          groups,
          option,
          apiMode,
        )
          ? tCommon("soldOut")
          : "";

        return {
          control: <Radio size="small" />,
          disabled: !!unavailableLabel,
          label: renderChoiceLabel(
            tOrder(`menuItem.servingTemperatures.${option}`),
            0,
            unavailableLabel,
            "",
          ),
          value: option,
        };
      })}
      required
      value={value || ""}
    />
  );

  const renderModifierGroup = (
    group: OrderMenuModifierGroup,
    selections: Record<string, string[]>,
    onGroupChange: (groupId: string, next: string[]) => void,
    error?: { message?: string },
  ) => {
    const {
      id: groupId,
      displayName,
      minSelectionCount,
      maxSelectionCount,
      modifiers,
    } = group;
    const selected = selections[groupId] || [];
    const helperText = error?.message || getModifierGroupHint(group);

    const atMax =
      maxSelectionCount != null && selected.length >= maxSelectionCount;

    return minSelectionCount === 1 && maxSelectionCount === 1 ? (
      <RadioButtonsGroup
        key={groupId}
        error={!!error}
        fullWidth
        helperText={helperText}
        label={displayName}
        onChange={(event, next) => onGroupChange(groupId, [next])}
        options={modifiers.map(
          ({
            availability,
            availableModes,
            displayName,
            id,
            priceAdjustment,
          }) => {
            const unavailableLabel = getUnavailableLabel(
              availability,
              availableModes,
              null,
            );

            return {
              control: <Radio size="small" />,
              disabled: !!unavailableLabel,
              label: renderChoiceLabel(
                displayName,
                Number(priceAdjustment || 0),
                unavailableLabel,
                "",
              ),
              value: id,
            };
          },
        )}
        required
        value={selected[0] || ""}
      />
    ) : (
      <CheckboxesGroup
        key={groupId}
        error={!!error}
        fullWidth
        helperText={helperText}
        label={displayName}
        onChange={(event, next) => onGroupChange(groupId, next)}
        options={modifiers.map(
          ({
            availability,
            availableModes,
            displayName,
            id,
            priceAdjustment,
          }) => {
            const checked = selected.includes(id);
            const unavailableLabel = getUnavailableLabel(
              availability,
              availableModes,
              null,
            );

            return {
              children: null,
              disabled: !checked && (!!unavailableLabel || atMax),
              label: renderChoiceLabel(
                displayName,
                Number(priceAdjustment || 0),
                unavailableLabel,
                "",
              ),
              value: id,
            };
          },
        )}
        required={minSelectionCount >= 1}
        value={selected}
      />
    );
  };

  return (
    <FormBox id="add-to-cart-form" onSubmit={onSubmit}>
      <ImageBox>
        {image ? (
          <Image
            alt={name}
            draggable={false}
            fill
            sizes="(min-width: 600px) 600px, 100vw"
            src={image}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <StyledRestaurantMenu color="disabled" />
        )}
      </ImageBox>
      {description && (
        <WrapTypography color="text.secondary" variant="body2">
          {description}
        </WrapTypography>
      )}
      {suitableForDiet && suitableForDiet.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={0.5}>
          {suitableForDiet.map((diet) => (
            <Chip
              key={diet}
              label={tOrder(`menuItem.diet.${diet}`)}
              size="small"
            />
          ))}
        </Stack>
      )}
      {nutrition?.calories && (
        <Typography color="text.secondary" variant="caption">
          {tOrder("menuItem.calories", { value: nutrition.calories })}
        </Typography>
      )}
      {itemAvailableHoursLabel && (
        <Stack
          direction="row"
          alignItems="center"
          alignSelf="flex-start"
          gap={0.5}
        >
          <EventAvailable color="disabled" fontSize="small" />
          <Typography color="text.secondary" variant="caption">
            {itemAvailableHoursLabel}
          </Typography>
        </Stack>
      )}
      {leadTimeMinutes != null && (
        <Stack
          direction="row"
          alignItems="center"
          alignSelf="flex-start"
          gap={0.5}
        >
          <AccessTime color="disabled" fontSize="small" />
          <Typography color="text.secondary" variant="caption">
            {tOrder("menuItem.preparationTime", { value: leadTimeMinutes })}
          </Typography>
        </Stack>
      )}
      <Divider flexItem />
      {servingTemperatures.length > 0 &&
        renderServingTemperatureGroup(
          servingTemperatures,
          servingTemperature,
          modifierGroups,
          handleServingTemperatureChange,
          errors.servingTemperature,
        )}
      {applicableModifierGroups.map((group, index) => (
        <Fragment key={group.id}>
          {(index > 0 || servingTemperatures.length > 0) && (
            <Divider flexItem variant="inset" />
          )}
          {renderModifierGroup(
            group,
            choices,
            handleChoicesChange,
            errors.choices?.[group.id],
          )}
        </Fragment>
      ))}
      {(servingTemperatures.length > 0 ||
        applicableModifierGroups.length > 0) &&
        addOnItems.length > 0 && <Divider flexItem variant="inset" />}
      {addOnItems.length > 0 && (
        <CheckboxesGroup
          error={!!errors.choices?.[ADD_ON_OPTION_ID]}
          fullWidth
          helperText={errors.choices?.[ADD_ON_OPTION_ID]?.message}
          label={tOrder("menuItem.addOn")}
          onChange={(event, next) =>
            setValue(`choices.${ADD_ON_OPTION_ID}`, next)
          }
          options={addOnItems.map((addOnItem) => {
            const {
              availableModes,
              id,
              modifierGroups,
              name,
              offers,
              servingTemperatures,
            } = addOnItem;
            const addOnServingTemperature =
              getAddOnServingTemperature(addOnItem);
            const applicableAddOnGroups = getApplicableModifierGroups(
              modifierGroups,
              addOnServingTemperature,
            );
            const checked = selectedAddOnIds.includes(id);
            const addOnStock = getOfferStock(offers[0]);
            const outOfStockInCart =
              !checked &&
              addOnStock !== null &&
              addOnStock - getCartItemTotalQuantity(id, editingItem) <= 0;
            const unavailableLabel =
              getUnavailableLabel(
                offers[0]?.availability,
                availableModes,
                offers[0]?.availableHours,
              ) ||
              (isMenuItemUnsatisfiable(addOnItem, apiMode)
                ? tCommon("soldOut")
                : "") ||
              (outOfStockInCart
                ? tCommon("reachStockLimit", { label: "" })
                : "");

            return {
              children: checked &&
                (servingTemperatures.length > 0 ||
                  applicableAddOnGroups.length > 0) && (
                  <Stack pl={3} gap={2}>
                    {servingTemperatures.length > 0 &&
                      renderServingTemperatureGroup(
                        servingTemperatures,
                        addOnServingTemperature,
                        modifierGroups,
                        handleAddOnServingTemperatureChange(id, modifierGroups),
                        errors.addOnServingTemperatures?.[id],
                      )}
                    {applicableAddOnGroups.map((group, index) => (
                      <Fragment key={group.id}>
                        {(index > 0 || servingTemperatures.length > 0) && (
                          <Divider flexItem variant="inset" />
                        )}
                        {renderModifierGroup(
                          group,
                          addOnChoices[id] || {},
                          handleAddOnChoicesChange(id),
                          errors.addOnChoices?.[id]?.[group.id],
                        )}
                      </Fragment>
                    ))}
                  </Stack>
                ),
              disabled: !checked && !!unavailableLabel,
              label: renderChoiceLabel(
                name,
                getAddOnPrice(addOnItem),
                unavailableLabel,
                getAvailableHoursLabel(offers[0]?.availableHours),
              ),
              value: id,
            };
          })}
          value={selectedAddOnIds}
        />
      )}
      {(servingTemperatures.length > 0 ||
        applicableModifierGroups.length > 0 ||
        addOnItems.length > 0) && <Divider flexItem />}
      <Stack
        width="100%"
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        gap={2}
      >
        <Stack direction="column" flex={1}>
          {promoInfo && (
            <OriginalPriceTypography
              color="text.disabled"
              fontWeight="bold"
              isPromo
              variant="caption"
            >
              {formatMoney(basePrice, priceCurrency)}
            </OriginalPriceTypography>
          )}
          <Typography
            color={promoInfo ? "error" : "primary"}
            component="span"
            fontWeight="bold"
            variant="h6"
          >
            {displayPrice}
          </Typography>
          {promoInfo?.validThrough && (
            <Typography color="error" variant="caption">
              {tOrder("menuItem.promoUntil", {
                date: format.dateTime(promoInfo.validThrough, {
                  month: "numeric",
                  day: "numeric",
                  timeZone: STORE_TIMEZONE,
                }),
              })}
            </Typography>
          )}
          {showLowStock && (
            <Typography color="text.secondary" variant="caption">
              {tOrder("menuItem.stockLeft", {
                stock: [stock, stockUnit].filter(Boolean).join(" "),
              })}
            </Typography>
          )}
        </Stack>
        <StyledNumberSpinner
          disabled={!quantity}
          error={isAtLimit}
          fullWidth
          helperText={isAtLimit ? formHelperText : undefined}
          max={availableToAdd}
          min={minQuantity}
          onValueChange={(value) => setValue("quantity", value || minQuantity)}
          value={quantity}
        />
      </Stack>
    </FormBox>
  );
};

export default CardDialogContent;
