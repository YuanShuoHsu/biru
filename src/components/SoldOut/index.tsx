import { useI18n } from "@/context/i18n";

import { Delete } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const SoldOutBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "inStock",
})<{ inStock: boolean }>(({ inStock, theme }) => ({
  position: "absolute",
  inset: 0,
  backgroundColor: `rgba(${theme.vars.palette.background.paperChannel} / 0.8)`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  opacity: inStock ? 0 : 1,
  pointerEvents: inStock ? "none" : "auto",
  transition: theme.transitions.create(["background-color", "opacity"]),
  zIndex: 2,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  padding: theme.spacing(1),
  minWidth: 0,
  borderRadius: "50%",
}));

const SoldOutTypography = styled(Typography)({
  transform: "rotate(-30deg)",
});

interface SoldOutProps {
  inStock: boolean;
  onDelete?: () => void;
}

const SoldOut = ({ inStock, onDelete }: SoldOutProps) => {
  const dict = useI18n();

  return (
    <SoldOutBox
      inStock={inStock}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {!inStock && onDelete && (
        <StyledButton
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          size="large"
          variant="outlined"
        >
          <Delete fontSize="small" />
        </StyledButton>
      )}
      <SoldOutTypography color="error" fontWeight="bold" variant="h2">
        {dict.dialog.soldOut}
      </SoldOutTypography>
    </SoldOutBox>
  );
};

export default SoldOut;
