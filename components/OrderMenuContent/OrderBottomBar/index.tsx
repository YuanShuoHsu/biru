"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import useCartHasInvalidItems from "@/hooks/useCartHasInvalidItems";
import useCartTotals from "@/hooks/useCartTotals";
import { useFormatMoney } from "@/hooks/useFormatMoney";

import { usePathname } from "@/i18n/navigation";

import { ShoppingCart } from "@mui/icons-material";
import {
  Badge,
  Button,
  type ButtonProps,
  Chip,
  Container,
  Fade,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/providers/cart-store-provider";

const StyledContainer = styled(Container)(({ theme }) => ({
  position: "sticky",
  bottom: theme.spacing(2),
  display: "flex",
  gap: theme.spacing(2),
  pointerEvents: "none",
  zIndex: theme.zIndex.appBar - 1,
}));

const StyledButton = styled(Button)<ButtonProps>(({ theme, variant }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: theme.spacing(2),
  pointerEvents: "auto",
  ...(variant === "outlined" && {
    flex: 1,
  }),
}));

const StyledStack = styled(Stack)(({ theme }) => ({
  flex: 1,
  alignItems: "center",
  gap: theme.spacing(2),
}));

const StyledTypography = styled(Typography)({
  fontWeight: "bold",
});

const StyledChip = styled(Chip)(({ theme }) => ({
  borderColor: theme.vars.palette.background.paper,
  color: theme.vars.palette.background.paper,
}));

const OrderBottomBar = () => {
  const { cartTotalQuantity, isCartEmpty } = useCartStore((state) => state);

  const { cartCurrency, cartTotalAmount } = useCartTotals();
  const hasInvalidItems = useCartHasInvalidItems();

  const formatMoney = useFormatMoney();

  const pathname = usePathname();

  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const query = search ? `?${search}` : "";
  const cartHref = `${pathname}/cart${query}`;
  const checkoutHref = `${pathname}/checkout${query}`;

  const tOrder = useTranslations("order");

  return (
    <Fade in={!isCartEmpty} unmountOnExit>
      <StyledContainer disableGutters maxWidth="sm">
        <StyledButton href={cartHref} variant="outlined">
          <StyledStack direction="row">
            <Badge badgeContent={cartTotalQuantity} color="secondary">
              <ShoppingCart />
            </Badge>
            <StyledTypography variant="subtitle1">
              {formatMoney(cartTotalAmount, cartCurrency)}
            </StyledTypography>
          </StyledStack>
          <Chip
            color="primary"
            label={tOrder("cart.view")}
            variant="outlined"
          />
        </StyledButton>
        <StyledButton
          disabled={hasInvalidItems}
          href={checkoutHref}
          variant="contained"
        >
          <StyledChip label={tOrder("cart.next")} variant="outlined" />
        </StyledButton>
      </StyledContainer>
    </Fade>
  );
};

export default OrderBottomBar;
