import { useTranslations } from "next-intl";

import SoldOutOverlay from "@/components/SoldOutOverlay";

import { Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/providers/cart-store-provider";

import type { CartItem } from "@/stores/cart-store";

const StyledBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  width: theme.spacing(4),
  height: theme.spacing(4),
  backgroundColor: `rgba(${theme.vars.palette.background.paperChannel} / 0.8)`,
  border: `1px solid ${theme.vars.palette.error.main}`,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

interface CartItemSoldOutProps {
  addOnCapLeft: number;
  availableToAdd: number;
  discontinued: boolean;
  item: CartItem;
  itemStockCapLeft: number;
  limitingAddOnsLabel: string;
  unavailableLabel: string;
}

const CartItemSoldOut = ({
  addOnCapLeft,
  availableToAdd,
  discontinued,
  item,
  itemStockCapLeft,
  limitingAddOnsLabel,
  unavailableLabel,
}: CartItemSoldOutProps) => {
  const { quantity } = item;

  const { addCartItem, deleteCartItem } = useCartStore((state) => state);

  const tCommon = useTranslations("common");
  const tOrder = useTranslations("order");

  const targetQuantity = quantity + availableToAdd;
  const shouldDeleteItem =
    !!unavailableLabel || (availableToAdd < 0 && targetQuantity <= 0);
  const shouldEditItem = availableToAdd < 0 && targetQuantity > 0;
  const showOverlay = shouldDeleteItem || shouldEditItem;

  const message = shouldDeleteItem
    ? discontinued
      ? tCommon("discontinued")
      : unavailableLabel || tCommon("soldOut")
    : shouldEditItem
      ? itemStockCapLeft === availableToAdd
        ? tOrder("cart.quantityExceedsStock", {
            label: "",
            stock: targetQuantity,
          })
        : addOnCapLeft === availableToAdd
          ? tOrder("cart.quantityExceedsStock", {
              label: `${limitingAddOnsLabel}\n`,
              stock: targetQuantity,
            })
          : ""
      : "";

  const handleClick = () => {
    if (!showOverlay) return;

    if (shouldDeleteItem) {
      deleteCartItem(item);
      return;
    }

    if (shouldEditItem) {
      addCartItem({ ...item, quantity: availableToAdd });
    }
  };

  return (
    <SoldOutOverlay
      active={showOverlay}
      message={message}
      onClick={handleClick}
      square
    >
      <StyledBox>
        {shouldDeleteItem ? (
          <Delete fontSize="small" />
        ) : (
          <Edit fontSize="small" />
        )}
      </StyledBox>
    </SoldOutOverlay>
  );
};

export default CartItemSoldOut;
