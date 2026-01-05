import CustomizedBadges from "@/components/CustomizedBadges";

import { ShoppingCart } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

import { useDrawerStore } from "@/providers/drawer-store-provider";
import { useI18nStore } from "@/providers/i18n-store-provider";

import { useCartStore } from "@/stores/useCartStore";

import { handleDrawerToggle } from "@/utils/drawer";

const CartIconButton = () => {
  const { cartTotalQuantity } = useCartStore();

  const { setDrawerOpen } = useDrawerStore((state) => state);
  const handleCartOpen = handleDrawerToggle(setDrawerOpen, "cart", true);

  const { dict } = useI18nStore((state) => state);

  return (
    <Tooltip title={dict.appBar.cart}>
      <IconButton aria-label="cart" color="inherit" onClick={handleCartOpen}>
        <CustomizedBadges badgeContent={cartTotalQuantity}>
          <ShoppingCart />
        </CustomizedBadges>
      </IconButton>
    </Tooltip>
  );
};

export default CartIconButton;
