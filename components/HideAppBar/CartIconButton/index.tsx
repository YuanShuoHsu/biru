import CustomizedBadges from "@/components/CustomizedBadges";

import { ShoppingCart } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

import { useI18nStore } from "@/providers/i18n-store-provider";

import { useCartStore } from "@/stores/useCartStore";

import type { DrawerType } from "@/types/drawer";

interface CartIconButtonProps {
  onDrawerToggle: (
    type: DrawerType,
    open: boolean,
  ) => (event: React.MouseEvent | React.KeyboardEvent) => void;
}

const CartIconButton = ({ onDrawerToggle }: CartIconButtonProps) => {
  const { dict } = useI18nStore((state) => state);

  const { cartTotalQuantity } = useCartStore();

  return (
    <Tooltip title={dict.appBar.cart}>
      <IconButton
        aria-label="cart"
        color="inherit"
        onClick={onDrawerToggle("cart", true)}
      >
        <CustomizedBadges badgeContent={cartTotalQuantity}>
          <ShoppingCart />
        </CustomizedBadges>
      </IconButton>
    </Tooltip>
  );
};

export default CartIconButton;
