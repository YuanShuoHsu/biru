import Image from "next/image";
import { useParams } from "next/navigation";

import SoldOut from "@/components/SoldOut";

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
import { getChoiceLabels, getItemLabel, getItemStock } from "@/utils/menu";

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

interface CartItemRowProps {
  forceXsLayout: boolean;
  item: CartItem;
}

const CartItemRow = ({ forceXsLayout, item }: CartItemRowProps) => {
  const { id, amount, choices, extraCost, imageUrl, price, quantity } = item;

  const { lang } = useParams<LangParam>();

  const dict = useI18n();

  const { deleteItem, getItemTotalQuantity, updateItem } = useCartStore();

  const itemStock = getItemStock(id);
  const itemStockLeft = itemStock === null ? Infinity : itemStock;
  const totalQuantity = getItemTotalQuantity(id);
  const availableToAdd = Math.max(
    0,
    Math.min(MAX_QUANTITY - quantity, itemStockLeft - totalQuantity),
  );

  const itemLabel = getItemLabel(id, lang);
  const choiceLabels = getChoiceLabels(id, choices, lang, dict);

  const canDecrease = quantity > 1;
  const canIncrease = availableToAdd > 0;

  const handleDecrease = () => {
    if (canDecrease) {
      updateItem({
        ...item,
        quantity: -1,
        amount: -(price + extraCost),
      });
    }
  };

  const handleIncrease = () => {
    if (canIncrease) {
      updateItem({
        ...item,
        quantity: 1,
        amount: price + extraCost,
      });
    }
  };

  return (
    <StyledListItem disablePadding>
      <SoldOut item={item} stock={itemStock} />
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
                  alt={itemLabel}
                  draggable={false}
                  fill
                  sizes="(min-width: 808px) 50vw, 100vw"
                  src={imageUrl}
                  style={{ objectFit: "cover" }}
                />
              )}
            </ImageBox>
          </StyledListItemAvatar>
          <StyledListItemText primary={itemLabel} secondary={choiceLabels} />
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
                          canDecrease ? handleDecrease() : deleteItem(item)
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
              <FormHelperText error>
                {MAX_QUANTITY - quantity < itemStockLeft - totalQuantity
                  ? interpolate(dict.common.maxQuantity, {
                      quantity: MAX_QUANTITY,
                    })
                  : dict.common.reachStockLimit}
              </FormHelperText>
            )}
          </StyledFormControl>
        </Grid>
      </Grid>
    </StyledListItem>
  );
};

export default CartItemRow;
