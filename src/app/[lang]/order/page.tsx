"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { TABLE_NUMBERS } from "@/constants/tableNumbers";

import { useI18n } from "@/context/i18n";

import { Button, ButtonProps, Grid, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)<ButtonProps>({
  minWidth: 0,
});

const Order = () => {
  const { lang } = useParams();

  const dict = useI18n();

  return (
    <Stack gap={2}>
      <Typography variant="h6">{dict.order.selectTable}</Typography>
      <Grid container spacing={2}>
        {Array.from({ length: TABLE_NUMBERS + 1 }, (_, i) => i).map(
          (number) => (
            <Grid key={number} size={{ xs: 4, sm: 3, md: 2, xl: 1 }}>
              <StyledButton
                component={Link}
                fullWidth
                href={`/${lang}/order/${number}`}
                variant="outlined"
              >
                {number}
              </StyledButton>
            </Grid>
          ),
        )}
      </Grid>
    </Stack>
  );
};

export default Order;
