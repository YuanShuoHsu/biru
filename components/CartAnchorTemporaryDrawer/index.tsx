"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import CartItemList from "@/components/CartItemList";

import {
  Box,
  Button,
  Drawer,
  Stack,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/providers/cart-store-provider";
import { useDrawerStore } from "@/providers/drawer-store-provider";
import { useI18nStore } from "@/providers/i18n-store-provider";

import type { RouteParams } from "@/types/routeParams";

import { handleDrawerToggle } from "@/utils/drawer";
import { createOrderPaths } from "@/utils/orderPaths";

const DrawerBox = styled(Box)({
  width: 250,
});

const stickyBaseStyles = (theme: Theme) => ({
  position: "sticky" as const,
  backgroundColor: theme.vars.palette.background.paper,
  zIndex: theme.zIndex.appBar,
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

const CartAnchorTemporaryDrawer = () => {
  const { isCartEmpty, cartTotalAmount } = useCartStore((state) => state);

  const { drawer, setDrawerOpen } = useDrawerStore((state) => state);
  const open = drawer.cart;
  const handleCartClose = handleDrawerToggle(setDrawerOpen, "cart", false);

  const { dict } = useI18nStore((state) => state);

  const { lang, mode, storeSlug, tableNumber, partySize } =
    useParams<RouteParams>();

  const pathname = usePathname();

  const { checkoutPath, menuPath } = createOrderPaths({
    lang,
    mode,
    storeSlug,
    tableNumber,
    partySize,
    pathname,
  });

  const isCheckoutPage = pathname === checkoutPath;

  const actionDisabled = !isCheckoutPage && isCartEmpty;
  const actionHref = isCheckoutPage ? menuPath : checkoutPath;
  const actionLabel = isCheckoutPage
    ? dict.cart.backToOrder
    : dict.cart.checkout;

  const drawerList = (
    <DrawerBox role="presentation">
      <StickyHeader>
        <Toolbar>
          <Typography variant="h6">{dict.cart.title}</Typography>
        </Toolbar>
      </StickyHeader>
      <CartItemList forceXsLayout />
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
            {dict.common.currency} {cartTotalAmount.toLocaleString(lang)}
          </Typography>
        </Stack>
        <Button
          disabled={actionDisabled}
          component={Link}
          fullWidth
          href={actionHref}
          onClick={handleCartClose}
          variant="contained"
        >
          {actionLabel}
        </Button>
      </StickyFooter>
    </DrawerBox>
  );

  return (
    <Drawer
      anchor="right"
      ModalProps={{ keepMounted: true }}
      onClose={handleCartClose}
      open={open}
    >
      {drawerList}
    </Drawer>
  );
};

export default CartAnchorTemporaryDrawer;
