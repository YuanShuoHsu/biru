import { useI18n } from "@/context/i18n";

import { Delete } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { CartItem, useCartStore } from "@/stores/useCartStore";

import { interpolate } from "@/utils/i18n";

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "inStock",
})<{ inStock: boolean }>(({ inStock, theme }) => ({
  position: "absolute",
  inset: 0,
  backgroundColor: `rgba(${theme.vars.palette.background.paperChannel} / 0.8)`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  opacity: inStock ? 0 : 1,
  transition: theme.transitions.create(["background-color", "opacity"]),
  zIndex: 2,
}));

const StyledDelete = styled(Delete)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
}));

const StyledTypography = styled(Typography)({
  transform: "rotate(-30deg)",
});

interface SoldOutProps {
  item?: CartItem;
  stock: number | null;
}

const SoldOut = ({ item, stock }: SoldOutProps) => {
  const { quantity = 0, price = 0, extraCost = 0 } = item || {};

  const dict = useI18n();

  const { deleteItem, updateItem } = useCartStore();

  const isSoldOut = stock === 0;
  const isOverOrdered = stock !== null && quantity > stock;

  const isUnavailable = isSoldOut || isOverOrdered;

  const message = isSoldOut
    ? dict.cart.soldOut
    : isOverOrdered
      ? interpolate(dict.cart.quantityExceedsStock, { stock })
      : "";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item) return;

    if (isSoldOut) {
      deleteItem(item);
    } else if (isOverOrdered) {
      const diff = stock - quantity;

      updateItem({
        ...item,
        quantity: diff,
        amount: (price + extraCost) * diff,
      });
    }
  };

  return (
    <StyledButton
      color="error"
      inStock={!isUnavailable}
      disabled={!item || !isUnavailable}
      onClick={handleClick}
      onMouseDown={(e) => e.stopPropagation()}
      variant="outlined"
    >
      {item && <StyledDelete fontSize="small" />}
      {message && (
        <StyledTypography color="error" fontWeight="bold" variant="h3">
          {message}
        </StyledTypography>
      )}
    </StyledButton>
  );
};

export default SoldOut;
