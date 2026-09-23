import { useTranslations } from "next-intl";
import { Fragment } from "react";

import CartItemRow from "./CartItemRow";

import { Divider, List, NoSsr, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/providers/cart-store-provider";

import { getItemKey } from "@/utils/menus";

const StyledTypography = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
}));

interface CartItemListProps {
  compact?: boolean;
}

const CartItemList = ({ compact = false }: CartItemListProps) => {
  const { isCartEmpty, cartItemsList } = useCartStore((state) => state);

  const tCommon = useTranslations("common");

  const loading = <StyledTypography>{tCommon("loading")}</StyledTypography>;

  return (
    <List disablePadding>
      <NoSsr defer fallback={loading}>
        {isCartEmpty ? (
          <StyledTypography variant="body1">
            {tCommon("empty")}
          </StyledTypography>
        ) : (
          cartItemsList.map((item, index) => (
            <Fragment key={getItemKey(item)}>
              <CartItemRow compact={compact} item={item} />
              {index < cartItemsList.length - 1 && (
                <Divider component="li" variant="inset" />
              )}
            </Fragment>
          ))
        )}
      </NoSsr>
    </List>
  );
};

export default CartItemList;
