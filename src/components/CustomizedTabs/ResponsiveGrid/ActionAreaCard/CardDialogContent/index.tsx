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
  stock: number | null;
}

const CardDialogContent = forwardRef<
  CardDialogContentImperativeHandle,
  CardDialogContentProps
>(({ id, name, description, imageUrl, options, price, stock }, ref) => {
  const [quantity, setQuantity] = useState(1);
  const [choices, setChoices] = useState<CartItemChoices>(() =>
    Object.fromEntries(
      options.map(({ name, choices, multiple, required }) => {
        if (multiple) return [name, []];

        if (required) {
          const firstAvailable = choices.find(({ available }) => available);
          return [name, firstAvailable?.value];
        }

        return [name, null];
      }),
    ),
  );

  const { lang } = useParams<LangParam>();

  const dict = useI18n();

  const { getItemSelectedQuantity, getItemTotalQuantity } = useCartStore();
  const selectedQuantity = getItemSelectedQuantity(id, choices);
  const totalQuantity = getItemTotalQuantity(id);
  const stockLeft = stock === null ? Infinity : stock;
  const availableToAdd = Math.max(
    0,
    Math.min(MAX_QUANTITY - selectedQuantity, stockLeft - totalQuantity),
  );
  const minQuantity = availableToAdd > 0 ? 1 : 0;

  useEffect(() => {
    setQuantity((prev) => {
      if (prev > availableToAdd) return availableToAdd;
      if (prev < minQuantity) return minQuantity;

      return prev;
    });
  }, [availableToAdd, minQuantity]);

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
        ({ name, label: optionLabel, choices: optionChoices, multiple }) => (
          <StyledFormControl key={name}>
            <FormLabel>{optionLabel[lang]}</FormLabel>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {optionChoices.map(
                ({ label: choiceLabel, value, extraCost, available }) => {
                  const selected = choices[name];
                  const isSelected = multiple
                    ? Array.isArray(selected) && selected.includes(value)
                    : selected === value;

                  const handleClick = () => {
                    setChoices((prev) => {
                      const current = prev[name];

                      if (multiple) {
                        const currentArr = Array.isArray(current)
                          ? current
                          : [];
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
                      color={available && isSelected ? "primary" : "default"}
                      disabled={!available}
                      key={value}
                      label={
                        <Stack flexDirection="row" alignItems="center" gap={1}>
                          <Typography component="span" variant="body2">
                            {choiceLabel[lang]}
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
        ),
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
              <FormHelperText error>
                {stock === null ||
                MAX_QUANTITY - selectedQuantity < stockLeft - totalQuantity
                  ? interpolate(dict.common.maxQuantity, {
                      quantity: MAX_QUANTITY,
                    })
                  : availableToAdd > 0
                    ? interpolate(dict.dialog.maxStock, {
                        quantity: availableToAdd,
                      })
                    : dict.common.reachStockLimit}
              </FormHelperText>
            )}
          </StyledFormControl>
        </Grid>
      </Grid>
    </Stack>
  );
});

CardDialogContent.displayName = "CardDialogContent";

export default CardDialogContent;
