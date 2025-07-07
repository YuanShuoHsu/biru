"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { MAX_QUANTITY } from "@/constants/cart";

import { useI18n } from "@/context/i18n";

import { Add, Delete, Remove } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { CartItem, useCartStore } from "@/stores/useCartStore";

import type { DrawerType } from "@/types/drawer";
import { LocaleCode } from "@/types/locale";

import { getItemKey } from "@/utils/itemKey";
import { getChoiceLabels, getItemName } from "@/utils/menu";

const DrawerBox = styled(Box)({
  width: 250,
});

const stickyBaseStyles = (theme: Theme) => ({
  position: "sticky" as const,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1,
});

const StickyHeader = styled(Box)(({ theme }) => ({
  ...stickyBaseStyles(theme),
  top: 0,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StickyFooter = styled(Box)(({ theme }) => ({
  ...stickyBaseStyles(theme),
  bottom: 0,
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const StyledList = styled(List)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
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

const StyledListItemText = styled(ListItemText)({
  margin: 0,
  whiteSpace: "pre-line",
});

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

interface CartAnchorTemporaryDrawerProps {
  onDrawerToggle: (
    type: DrawerType,
    open: boolean,
  ) => (event: React.MouseEvent | React.KeyboardEvent) => void;
  open: boolean;
}

const CartAnchorTemporaryDrawer = ({
  onDrawerToggle,
  open,
}: CartAnchorTemporaryDrawerProps) => {
  const { isEmpty, updateItem, itemsList, deleteItem, totalAmount } =
    useCartStore();

  const { lang, tableNumber } = useParams() as {
    lang: LocaleCode;
    tableNumber: string;
  };

  const dict = useI18n();

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

  const drawerList = (
    <DrawerBox role="presentation">
      <StickyHeader>
        <Toolbar>
          <Typography variant="h6">{dict.cart.title}</Typography>
        </Toolbar>
      </StickyHeader>
      <StyledList disablePadding>
        {isEmpty ? (
          <Typography variant="body1">{dict.cart.empty}</Typography>
        ) : (
          itemsList.map((item, index) => {
            const { id, amount, choices, imageUrl, quantity } = item;

            const name = getItemName(id, lang);
            const choiceLabels = getChoiceLabels(id, lang, choices, dict);

            return (
              <Stack key={getItemKey(id, choices)} gap={2}>
                <StyledListItem alignItems="flex-start" disablePadding>
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
                  <Box>
                    <StyledListItemText
                      primary={name}
                      secondary={choiceLabels}
                    />
                    <Typography
                      color="primary"
                      fontWeight="bold"
                      variant="body2"
                    >
                      {dict.common.currency} {amount.toLocaleString(lang)}
                    </Typography>
                  </Box>
                </StyledListItem>
                <StyledFormControl>
                  <Stack direction="row" alignItems="center" gap={1}>
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
                    <TextField
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
                      disabled={quantity >= MAX_QUANTITY}
                      onClick={() => handleIncrease(item)}
                      size="small"
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </Stack>
                </StyledFormControl>
                {index < itemsList.length - 1 && (
                  <Divider component="li" variant="inset" />
                )}
              </Stack>
            );
          })
        )}
      </StyledList>
      <StickyFooter>
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography component="span" variant="subtitle1">
            {dict.common.totalAmount}
          </Typography>
          <Typography
            color="primary"
            component="span"
            fontWeight="bold"
            variant="h6"
          >
            {dict.common.currency} {totalAmount.toLocaleString(lang)}
          </Typography>
        </Stack>
        <Button
          disabled={isEmpty}
          component={Link}
          fullWidth
          href={`/${lang}/order/${tableNumber}/checkout`}
          onClick={onDrawerToggle("cart", false)}
          variant="contained"
        >
          {dict.cart.checkout}
        </Button>
      </StickyFooter>
    </DrawerBox>
  );

  return (
    <Drawer
      anchor="right"
      ModalProps={{ keepMounted: true }}
      onClose={onDrawerToggle("cart", false)}
      open={open}
    >
      {drawerList}
    </Drawer>
  );
};

export default CartAnchorTemporaryDrawer;
