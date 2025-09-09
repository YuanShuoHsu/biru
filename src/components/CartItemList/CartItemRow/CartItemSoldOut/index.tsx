import { useI18n } from "@/context/i18n";

import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { CartItem } from "@/stores/useCartStore";

import { interpolate } from "@/utils/i18n";
import { getTypographyVariant } from "@/utils/soldOut";

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

interface CartItemSoldOutProps {
  availableToAdd: number;
  perItemCapLeft: number;
  itemStockCapLeft: number;
  optionCapLeft: number;
  itemStockLeft: number;
  limitingChoicesLabel: string;
  item: CartItem;
}

const CartItemSoldOut = ({
  availableToAdd,
  // item,
  itemStockCapLeft,
  itemStockLeft,
  limitingChoicesLabel,
  optionCapLeft,
  // perItemCapLeft,
}: CartItemSoldOutProps) => {
  // const { id, choices, extraCost, price, quantity } = item;

  const dict = useI18n();

  // const { deleteCartItem, updateCartItem } = useCartStore();
  // const isOutOfStock = 0;

  const message =
    itemStockLeft === 0
      ? interpolate(dict.common.soldOut, {
          label: "",
        })
      : optionCapLeft === 0
        ? interpolate(dict.common.soldOut, {
            label: `${limitingChoicesLabel}\n`,
          })
        : itemStockCapLeft === availableToAdd
          ? interpolate(dict.cart.quantityExceedsStock, {
              label: "",
              stock: itemStockLeft,
            })
          : optionCapLeft === availableToAdd
            ? interpolate(dict.cart.quantityExceedsStock, {
                label: limitingChoicesLabel,
                stock: itemStockLeft,
              })
            : "";

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    // if (shouldDeleteItem) {
    //   deleteCartItem(item);
    //   return;
    // }

    // if (isItemOverOrdered) {
    //   const diff = itemStockLeft - quantity;

    //   updateCartItem({
    //     ...item,
    //     quantity: diff,
    //     amount: (price + extraCost) * diff,
    //   });
    // }
  };

  return (
    <StyledButton
      aria-label={message}
      color="error"
      disabled={true}
      inStock={true}
      onClick={handleClick}
      variant="outlined"
    >
      <StyledBox>
        {/* {shouldDeleteItem ? (
          <Delete fontSize="small" />
        ) : (
          <Edit fontSize="small" />
        )} */}
      </StyledBox>
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

export default CartItemSoldOut;
