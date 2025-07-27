"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import CartItemList from "@/components/CartItemList";

import { useI18n } from "@/context/i18n";

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

import { useCartStore } from "@/stores/useCartStore";

import type { DrawerType } from "@/types/drawer";
import { LangTableNumberParam } from "@/types/locale";

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

  const { isEmpty, totalAmount } = useCartStore();

  const pathname = usePathname();
  const orderPath = `/${lang}/order/${tableNumber}`;
  const checkoutPath = `${orderPath}/checkout`;
  const isCheckoutPage = pathname === checkoutPath;

  const actionDisabled = !isCheckoutPage && isEmpty;
  const actionHref = isCheckoutPage ? orderPath : checkoutPath;
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
            {dict.common.currency} {totalAmount.toLocaleString(lang)}
          </Typography>
        </Stack>
        <Button
          disabled={actionDisabled}
          component={Link}
          fullWidth
          href={actionHref}
          onClick={onDrawerToggle("cart", false)}
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
      onClose={onDrawerToggle("cart", false)}
      open={open}
    >
      {drawerList}
    </Drawer>
  );
};

export default CartAnchorTemporaryDrawer;
