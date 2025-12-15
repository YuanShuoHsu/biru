import { useI18n } from "@/context/i18n";

import { Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { interpolate } from "@/utils/i18n";
import { getTypographyVariant } from "@/utils/soldOut";

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "inStock",
})<{ inStock: boolean }>(({ inStock, theme }) => ({
  position: "absolute",
  inset: 0,
  backgroundColor: `rgba(${theme.vars.palette.background.paperChannel} / 0.8)`,
  borderRadius: theme.shape.borderRadius,
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

const StyledTypography = styled(Typography)({
  whiteSpace: "pre-line",
  wordBreak: "break-word",
  transform: "rotate(-30deg)",
});

interface ItemSoldOutProps {
  isItemOutOfStock: boolean;
}

const ItemSoldOut = ({ isItemOutOfStock }: ItemSoldOutProps) => {
  const dict = useI18n();

  const message = isItemOutOfStock
    ? interpolate(dict.common.soldOut, {
        label: "",
      })
    : "";

  const handleClick = (event: React.MouseEvent) => event.stopPropagation();

  return (
    <StyledButton
      aria-label={message}
      color="error"
      disabled={!isItemOutOfStock}
      inStock={!isItemOutOfStock}
      onClick={handleClick}
      variant="outlined"
    >
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

export default ItemSoldOut;
