import Image from "next/image";

import { MAX_QUANTITY } from "@/constants/cart";

import { I18nDict } from "@/context/i18n";

import { Add, Delete, Remove } from "@mui/icons-material";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore, type CartItem } from "@/stores/useCartStore";

import type { LocaleCode } from "@/types/locale";

import { getChoiceLabels, getItemName } from "@/utils/menu";

const StyledListItem = styled(ListItem)(({ theme }) => ({
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

const StyledListItemText = styled(ListItemText)({
  margin: 0,
  wordBreak: "break-word",
  whiteSpace: "pre-line",
});

interface CartItemListProps {
  dict: I18nDict;
  forceXsLayout?: boolean;
  item: CartItem;
  lang: LocaleCode;
  showDivider: boolean;
}

const CartItemList = ({
  dict,
  forceXsLayout = false,
  item,
  lang,
  showDivider,
}: CartItemListProps) => {
  const { id, amount, choices, imageUrl, quantity } = item;

  const name = getItemName(id, lang);
  const choiceLabels = getChoiceLabels(id, lang, choices, dict);

  const { updateItem, deleteItem } = useCartStore();

  const handleDecrease = (item: CartItem) => {
    if (item.quantity > 1) {
      updateItem({
        ...item,
        quantity: -1,
        amount: -(item.price + item.extraCost),
      });
    }
  };

  const handleIncrease = (item: CartItem) => {
    if (item.quantity < MAX_QUANTITY) {
      updateItem({
        ...item,
        quantity: 1,
        amount: item.price + item.extraCost,
      });
    }
  };

  return (
    <Stack gap={2}>
      <StyledListItem alignItems="flex-start" disablePadding>
        <Grid
          width="100%"
          container
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
                    alt={name}
                    draggable={false}
                    fill
                    sizes="(min-width: 808px) 50vw, 100vw"
                    src={imageUrl}
                    style={{ objectFit: "cover" }}
                  />
                )}
              </ImageBox>
            </StyledListItemAvatar>
            <StyledListItemText primary={name} secondary={choiceLabels} />
          </Grid>
          <Grid
            size={{
              xs: 7,
              ...(forceXsLayout ? {} : { sm: 4 }),
            }}
          >
            <TextField
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      {quantity === 1 ? (
                        <IconButton
                          aria-label="delete"
                          onClick={() => deleteItem(item)}
                          size="small"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      ) : (
                        <IconButton
                          aria-label="decrease"
                          disabled={quantity <= 1}
                          onClick={() => handleDecrease(item)}
                          size="small"
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="increase"
                        disabled={quantity >= MAX_QUANTITY}
                        onClick={() => handleIncrease(item)}
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
          </Grid>
          <Grid
            size={{
              xs: 5,
              ...(forceXsLayout ? {} : { sm: 2 }),
            }}
            textAlign="right"
          >
            <Typography color="primary" fontWeight="bold" variant="body2">
              {dict.common.currency} {amount.toLocaleString(lang)}
            </Typography>
          </Grid>
        </Grid>
      </StyledListItem>
      {showDivider && <Divider component="li" variant="inset" />}
    </Stack>
  );
};

export default CartItemList;
