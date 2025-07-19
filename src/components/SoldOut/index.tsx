import { useI18n } from "@/context/i18n";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const SoldOutBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "inStock",
})<{ inStock: boolean }>(({ inStock, theme }) => ({
  position: "absolute",
  inset: 0,
  backgroundColor: `rgba(${theme.vars.palette.background.paperChannel} / 0.5)`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  opacity: inStock ? 0 : 1,
  pointerEvents: inStock ? "none" : "auto",
  transition: theme.transitions.create(["background-color", "opacity"]),
  zIndex: 2,
}));

const SoldOutTypography = styled(Typography)({
  transform: "rotate(-30deg)",
});

interface SoldOutProps {
  inStock: boolean;
}

const SoldOut = ({ inStock }: SoldOutProps) => {
  const dict = useI18n();

  return (
    <SoldOutBox
      inStock={inStock}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <SoldOutTypography color="error" fontWeight="bold" variant="h2">
        {dict.dialog.soldOut}
      </SoldOutTypography>
    </SoldOutBox>
  );
};

export default SoldOut;
