"use client";

import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import CartAccordion from "@/components/CartAccordion";

import useCartHasInvalidItems from "@/hooks/useCartHasInvalidItems";

import { useRouter } from "@/i18n/navigation";

import { MenuBook, ShoppingCartCheckout } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/providers/cart-store-provider";

const StyledStack = styled(Stack)({
  justifyContent: "space-between",
});

const OrderModeOrganizationSlugCart = () => {
  const hasInvalidItems = useCartHasInvalidItems();

  const { isCartEmpty } = useCartStore((state) => state);

  const { mode, organizationSlug } = useParams<{
    mode: string;
    organizationSlug: string;
  }>();

  const router = useRouter();

  const [isBackPending, startBackTransition] = useTransition();
  const [isNextPending, startNextTransition] = useTransition();

  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const query = search ? `?${search}` : "";

  const tOrder = useTranslations("order");

  return (
    <>
      <CartAccordion coupon={null} defaultExpanded />
      <StyledStack direction="row">
        <Button
          loading={isBackPending}
          loadingPosition="start"
          onClick={() =>
            startBackTransition(() =>
              router.push(`/order/${mode}/${organizationSlug}${query}`),
            )
          }
          startIcon={<MenuBook />}
          variant="outlined"
        >
          {tOrder("cart.back")}
        </Button>
        <Button
          disabled={isCartEmpty || hasInvalidItems}
          endIcon={<ShoppingCartCheckout />}
          loading={isNextPending}
          loadingPosition="end"
          onClick={() =>
            startNextTransition(() =>
              router.push(
                `/order/${mode}/${organizationSlug}/checkout${query}`,
              ),
            )
          }
          variant="contained"
        >
          {tOrder("cart.next")}
        </Button>
      </StyledStack>
    </>
  );
};

export default OrderModeOrganizationSlugCart;
