import { useI18n } from "@/context/i18n";

import { Delete, Edit } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { CartItem, useCartStore } from "@/stores/useCartStore";

import { interpolate } from "@/utils/i18n";

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "inStock",
})<{ inStock: boolean }>(({ inStock, theme }) => ({
  position: "absolute",
  inset: 0,
  backgroundColor: `rgba(${theme.vars.palette.background.paperChannel} / 0.8)`,
  borderRadius: 0,
  opacity: inStock ? 0 : 1,
  zIndex: 2,

  "&:hover": {
    backgroundColor: `rgba(${theme.vars.palette.error.mainChannel} / ${theme.palette.action.hoverOpacity})`,
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
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
    ? dict.common.soldOut
    : isOverOrdered
      ? interpolate(dict.cart.quantityExceedsStock, { stock })
      : "";

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
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
      onMouseDown={(event) => event.stopPropagation()}
      variant="outlined"
    >
      {item && (
        <StyledBox>
          {isSoldOut ? <Delete fontSize="small" /> : <Edit fontSize="small" />}
        </StyledBox>
      )}
      {message && (
        <StyledTypography color="error" fontWeight="bold" variant="h3">
          {message}
        </StyledTypography>
      )}
    </StyledButton>
  );
};

export default SoldOut;
