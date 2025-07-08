import Image from "next/image";
import { useParams } from "next/navigation";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import { MAX_QUANTITY } from "@/constants/cart";

import { useI18n } from "@/context/i18n";

import { Add, Remove } from "@mui/icons-material";
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { CartItemChoices, useCartStore } from "@/stores/useCartStore";

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
}

const CardDialogContent = forwardRef<
  CardDialogContentImperativeHandle,
  CardDialogContentProps
>(({ id, name, description, imageUrl, options, price }, ref) => {
  const [quantity, setQuantity] = useState(1);
  const [choices, setChoices] = useState<CartItemChoices>(() =>
    Object.fromEntries(
      options.map(({ name, choices, multiple, required }) => {
        if (multiple) return [name, []];
        if (required) return [name, choices[0].value];

        return [name, null];
      }),
    ),
  );

  const { lang } = useParams<LangParam>();

  const dict = useI18n();

  const { getItemQuantity } = useCartStore();
  const maxQuantity = Math.max(0, MAX_QUANTITY - getItemQuantity(id, choices));
  const minQuantity = maxQuantity === 0 ? 0 : 1;

  useEffect(() => {
    setQuantity((prev) => {
      if (prev < minQuantity) return minQuantity;
      if (prev > maxQuantity) return maxQuantity;

      return prev;
    });
  }, [minQuantity, maxQuantity]);

  const extraCost = options.reduce(
    (total, { name, choices: optionChoices }) => {
      const selected = choices[name];
      const values = Array.isArray(selected)
        ? selected
        : selected
          ? [selected]
          : [];

      const cost = optionChoices
        .filter(({ value }) => values.includes(value))
        .reduce((sum, { extraCost }) => sum + extraCost, 0);

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
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
      {options.map(
        ({ name, label: optionLabel, choices: optionChoices, multiple }) => (
          <StyledFormControl key={name}>
            <FormLabel>{optionLabel[lang]}</FormLabel>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {optionChoices.map(({ label: choiceLabel, value, extraCost }) => {
                const selected = choices[name];
                const isSelected = multiple
                  ? Array.isArray(selected) && selected.includes(value)
                  : selected === value;

                const handleClick = () => {
                  setChoices((prev) => {
                    const current = prev[name];

                    if (multiple) {
                      const currentArr = Array.isArray(current) ? current : [];
                      const next = currentArr.includes(value)
                        ? currentArr.filter((v) => v !== value)
                        : [...currentArr, value];

                      return { ...prev, [name]: next };
                    }

                    return { ...prev, [name]: value };
                  });
                };

                return (
                  <Chip
                    clickable
                    color={isSelected ? "primary" : "default"}
                    key={value}
                    label={
                      <Stack flexDirection="row" alignItems="center" gap={1}>
                        <Typography variant="body2">
                          {choiceLabel[lang]}
                        </Typography>
                        {extraCost > 0 && (
                          <>
                            <Typography variant="body2">/</Typography>
                            <Typography variant="caption">
                              {dict.common.currency} {extraCost}
                            </Typography>
                          </>
                        )}
                      </Stack>
                    }
                    onClick={handleClick}
                  />
                );
              })}
            </Stack>
          </StyledFormControl>
        ),
      )}
      <StyledFormControl>
        <FormLabel htmlFor="quantity-input">{dict.dialog.quantity}</FormLabel>
        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton
            aria-label="decrease"
            disabled={quantity <= minQuantity}
            onClick={() =>
              setQuantity((prev) => Math.max(prev - 1, minQuantity))
            }
            size="small"
          >
            <Remove fontSize="small" />
          </IconButton>
          <TextField
            disabled={!quantity}
            fullWidth
            id="quantity-input"
            size="small"
            slotProps={{
              input: {
                readOnly: true,
              },
              htmlInput: {
                sx: { textAlign: "center" },
              },
            }}
            value={quantity}
          />
          <IconButton
            aria-label="increase"
            disabled={quantity >= maxQuantity}
            onClick={() =>
              setQuantity((prev) => Math.min(prev + 1, maxQuantity))
            }
            size="small"
          >
            <Add fontSize="small" />
          </IconButton>
        </Stack>
        {quantity === maxQuantity && (
          <FormHelperText error>
            {interpolate(dict.dialog.maxQuantity, {
              max: MAX_QUANTITY,
            })}
          </FormHelperText>
        )}
      </StyledFormControl>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        <Typography component="span" variant="subtitle1">
          {dict.dialog.amount}
        </Typography>
        <Typography
          color="primary"
          component="span"
          fontWeight="bold"
          variant="h6"
        >
          {dict.common.currency} {displayPrice}
        </Typography>
      </Stack>
    </Stack>
  );
});

CardDialogContent.displayName = "CardDialogContent";

export default CardDialogContent;
