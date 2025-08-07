import CustomizedBadges from "@/components/CustomizedBadges";

import { useI18n } from "@/context/i18n";

import { ShoppingCart } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

import { useCartStore } from "@/stores/useCartStore";

import { DrawerType } from "@/types/drawer";

interface CartIconButtonProps {
  onDrawerToggle: (
    type: DrawerType,
    open: boolean,
  ) => (event: React.MouseEvent | React.KeyboardEvent) => void;
}

const CartIconButton = ({ onDrawerToggle }: CartIconButtonProps) => {
  const dict = useI18n();

  const { totalQuantity } = useCartStore();

  return (
    <Tooltip title={dict.appBar.cart}>
      <IconButton
        aria-label="cart"
        color="inherit"
        onClick={onDrawerToggle("cart", true)}
      >
        <CustomizedBadges badgeContent={totalQuantity}>
          <ShoppingCart />
        </CustomizedBadges>
      </IconButton>
    </Tooltip>
  );
};

export default CartIconButton;
