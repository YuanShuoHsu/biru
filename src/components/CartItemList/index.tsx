import Image from "next/image";
import { useParams } from "next/navigation";
import { Fragment } from "react";

import { MAX_QUANTITY } from "@/constants/cart";

import { useI18n } from "@/context/i18n";

import { Add, Delete, Remove } from "@mui/icons-material";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  NoSsr,
  TextField,
  Typography,
  TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore, type CartItem } from "@/stores/useCartStore";

import type { LangParam } from "@/types/locale";

import { getItemKey } from "@/utils/itemKey";
import { getChoiceLabels, getItemName } from "@/utils/menu";

const StyledList = styled(List)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const StyledTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  transition: theme.transitions.create("color"),
}));

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

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  margin: 0,
  wordBreak: "break-word",
  whiteSpace: "pre-line",

  "& .MuiTypography-root": {
    transition: theme.transitions.create("color"),
  },
}));

const StyledInputAdornment = styled(InputAdornment)({
  margin: 0,
});

interface CartItemListProps {
  forceXsLayout?: boolean;
}

const CartItemList = ({ forceXsLayout = false }: CartItemListProps) => {
  const { lang } = useParams<LangParam>();

  const dict = useI18n();

  const { isEmpty, itemsList, deleteItem, updateItem } = useCartStore();

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
    <StyledList disablePadding>
      <NoSsr
        defer
        fallback={<StyledTypography>{dict.common.loading}</StyledTypography>}
      >
        {isEmpty ? (
          <StyledTypography variant="body1">
            {dict.common.empty}
          </StyledTypography>
        ) : (
          itemsList.map((item, index) => {
            const { id, amount, choices, imageUrl, quantity } = item;

            const name = getItemName(id, lang);
            const choiceLabels = getChoiceLabels(id, lang, choices, dict);

            return (
              <Fragment key={getItemKey(id, choices)}>
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
                      <StyledListItemText
                        primary={name}
                        secondary={choiceLabels}
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 5,
                        ...(forceXsLayout ? {} : { sm: 2 }),
                      }}
                    >
                      <StyledTypography
                        color="primary"
                        component="span"
                        fontWeight="bold"
                        variant="body2"
                      >
                        {dict.common.currency} {amount.toLocaleString(lang)}
                      </StyledTypography>
                    </Grid>
                    <Grid
                      size={{
                        xs: 7,
                        ...(forceXsLayout ? {} : { sm: 4 }),
                      }}
                      textAlign="right"
                    >
                      <TextField
                        disabled={!quantity}
                        fullWidth
                        size="small"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <StyledInputAdornment position="start">
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
                              </StyledInputAdornment>
                            ),
                            endAdornment: (
                              <StyledInputAdornment position="end">
                                <IconButton
                                  aria-label="increase"
                                  disabled={quantity >= MAX_QUANTITY}
                                  onClick={() => handleIncrease(item)}
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
                    </Grid>
                  </Grid>
                </StyledListItem>
                {index < itemsList.length - 1 && (
                  <Divider component="li" variant="inset" />
                )}
              </Fragment>
            );
          })
        )}
      </NoSsr>
    </StyledList>
  );
};

export default CartItemList;
