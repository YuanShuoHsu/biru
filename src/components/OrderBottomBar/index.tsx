"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useI18n } from "@/context/i18n";

import {
  Box,
  Button,
  ButtonProps,
  Chip,
  Fade,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/stores/useCartStore";

import { interpolate } from "@/utils/i18n";

const StyledBox = styled(Box)({
  pointerEvents: "none",
});

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  paddingInline: theme.spacing(2),
  maxWidth: theme.breakpoints.values.sm,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(2),
  pointerEvents: "auto",
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderColor: theme.vars.palette.background.paper,
  color: theme.vars.palette.background.paper,
}));

const OrderBottomBar = () => {
  const dict = useI18n();

  const { lang, tableNumber } = useParams();

  const { isEmpty, totalAmount, totalQuantity } = useCartStore();

  return (
    <Fade in={!isEmpty}>
      <StyledBox
        position="sticky"
        left={0}
        bottom={(theme) => theme.spacing(2)}
        width="100%"
        display="flex"
        justifyContent="center"
        zIndex={(theme) => theme.zIndex.appBar - 1}
      >
        <StyledButton
          component={Link}
          disabled={isEmpty}
          fullWidth
          href={`/${lang}/order/${tableNumber}/checkout`}
          size="large"
          variant="contained"
        >
          <Stack flexDirection="row" alignItems="center" gap={1}>
            <Typography component="span" fontWeight="bold" variant="subtitle1">
              {interpolate(dict.cart.totalQuantity, {
                quantity: totalQuantity,
              })}
            </Typography>
            <Typography component="span" variant="body2">
              /
            </Typography>
            <Typography component="span" fontWeight="bold" variant="subtitle1">
              {dict.common.currency} {totalAmount.toLocaleString(lang)}
            </Typography>
          </Stack>
          <StyledChip label={dict.cart.checkout} variant="outlined" />
        </StyledButton>
      </StyledBox>
    </Fade>
  );
};

export default OrderBottomBar;
