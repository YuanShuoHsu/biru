import { useParams } from "next/navigation";

import { useI18n } from "@/context/i18n";

import { Delete, Edit } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { CartItem, useCartStore } from "@/stores/useCartStore";

import type { LangParam } from "@/types/locale";

import { interpolate } from "@/utils/i18n";
import { getOutOfStockChoiceNames, hasOutOfStockChoices } from "@/utils/menu";

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "inStock",
})<{ inStock: boolean }>(({ inStock, theme }) => ({
  position: "absolute",
  inset: 0,
  backgroundColor: `rgba(${theme.vars.palette.background.paperChannel} / 0.8)`,
  borderRadius: 0,
  opacity: inStock ? 0 : 1,
  pointerEvents: inStock ? "none" : "auto",
  transition: theme.transitions.create([
    "background-color",
    "border-color",
    "opacity",
  ]),
  zIndex: 2,

  "&:hover": {
    backgroundColor: `rgba(${theme.vars.palette.error.mainChannel} / 0.2)`,
  },
}));

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
  transition: theme.transitions.create("background-color"),
}));

const StyledTypography = styled(Typography)({
  whiteSpace: "pre-line",
  wordBreak: "break-word",
  transform: "rotate(-30deg)",
});

interface SoldOutProps {
  item?: CartItem;
  stock: number | null;
}

const SoldOut = ({ item, stock }: SoldOutProps) => {
  const {
    id = "",
    choices = {},
    quantity = 0,
    price = 0,
    extraCost = 0,
  } = item || {};

  const { lang } = useParams<LangParam>();

  const dict = useI18n();

  const { deleteCartItem, updateCartItem } = useCartStore();

  const isItemOutOfStock = stock === 0;
  const isItemOverOrdered = stock !== null && quantity > stock;
  const isChoiceOutOfStock = hasOutOfStockChoices(id, choices);

  const shouldDeleteItem = isItemOutOfStock || isChoiceOutOfStock;
  const isOutOfStock = shouldDeleteItem || isItemOverOrdered;
  const outOfStockChoiceNames = getOutOfStockChoiceNames(
    id,
    choices,
    lang,
    dict,
  );

  const getTypographyVariant = (
    message: string,
  ): "h3" | "h4" | "h5" | "h6" | "body1" | "body2" => {
    const length = message.length;

    if (length <= 6) return "h3";
    if (length <= 12) return "h4";
    if (length <= 20) return "h5";
    if (length <= 30) return "h6";
    if (length <= 50) return "body1";

    return "body2";
  };

  const message = isItemOutOfStock
    ? dict.common.soldOut
    : isChoiceOutOfStock
      ? interpolate(dict.cart.choiceOutOfStock, {
          label: outOfStockChoiceNames,
        })
      : isItemOverOrdered
        ? interpolate(dict.cart.quantityExceedsStock, { stock })
        : "";

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!item) return;

    if (shouldDeleteItem) {
      deleteCartItem(item);
      return;
    }

    if (isItemOverOrdered) {
      const diff = stock - quantity;

      updateCartItem({
        ...item,
        quantity: diff,
        amount: (price + extraCost) * diff,
      });
    }
  };

  return (
    <StyledButton
      aria-label={message}
      color="error"
      disabled={!item || !isOutOfStock}
      inStock={!isOutOfStock}
      onClick={handleClick}
      variant="outlined"
    >
      {item && (
        <StyledBox>
          {shouldDeleteItem ? (
            <Delete fontSize="small" />
          ) : (
            <Edit fontSize="small" />
          )}
        </StyledBox>
      )}
      {message && (
        <StyledTypography
          color="error"
          fontWeight="bold"
          variant={getTypographyVariant(message)}
        >
          {message}
        </StyledTypography>
      )}
    </StyledButton>
  );
};

export default SoldOut;
