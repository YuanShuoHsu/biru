"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import useSWR from "swr";

import CartItemList from "@/components/CartItemList";
import CustomizedAccordions from "@/components/CustomizedAccordions";

import {
  type AccordionProps,
  Box,
  Link as MuiLink,
  Stack,
  Typography,
  type TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { API_ORDER_MODE } from "@/constants/orderMode";

import useCartTotals from "@/hooks/useCartTotals";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import { useRoutes } from "@/hooks/useRoutes";
import { useSession } from "@/hooks/useSession";

import { Link } from "@/i18n/navigation";

import { useCartStore } from "@/providers/cart-store-provider";

import type { ValidateCouponResponse } from "@/types/coupons";
import type { ExpectedPointsDto, ExpectedPointsResponse } from "@/types/orders";
import type { RouteParams } from "@/types/routeParams";

import { sendRequest } from "@/utils/fetcher";

const LabelTypography = styled(Typography)<TypographyProps>({
  flex: 1,
});

const AmountStack = styled(Stack)({
  alignItems: "center",
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
  const { cartItemsList } = useCartStore((state) => state);

  const { mode, organizationSlug } =
    useParams<RouteParams<"mode" | "organizationSlug">>();

  const session = useSession();
  const navItem = useRoutes();

  const formatMoney = useFormatMoney();

  const tCommon = useTranslations("common");
  const tOrder = useTranslations("order");

  const { data } = useSWR<ExpectedPointsResponse>(
    cartItemsList.length
      ? [
          `/api/organizations/${String(organizationSlug)}/orders/expected-points`,
          cartItemsList,
          API_ORDER_MODE[mode],
          coupon?.code,
        ]
      : null,
    ([url, items, mode, discountCode]: [
      string,
      ExpectedPointsDto["items"],
      ExpectedPointsDto["mode"],
      string | undefined,
    ]) =>
      sendRequest<ExpectedPointsResponse, ExpectedPointsDto>()(url, {
        arg: { discountCode, items, mode },
      }),
    { onError: () => {}, shouldRetryOnError: false },
  );
  const expectedPoints = data?.expectedPoints;

  return (
    <CustomizedAccordions
      elevation={0}
      summary={
        <>
          <LabelTypography component="span" variant="subtitle1">
            {tCommon(coupon ? "total" : "subtotal")}
          </LabelTypography>
          <AmountStack>
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
            {!!expectedPoints &&
              (session ? (
                <Typography color="textSecondary" variant="caption">
                  {tOrder("cart.expectedPoints", { points: expectedPoints })}
                </Typography>
              ) : (
                <MuiLink
                  color="textSecondary"
                  component={Link}
                  href={navItem("/auth/sign-in").to ?? "/auth/sign-in"}
                  underline="always"
                  variant="caption"
                >
                  {tOrder("cart.signInForPoints", { points: expectedPoints })}
                </MuiLink>
              ))}
          </AmountStack>
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
