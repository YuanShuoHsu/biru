import { useI18n } from "@/context/i18n";

import { Box, Button, Fade, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/stores/useCartStore";

const StyledBox = styled(Box)({
  pointerEvents: "none",
});

const StyledButton = styled(Button)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.sm,
  pointerEvents: "auto",
}));

const OrderBottomBar = () => {
  const dict = useI18n();

  const { isEmpty, totalAmount, totalQuantity } = useCartStore();

  return (
    <StyledBox
      position="fixed"
      padding={2}
      left={0}
      bottom={(theme) => theme.spacing(7)}
      width="100%"
      zIndex={(theme) => theme.zIndex.appBar - 1}
      display="flex"
      justifyContent="center"
    >
      <Fade in={!isEmpty}>
        <StyledButton fullWidth disabled={isEmpty} variant="contained">
          <Stack flexDirection="row" alignItems="center" gap={2}>
            <Typography variant="body2">{totalQuantity}</Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {dict.common.currency} {totalAmount.toLocaleString()}
            </Typography>
          </Stack>
        </StyledButton>
      </Fade>
    </StyledBox>
  );
};

export default OrderBottomBar;
