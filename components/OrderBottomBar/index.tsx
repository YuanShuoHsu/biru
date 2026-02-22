"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import {
  Box,
  Button,
  type ButtonProps,
  Chip,
  Fade,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/providers/cart-store-provider";

import type { RouteParams } from "@/types/routeParams";

import { createOrderPaths } from "@/utils/orderPaths";

const StyledBox = styled(Box)({
  pointerEvents: "none",
});

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  paddingInline: theme.spacing(2),
  maxWidth: theme.breakpoints.values.sm,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(2),
  pointerEvents: "auto",
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderColor: theme.vars.palette.background.paper,
  color: theme.vars.palette.background.paper,
}));

const OrderBottomBar = () => {
  const { isCartEmpty, cartTotalAmount, cartTotalQuantity } = useCartStore(
    (state) => state,
  );

  const tCart = useTranslations("cart");
  const tCommon = useTranslations("common");

  const { locale, mode, storeSlug, tableNumber, partySize } =
    useParams<RouteParams>();

  const pathname = usePathname();

  const { checkoutPath } = createOrderPaths({
    locale,
    mode,
    storeSlug,
    tableNumber,
    partySize,
    pathname,
  });

  return (
    <Fade in={!isCartEmpty}>
      <StyledBox
        position="sticky"
        left={0}
        bottom={(theme) => theme.spacing(2)}
        width="100%"
        display="flex"
        justifyContent="center"
        zIndex={(theme) => theme.zIndex.appBar - 1}
      >
        <StyledButton
          component={Link}
          disabled={isCartEmpty}
          fullWidth
          href={checkoutPath}
          size="large"
          variant="contained"
        >
          <Stack flexDirection="row" alignItems="center" gap={1}>
            <Typography component="span" fontWeight="bold" variant="subtitle1">
              {tCart("totalQuantity", {
                quantity: cartTotalQuantity,
              })}
            </Typography>
            <Typography component="span" variant="body2">
              /
            </Typography>
            <Typography component="span" fontWeight="bold" variant="subtitle1">
              {tCommon("currency")} {cartTotalAmount.toLocaleString(locale)}
            </Typography>
          </Stack>
          <StyledChip label={tCart("checkout")} variant="outlined" />
        </StyledButton>
      </StyledBox>
    </Fade>
  );
};

export default OrderBottomBar;
