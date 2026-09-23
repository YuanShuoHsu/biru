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
import { useServingTemperatureLabel } from "@/hooks/useServingTemperatureLabel";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  AccessTime,
  EventAvailable,
  RestaurantMenu,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  Collapse,
  Divider,
  Radio,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/providers/cart-store-provider";
import { useDialogStore } from "@/providers/dialog-store-provider";

import type { CartItem } from "@/stores/cart-store";

import { sweetnessLevelValues } from "@/types/api";
import type {
  ItemAvailability,
  OrderMenuItem,
  OrderMenuModifierGroup,
  ServingTemperature,
  ServingTemperatureLevel,
  Sweetness,
  SweetnessLevel,
} from "@/types/menus";
import type { ApiOrderMode } from "@/types/orderMode";
import type { RouteParams } from "@/types/routeParams";

import {
  ADD_ON_OPTION_ID,
  getActivePromo,
  getAddOnItems,
  getAddOnPrice,
  getAddOnsCap,
  getGroupsExtraCost,
  getOfferStock,
  getServingTemperatureLevels,
  hasUnsatisfiableModifierGroup,
  isLowStock,
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

const AddOnAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== "disabled",
})<{ disabled: boolean }>(({ disabled, theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(7),
  backgroundColor: theme.palette.action.hover,
  ...(disabled && {
    opacity: theme.palette.action.disabledOpacity,
  }),
}));

