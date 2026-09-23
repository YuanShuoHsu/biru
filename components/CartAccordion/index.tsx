"use client";

import { useTranslations } from "next-intl";

import CartItemList from "@/components/CartItemList";
import CustomizedAccordions from "@/components/CustomizedAccordions";

import {
  type AccordionProps,
  Box,
  Stack,
  Typography,
  type TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import useCartTotals from "@/hooks/useCartTotals";
import { useFormatMoney } from "@/hooks/useFormatMoney";

import type { ValidateCouponResponse } from "@/types/coupons";

const LabelTypography = styled(Typography)<TypographyProps>({
  flex: 1,
});

const StyledStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  gap: theme.spacing(1),
}));

const OriginalPriceTypography = styled(Typography)({
  fontWeight: "bold",
  textDecoration: "line-through",
});

const AmountTypography = styled(Typography)<TypographyProps>({
  fontWeight: "bold",
});

const StyledBox = styled(Box)({
  flex: 1,
});

interface CartAccordionProps extends Omit<AccordionProps, "children"> {
  coupon: ValidateCouponResponse | null;
}

const CartAccordion = ({ coupon, ...props }: CartAccordionProps) => {
  const { cartCurrency, cartTotalAmount } = useCartTotals();

  const formatMoney = useFormatMoney();

  const tCommon = useTranslations("common");

  return (
    <CustomizedAccordions
      elevation={0}
      summary={
        <>
          <LabelTypography component="span" variant="subtitle1">
            {tCommon(coupon ? "total" : "subtotal")}
          </LabelTypography>
          <StyledStack direction="row">
            {coupon && (
              <OriginalPriceTypography color="textDisabled" variant="caption">
                {formatMoney(cartTotalAmount, cartCurrency)}
              </OriginalPriceTypography>
            )}
            <AmountTypography color="primary" component="span" variant="h6">
              {formatMoney(
                coupon ? Number(coupon.total) : cartTotalAmount,
                cartCurrency,
              )}
            </AmountTypography>
          </StyledStack>
          <StyledBox />
        </>
      }
      {...props}
    >
      <CartItemList compact />
    </CustomizedAccordions>
  );
};

export default CartAccordion;
