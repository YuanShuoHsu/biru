"use client";

import { useParams, useRouter } from "next/navigation";

import { TABLE_NUMBERS } from "@/constants/tableNumbers";

import { Button, Grid, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)({
  minWidth: 0,
});

const Order = () => {
  const router = useRouter();
  const { lang } = useParams();

  const handleClick = (number: number) =>
    router.push(`/${lang}/order/${number}`);

  return (
    <Stack gap={2}>
      <Typography variant="h6">選擇桌號</Typography>
      <Grid container spacing={2}>
        {Array.from({ length: TABLE_NUMBERS + 1 }, (_, i) => i).map(
          (number) => (
            <Grid key={number} size={{ xs: 4, sm: 3, md: 2, xl: 1 }}>
              <StyledButton
                fullWidth
                onClick={() => handleClick(number)}
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
