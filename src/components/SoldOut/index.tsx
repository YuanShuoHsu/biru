import { useI18n } from "@/context/i18n";

import { Delete } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

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
  inStock: boolean;
  onDelete?: () => void;
}

const SoldOut = ({ inStock, onDelete }: SoldOutProps) => {
  const dict = useI18n();

  return (
    <StyledButton
      color="error"
      inStock={inStock}
      disabled={inStock || !onDelete}
      onClick={(e) => {
        e.stopPropagation();
        onDelete?.();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      variant="outlined"
    >
      {onDelete && <StyledDelete fontSize="small" />}
      <StyledTypography color="error" fontWeight="bold" variant="h2">
        {dict.dialog.soldOut}
      </StyledTypography>
    </StyledButton>
  );
};

export default SoldOut;