const AddOnLabelStack = styled(Stack)(({ theme }) => ({
  paddingBlock: theme.spacing(0.75),
}));

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
    recommendedServingTemperatureLevel,
    sweetness,
    fixedSweetnessLevel,
    recommendedSweetnessLevel,
  } = menuItem;
  const hasBuiltInChoices =
    servingTemperatures.length > 0 || sweetness !== "NotApplicable";
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
  const getServingTemperatureLabel = useServingTemperatureLabel();
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
      servingTemperatureLevel: cartItem?.servingTemperatureLevel || null,
      sweetnessLevel: cartItem?.sweetnessLevel || null,
      choices: cartItem
        ? {
            ...cartItem.modifiers,
            [ADD_ON_OPTION_ID]: cartItem.addOns.map(
              ({ menuItemId }) => menuItemId,
            ),
          }
        : {},
      addOnServingTemperatureLevels: cartItem
        ? Object.fromEntries(
            cartItem.addOns.map(({ menuItemId, servingTemperatureLevel }) => [
              menuItemId,
              servingTemperatureLevel,
            ]),
          )
        : {},
      addOnSweetnessLevels: cartItem
        ? Object.fromEntries(
            cartItem.addOns.map(({ menuItemId, sweetnessLevel }) => [
              menuItemId,
              sweetnessLevel,
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
    servingTemperatureLevel = null,
    sweetnessLevel = null,
    choices = {},
    addOnServingTemperatureLevels = {},
    addOnSweetnessLevels = {},
    addOnChoices = {},
    rawQuantity = 1,
  ] = useWatch({
    control,
    name: [
      "servingTemperatureLevel",
      "sweetnessLevel",
      "choices",
      "addOnServingTemperatureLevels",
      "addOnSweetnessLevels",
      "addOnChoices",
      "quantity",
    ],
  });

  const addOnItems = useMemo(() => getAddOnItems(menuItem), [menuItem]);

  const selectedAddOnIds = choices[ADD_ON_OPTION_ID] || [];
  const selectedAddOnItems = addOnItems.filter(({ id }) =>
    selectedAddOnIds.includes(id),
  );

  const modifierExtraCost = getGroupsExtraCost(modifierGroups, choices);

  const addOnExtraCost = selectedAddOnItems.reduce(
    (sum, addOnItem) =>
      sum +
      getAddOnPrice(addOnItem) +
      getGroupsExtraCost(
        addOnItem.modifierGroups,
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

  const handleServingTemperatureLevelChange = (next: ServingTemperatureLevel) =>
    setValue("servingTemperatureLevel", next, { shouldValidate: isSubmitted });

  const handleAddOnServingTemperatureLevelChange =
    (addOnId: string) => (next: ServingTemperatureLevel) =>
      setValue(`addOnServingTemperatureLevels.${addOnId}`, next, {
        shouldValidate: isSubmitted,
      });

  const handleSweetnessLevelChange = (next: SweetnessLevel) =>
    setValue("sweetnessLevel", next, { shouldValidate: isSubmitted });

  const handleAddOnSweetnessLevelChange =
    (addOnId: string) => (next: SweetnessLevel) =>
      setValue(`addOnSweetnessLevels.${addOnId}`, next, {
        shouldValidate: isSubmitted,
      });

  const onSubmit = handleSubmit(
    ({ servingTemperatureLevel, sweetnessLevel, choices, addOnChoices }) => {
      if (quantity <= 0) return;

      const modifiers = Object.fromEntries(
        Object.entries(choices).filter(([key]) => key !== ADD_ON_OPTION_ID),
      );
      const addOns = selectedAddOnItems.map((addOnItem) => ({
        menuItemId: addOnItem.id,
        modifiers: addOnChoices[addOnItem.id] || {},
        servingTemperatureLevel:
          addOnServingTemperatureLevels[addOnItem.id] || null,
        // 只有可調才存客人所選；固定甜度下單時由後端帶入
        sweetnessLevel:
          addOnItem.sweetness === "Adjustable"
            ? addOnSweetnessLevels[addOnItem.id] || null
            : null,
      }));

      const newItem = {
        addOns,
        menuItemId: id,
        modifiers,
        quantity,
        servingTemperatureLevel,
        sweetnessLevel: sweetness === "Adjustable" ? sweetnessLevel : null,
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
    recommendedLabel: string,
  ) => (
    <Stack direction="row" alignItems="baseline" flexWrap="wrap" gap={1}>
      <WrapTypography variant="body2">{choiceName}</WrapTypography>
      {recommendedLabel && (
        <Typography color="primary" variant="caption">
          {recommendedLabel}
        </Typography>
      )}
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

  const renderServingTemperatureLevelGroup = (
    servingTemperaturesOffered: ServingTemperature[],
    recommendedLevel: ServingTemperatureLevel | null,
    value: ServingTemperatureLevel | null,
    onValueChange: (next: ServingTemperatureLevel) => void,
    error?: { message?: string },
  ) => (
    <RadioButtonsGroup
      error={!!error}
      fullWidth
      helperText={error?.message}
      label={getServingTemperatureLabel(servingTemperaturesOffered)}
      onChange={(event, next) => onValueChange(next as ServingTemperatureLevel)}
      options={getServingTemperatureLevels(servingTemperaturesOffered).map(
        (level) => ({
          control: <Radio size="small" />,
          label: renderChoiceLabel(
            tOrder(`menuItem.servingTemperatureLevels.${level}`),
            0,
            "",
            "",
            level === recommendedLevel ? tOrder("menuItem.recommended") : "",
          ),
          value: level,
        }),
      )}
      required
      value={value || ""}
    />
  );

  const renderSweetnessGroup = (
    sweetnessOffered: Sweetness,
    fixedLevel: SweetnessLevel | null,
    recommendedLevel: SweetnessLevel | null,
    value: SweetnessLevel | null,
    onValueChange: (next: SweetnessLevel) => void,
    error?: { message?: string },
  ) =>
    sweetnessOffered === "Fixed" ? (
      <RadioButtonsGroup
        disabled
        fullWidth
        helperText={tOrder("menuItem.sweetness.fixed")}
        label={tOrder("menuItem.sweetness.label")}
        onChange={undefined}
        options={
          fixedLevel
            ? [
                {
                  control: <Radio size="small" />,
                  label: renderChoiceLabel(
                    tOrder(`menuItem.sweetnessLevels.${fixedLevel}`),
                    0,
                    "",
                    "",
                    "",
                  ),
                  value: fixedLevel,
                },
              ]
            : []
        }
        value={fixedLevel || ""}
      />
    ) : (
      <RadioButtonsGroup
        error={!!error}
        fullWidth
        helperText={error?.message}
        label={tOrder("menuItem.sweetness.label")}
        onChange={(event, next) => onValueChange(next as SweetnessLevel)}
        options={sweetnessLevelValues.map((level) => ({
          control: <Radio size="small" />,
          label: renderChoiceLabel(
            tOrder(`menuItem.sweetnessLevels.${level}`),
            0,
            "",
            "",
            level === recommendedLevel ? tOrder("menuItem.recommended") : "",
          ),
          value: level,
        }))}
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
        renderServingTemperatureLevelGroup(
          servingTemperatures,
          recommendedServingTemperatureLevel || null,
          servingTemperatureLevel,
          handleServingTemperatureLevelChange,
          errors.servingTemperatureLevel,
        )}
      {sweetness !== "NotApplicable" && (
        <>
          {servingTemperatures.length > 0 && (
            <Divider flexItem variant="inset" />
          )}
          {renderSweetnessGroup(
            sweetness,
            fixedSweetnessLevel || null,
            recommendedSweetnessLevel || null,
            sweetnessLevel,
            handleSweetnessLevelChange,
            errors.sweetnessLevel,
          )}
        </>
      )}
      {modifierGroups.map((group, index) => (
        <Fragment key={group.id}>
          {(index > 0 || hasBuiltInChoices) && (
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
      {(hasBuiltInChoices || modifierGroups.length > 0) &&
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
              image,
              modifierGroups,
              name,
              offers,
              servingTemperatures,
              recommendedServingTemperatureLevel:
                addOnRecommendedServingTemperatureLevel,
              sweetness: addOnSweetness,
              fixedSweetnessLevel: addOnFixedSweetnessLevel,
              recommendedSweetnessLevel: addOnRecommendedSweetnessLevel,
            } = addOnItem;
            const addOnHasBuiltInChoices =
              servingTemperatures.length > 0 ||
              addOnSweetness !== "NotApplicable";
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
              (hasUnsatisfiableModifierGroup(modifierGroups, apiMode)
                ? tCommon("soldOut")
                : "") ||
              (outOfStockInCart
                ? tCommon("reachStockLimit", { label: "" })
                : "");

            return {
              children: (addOnHasBuiltInChoices ||
                modifierGroups.length > 0) && (
                <Collapse in={checked} timeout="auto" unmountOnExit>
                  <Stack pl={3} gap={2}>
                    {servingTemperatures.length > 0 &&
                      renderServingTemperatureLevelGroup(
                        servingTemperatures,
                        addOnRecommendedServingTemperatureLevel || null,
                        addOnServingTemperatureLevels[id] || null,
                        handleAddOnServingTemperatureLevelChange(id),
                        errors.addOnServingTemperatureLevels?.[id],
                      )}
                    {addOnSweetness !== "NotApplicable" && (
                      <>
                        {servingTemperatures.length > 0 && (
                          <Divider flexItem variant="inset" />
                        )}
                        {renderSweetnessGroup(
                          addOnSweetness,
                          addOnFixedSweetnessLevel || null,
                          addOnRecommendedSweetnessLevel || null,
                          addOnSweetnessLevels[id] || null,
                          handleAddOnSweetnessLevelChange(id),
                          errors.addOnSweetnessLevels?.[id],
                        )}
                      </>
                    )}
                    {modifierGroups.map((group, index) => (
                      <Fragment key={group.id}>
                        {(index > 0 || addOnHasBuiltInChoices) && (
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
                </Collapse>
              ),
              disabled: !checked && !!unavailableLabel,
              label: (
                <AddOnLabelStack direction="row" alignItems="center" gap={1.5}>
                  <AddOnAvatar
                    alt={name}
                    disabled={!checked && !!unavailableLabel}
                    src={image || undefined}
                    variant="rounded"
                  >
                    <RestaurantMenu color="disabled" />
                  </AddOnAvatar>
                  {renderChoiceLabel(
                    name,
                    getAddOnPrice(addOnItem),
                    unavailableLabel,
                    getAvailableHoursLabel(offers[0]?.availableHours),
                    "",
                  )}
                </AddOnLabelStack>
              ),
              value: id,
            };
          })}
          value={selectedAddOnIds}
        />
      )}
      {(hasBuiltInChoices ||
        modifierGroups.length > 0 ||
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
