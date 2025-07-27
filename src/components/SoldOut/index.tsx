import { useParams } from "next/navigation";

import { useI18n } from "@/context/i18n";

import { Delete, Edit } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { CartItem, useCartStore } from "@/stores/useCartStore";

import { LangParam } from "@/types/locale";

import { interpolate } from "@/utils/i18n";
import {
  getUnavailableChoicesLabels,
  hasUnavailableChoices,
} from "@/utils/menu";

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "inStock",
})<{ inStock: boolean }>(({ inStock, theme }) => ({
  position: "absolute",
  inset: 0,
  backgroundColor: `rgba(${theme.vars.palette.background.paperChannel} / 0.8)`,
  borderRadius: 0,
  opacity: inStock ? 0 : 1,
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

  const { deleteItem, updateItem } = useCartStore();

  const isSoldOut = stock === 0;
  const isOverOrdered = stock !== null && quantity > stock;
  const isChoiceUnavailable = hasUnavailableChoices(id, choices);

  const shouldDeleteItem = isSoldOut || isChoiceUnavailable;
  const isUnavailable = shouldDeleteItem || isOverOrdered;
  const labels = getUnavailableChoicesLabels(id, choices, lang, dict);

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

  const message = isSoldOut
    ? dict.common.soldOut
    : isChoiceUnavailable
      ? interpolate(dict.cart.choiceUnavailable, {
          label: labels,
        })
      : isOverOrdered
        ? interpolate(dict.cart.quantityExceedsStock, { stock })
        : "";

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!item) return;

    if (shouldDeleteItem) {
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
