import { Fragment } from "react";

import CartItemRow from "./CartItemRow";

import { useI18n } from "@/context/i18n";

import { Divider, List, NoSsr, Typography } from "@mui/material";

import { useCartStore } from "@/stores/useCartStore";

import { getItemKey } from "@/utils/menu";

interface CartItemListProps {
  forceXsLayout?: boolean;
}

const CartItemList = ({ forceXsLayout = false }: CartItemListProps) => {
  const dict = useI18n();

  const { isEmpty, itemsList } = useCartStore();

  return (
    <List disablePadding>
      <NoSsr
        defer
        fallback={<Typography padding={2}>{dict.common.loading}</Typography>}
      >
        {isEmpty ? (
          <Typography padding={2} variant="body1">
            {dict.common.empty}
          </Typography>
        ) : (
          itemsList.map((item, index) => {
            const { id, choices } = item;

            return (
              <Fragment key={getItemKey(id, choices)}>
                <CartItemRow forceXsLayout={forceXsLayout} item={item} />
                {index < itemsList.length - 1 && (
                  <Divider component="li" variant="inset" />
                )}
              </Fragment>
            );
          })
        )}
      </NoSsr>
    </List>
  );
};

export default CartItemList;
