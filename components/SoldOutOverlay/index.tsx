import { Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { getTypographyVariant } from "@/utils/soldOut";

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "inStock" && prop !== "square",
})<{ inStock: boolean; square: boolean }>(({ inStock, square, theme }) => ({
  position: "absolute",
  inset: 0,
  backgroundColor: `rgba(${theme.vars.palette.background.paperChannel} / 0.8)`,
  borderRadius: square ? 0 : theme.shape.borderRadius,
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
  fontWeight: "bold",
  whiteSpace: "pre-line",
  wordBreak: "break-word",
  transform: "rotate(-30deg)",
});

interface SoldOutOverlayProps {
  active: boolean;
  children?: React.ReactNode;
  message: string;
  onClick?: () => void;
  square?: boolean;
}

const SoldOutOverlay = ({
  active,
  children,
  message,
  onClick,
  square = false,
}: SoldOutOverlayProps) => {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClick?.();
  };

  return (
    <StyledButton
      aria-label={message}
      color="error"
      disabled={!active}
      inStock={!active}
      onClick={handleClick}
      square={square}
      variant="outlined"
    >
      {children}
      {message && (
        <StyledTypography color="error" variant={getTypographyVariant(message)}>
          {message}
        </StyledTypography>
      )}
    </StyledButton>
  );
};

export default SoldOutOverlay;
