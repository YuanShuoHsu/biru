import Image from "next/image";
import { useParams } from "next/navigation";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import { MAX_QUANTITY } from "@/constants/cart";

import { useI18n } from "@/context/i18n";

import { Add, Remove } from "@mui/icons-material";
import {
  Box,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { CartItemChoices, useCartStore } from "@/stores/useCartStore";
import { useDialogStore } from "@/stores/useDialogStore";

import type { LangParam } from "@/types/locale";
import type { Option } from "@/types/menu";

import { interpolate } from "@/utils/i18n";

const ImageBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  aspectRatio: "4/3",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const StyledFormHelperText = styled(FormHelperText)({
  textAlign: "right",
});

type LimitingChoices = { names: string[]; quantity: number };

export interface CardDialogContentImperativeHandle {
  getValues: () => {
    amount: number;
    extraCost: number;
    price: number;
    quantity: number;
    choices: CartItemChoices;
  };
}

interface CardDialogContentProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  options: Option[];
  price: number;
  stock: number | null;
}

const CardDialogContent = forwardRef<
  CardDialogContentImperativeHandle,
  CardDialogContentProps
>(({ id, name, description, imageUrl, options, price, stock }, ref) => {
  const [quantity, setQuantity] = useState(1);

  const { getCartChoiceTotalQuantity, getCartItemTotalQuantity } =
    useCartStore();

  const getChoiceAvailableQuantity = (
    choiceId: string,
    choiceStock: number | null,
  ) => {
    const cartChoiceTotalQuantity = getCartChoiceTotalQuantity(choiceId);
    const choiceStockLeft = choiceStock == null ? Infinity : choiceStock;

    return Math.max(0, choiceStockLeft - cartChoiceTotalQuantity);
  };

  const [choices, setChoices] = useState<CartItemChoices>(() =>
    Object.fromEntries(
      options.map(({ id, choices, multiple, required }) => {
        if (multiple) return [id, []];

        if (required) {
          const firstInStockChoice = choices.find(
            ({ id: choiceId, stock: choiceStock }) => {
              const choiceAvailableQuantity = getChoiceAvailableQuantity(
                choiceId,
                choiceStock,
              );

              return choiceAvailableQuantity > 0;
            },
          );
          return [id, firstInStockChoice?.id];
        }

        return [id, null];
      }),
    ),
  );

  const { lang } = useParams<LangParam>();

  const dict = useI18n();

  const cartItemTotalQuantity = getCartItemTotalQuantity(id);
  const itemStockLeft = stock === null ? Infinity : stock;

  const perItemCapLeft = MAX_QUANTITY - cartItemTotalQuantity;
  const itemStockCapLeft = itemStockLeft - cartItemTotalQuantity;

  let limitingChoices: LimitingChoices = { names: [], quantity: Infinity };

  const optionCapLeft = options.reduce(
    (overallMin, { id: optionId, choices: optionChoices }) => {
      const selected = choices[optionId];
      if (Array.isArray(selected) && !selected.length) return overallMin;

      const selectedIds = Array.isArray(selected) ? selected : [selected];
      const choiceIdSet = new Set(selectedIds);

      const optionAvailableQuantity = optionChoices.reduce(
        (min, { id: choiceId, name: choiceName, stock: choiceStock }) => {
          if (min === 0) return 0;
          if (!choiceIdSet.has(choiceId) || choiceStock === null) return min;

          const choiceAvailableQuantity = getChoiceAvailableQuantity(
            choiceId,
            choiceStock,
          );

          const localizedChoiceName = choiceName[lang];

          if (choiceAvailableQuantity < limitingChoices.quantity) {
            limitingChoices = {
              names: [localizedChoiceName],
              quantity: choiceAvailableQuantity,
            };
          } else if (
            choiceAvailableQuantity === limitingChoices.quantity &&
            !limitingChoices.names.includes(localizedChoiceName)
          ) {
            limitingChoices.names.push(localizedChoiceName);
          }

          return Math.min(min, choiceAvailableQuantity);
        },
        Infinity,
      );

      return Math.min(overallMin, optionAvailableQuantity);
    },
    Infinity,
  );

  const limitingChoicesLabel =
    limitingChoices.names.length > 0
      ? limitingChoices.names.join(dict.common.delimiter)
      : "";

  const minCap = Math.min(perItemCapLeft, itemStockCapLeft, optionCapLeft);
  const availableToAdd = Math.max(0, minCap);
  const minQuantity = availableToAdd > 0 ? 1 : 0;

  const { setDialog } = useDialogStore();

  useEffect(() => {
    setDialog({ confirmDisabled: quantity <= 0 });
  }, [quantity, setDialog]);

  useEffect(() => {
    setQuantity((prev) => {
      if (prev > availableToAdd) return availableToAdd;
      if (prev < minQuantity) return minQuantity;

      return prev;
    });
  }, [availableToAdd, minQuantity]);

  const extraCost = options.reduce(
    (total, { id: optionId, choices: optionChoices }) => {
      const selected = choices[optionId];
      if (Array.isArray(selected) && !selected.length) return total;

      const selectedIds = Array.isArray(selected) ? selected : [selected];
      const choiceIdSet = new Set(selectedIds);

      const cost = optionChoices.reduce(
        (sum, { id: choiceId, extraCost }) =>
          choiceIdSet.has(choiceId) ? sum + extraCost : sum,
        0,
      );

      return total + cost;
    },
    0,
  );

  const amount = (price + extraCost) * quantity;
  const displayPrice = amount.toLocaleString(lang);

  useImperativeHandle(
    ref,
    () => ({
      getValues: () => ({
        amount,
        extraCost,
        price,
        quantity,
        choices,
      }),
    }),
    [amount, extraCost, price, quantity, choices],
  );

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, minQuantity));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, availableToAdd));
  };

  return (
    <Stack direction="column" gap={2}>
      <ImageBox>
        {imageUrl && (
          <Image
            alt={name}
            draggable={false}
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            src={imageUrl}
            style={{ objectFit: "cover" }}
          />
        )}
      </ImageBox>
      {description && (
        <Typography color="text.secondary" variant="body2">
          {description}
        </Typography>
      )}
      {options.map(
        ({
          id: optionId,
          name: optionName,
          choices: optionChoices,
          multiple,
        }) => {
          const filteredOptionChoices = optionChoices.filter(
            ({ isActive }) => isActive,
          );
          if (filteredOptionChoices.length === 0) return null;

          const selected = choices[optionId];
          const choiceIdSet = Array.isArray(selected)
            ? new Set(selected)
            : null;

          return (
            <StyledFormControl key={optionId}>
              <FormLabel>{optionName[lang]}</FormLabel>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {filteredOptionChoices.map(
                  ({
                    id: choiceId,
                    name: choiceName,
                    extraCost,
                    stock: choiceStock,
                  }) => {
                    const choiceAvailableQuantity = getChoiceAvailableQuantity(
                      choiceId,
                      choiceStock,
                    );
                    const isChoiceOutOfStock = choiceAvailableQuantity === 0;

                    const isSelected = choiceIdSet
                      ? choiceIdSet.has(choiceId)
                      : selected === choiceId;

                    const handleClick = () => {
                      if (isChoiceOutOfStock) return;

                      setChoices((prev) => {
                        const current = prev[optionId];

                        if (multiple) {
                          const currentArray = Array.isArray(current)
                            ? current
                            : [];
                          const next = currentArray.includes(choiceId)
                            ? currentArray.filter((id) => id !== choiceId)
                            : [...currentArray, choiceId];

                          return { ...prev, [optionId]: next };
                        }

                        return { ...prev, [optionId]: choiceId };
                      });
                    };

                    return (
                      <Chip
                        clickable
                        color={
                          !isChoiceOutOfStock && isSelected
                            ? "primary"
                            : "default"
                        }
                        disabled={isChoiceOutOfStock}
                        key={choiceId}
                        label={
                          <Stack
                            flexDirection="row"
                            alignItems="center"
                            gap={1}
                          >
                            <Typography component="span" variant="body2">
                              {choiceName[lang]}
                            </Typography>
                            {extraCost > 0 && (
                              <>
                                <Typography component="span" variant="body2">
                                  /
                                </Typography>
                                <Typography component="span" variant="caption">
                                  {dict.common.currency} {extraCost}
                                </Typography>
                              </>
                            )}
                          </Stack>
                        }
                        onClick={handleClick}
                      />
                    );
                  },
                )}
              </Stack>
            </StyledFormControl>
          );
        },
      )}
      <Divider variant="inset" />
      <Grid container display="flex" alignItems="center" spacing={2}>
        <Grid size={{ xs: 5 }}>
          <Typography
            color="primary"
            component="span"
            fontWeight="bold"
            variant="h6"
          >
            {dict.common.currency} {displayPrice}
          </Typography>
        </Grid>
        <Grid size={{ xs: 7 }}>
          <StyledFormControl>
            <TextField
              disabled={!quantity}
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="decrease"
                        disabled={quantity <= minQuantity}
                        onClick={handleDecreaseQuantity}
                        size="small"
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="increase"
                        disabled={quantity >= availableToAdd}
                        onClick={handleIncreaseQuantity}
                        size="small"
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  readOnly: true,
                  sx: {
                    paddingInline: 1,
                  },
                },
                htmlInput: {
                  sx: { textAlign: "center" },
                },
              }}
              value={quantity}
            />
            {quantity >= availableToAdd && (
              <StyledFormHelperText error>
                {availableToAdd <= 0
                  ? dict.common.reachStockLimit
                  : perItemCapLeft === minCap
                    ? interpolate(dict.common.maxQuantity, {
                        quantity: MAX_QUANTITY,
                      })
                    : interpolate(dict.dialog.maxStock, {
                        label: limitingChoicesLabel,
                        quantity: availableToAdd,
                      })}
              </StyledFormHelperText>
            )}
          </StyledFormControl>
        </Grid>
      </Grid>
    </Stack>
  );
});

CardDialogContent.displayName = "CardDialogContent";

export default CardDialogContent;
