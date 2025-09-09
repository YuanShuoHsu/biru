import Image from "next/image";
import { useParams } from "next/navigation";

import CartItemSoldOut from "./CartItemSoldOut";

import { MAX_QUANTITY } from "@/constants/cart";

import { useI18n } from "@/context/i18n";

import { Add, Delete, Remove } from "@mui/icons-material";
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { CartItem, useCartStore } from "@/stores/useCartStore";

import type { LangParam } from "@/types/locale";

import { interpolate } from "@/utils/i18n";
import {
  getChoiceNames,
  getItemName,
  getItemStock,
  getLimitingChoicesCap,
} from "@/utils/menu";

const StyledListItem = styled(ListItem)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(2),
  display: "flex",
  gap: theme.spacing(2),
}));

const StyledListItemAvatar = styled(ListItemAvatar)({
  margin: 0,
});

const ImageBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 60,
  height: 60,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  margin: 0,
  wordBreak: "break-word",
  whiteSpace: "pre-line",

  "& .MuiTypography-root": {
    transition: theme.transitions.create("color"),
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const StyledInputAdornment = styled(InputAdornment)({
  margin: 0,
});

const StyledFormHelperText = styled(FormHelperText)({
  textAlign: "right",
});

interface CartItemRowProps {
  forceXsLayout: boolean;
  item: CartItem;
}

const CartItemRow = ({ forceXsLayout, item }: CartItemRowProps) => {
  const { id, amount, choices, extraCost, imageUrl, price, quantity } = item;

  const { lang } = useParams<LangParam>();

  const dict = useI18n();

  const itemName = getItemName(id, lang);
  const choiceNames = getChoiceNames(id, choices, lang, dict);

  const { deleteCartItem, getCartItemTotalQuantity, updateCartItem } =
    useCartStore();

  const itemStock = getItemStock(id);
  const itemStockLeft = itemStock === null ? Infinity : itemStock;
  const cartItemTotalQuantity = getCartItemTotalQuantity(id);

  const perItemCapLeft = MAX_QUANTITY - cartItemTotalQuantity;
  const itemStockCapLeft = itemStockLeft - cartItemTotalQuantity;

  const { names: limitingChoiceNames, cap: optionCapLeft } =
    getLimitingChoicesCap(id, choices, lang);

  const limitingChoicesLabel =
    limitingChoiceNames.length > 0
      ? limitingChoiceNames.join(dict.common.delimiter)
      : "";

  const availableToAdd = Math.min(
    perItemCapLeft,
    itemStockCapLeft,
    optionCapLeft,
  );

  const canDecrease = quantity > 1;
  const canIncrease = availableToAdd > 0;

  const handleDecrease = () => {
    if (canDecrease) {
      updateCartItem({
        ...item,
        quantity: -1,
        amount: -(price + extraCost),
      });
    }
  };

  const handleIncrease = () => {
    if (canIncrease) {
      updateCartItem({
        ...item,
        quantity: 1,
        amount: price + extraCost,
      });
    }
  };

  return (
    <StyledListItem disablePadding>
      <CartItemSoldOut
        availableToAdd={availableToAdd}
        item={item}
        itemStockCapLeft={itemStockCapLeft}
        itemStockLeft={itemStockLeft}
        limitingChoicesLabel={limitingChoicesLabel}
        optionCapLeft={optionCapLeft}
        perItemCapLeft={perItemCapLeft}
      />
      <Grid
        container
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Grid
          size={{
            xs: 12,
            ...(forceXsLayout ? {} : { sm: 6 }),
          }}
          display="flex"
          gap={2}
        >
          <StyledListItemAvatar>
            <ImageBox>
              {imageUrl && (
                <Image
                  alt={itemName}
                  draggable={false}
                  fill
                  sizes="(min-width: 808px) 50vw, 100vw"
                  src={imageUrl}
                  style={{ objectFit: "cover" }}
                />
              )}
            </ImageBox>
          </StyledListItemAvatar>
          <StyledListItemText primary={itemName} secondary={choiceNames} />
        </Grid>
        <Grid
          size={{
            xs: 5,
            ...(forceXsLayout ? {} : { sm: 2 }),
          }}
        >
          <Typography
            color="primary"
            component="span"
            fontWeight="bold"
            variant="body2"
          >
            {dict.common.currency} {amount.toLocaleString(lang)}
          </Typography>
        </Grid>
        <Grid
          size={{
            xs: 7,
            ...(forceXsLayout ? {} : { sm: 4 }),
          }}
        >
          <StyledFormControl>
            <TextField
              disabled={!quantity}
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <StyledInputAdornment position="start">
                      <IconButton
                        aria-label={canDecrease ? "decrease" : "delete"}
                        onClick={() =>
                          canDecrease ? handleDecrease() : deleteCartItem(item)
                        }
                        size="small"
                      >
                        {canDecrease ? (
                          <Remove fontSize="small" />
                        ) : (
                          <Delete fontSize="small" />
                        )}
                      </IconButton>
                    </StyledInputAdornment>
                  ),
                  endAdornment: (
                    <StyledInputAdornment position="end">
                      <IconButton
                        aria-label="increase"
                        disabled={!canIncrease}
                        onClick={handleIncrease}
                        size="small"
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </StyledInputAdornment>
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
            {availableToAdd <= 0 && (
              <StyledFormHelperText error>
                {perItemCapLeft === availableToAdd
                  ? interpolate(dict.common.maxQuantity, {
                      quantity: MAX_QUANTITY,
                    })
                  : itemStockCapLeft === availableToAdd
                    ? interpolate(dict.common.reachStockLimit, {
                        label: "",
                      })
                    : optionCapLeft === availableToAdd
                      ? interpolate(dict.common.reachStockLimit, {
                          label: limitingChoicesLabel,
                        })
                      : ""}
              </StyledFormHelperText>
            )}
          </StyledFormControl>
        </Grid>
      </Grid>
    </StyledListItem>
  );
};

export default CartItemRow;
