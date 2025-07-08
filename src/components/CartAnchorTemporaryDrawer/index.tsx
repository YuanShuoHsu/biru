"use client";

import { useParams } from "next/navigation";

import CartItemList from "@/components/CartItemList";

import { useI18n } from "@/context/i18n";

import {
  Box,
  Button,
  Drawer,
  Link,
  List,
  Stack,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/stores/useCartStore";

import type { DrawerType } from "@/types/drawer";
import { LangTableNumberParam } from "@/types/locale";

import { getItemKey } from "@/utils/itemKey";

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
  const { lang, tableNumber } = useParams<LangTableNumberParam>();

  const dict = useI18n();

  const { isEmpty, itemsList, totalAmount } = useCartStore();

  const drawerList = (
    <DrawerBox role="presentation">
      <StickyHeader>
        <Toolbar>
          <Typography variant="h6">{dict.cart.title}</Typography>
        </Toolbar>
      </StickyHeader>
      <StyledList disablePadding>
        {isEmpty ? (
          <Typography variant="body1">{dict.common.empty}</Typography>
        ) : (
          itemsList.map((item, index) => {
            const { id, choices } = item;

            return (
              <CartItemList
                dict={dict}
                forceXsLayout
                item={item}
                key={getItemKey(id, choices)}
                lang={lang}
                showDivider={index < itemsList.length - 1}
              />
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
