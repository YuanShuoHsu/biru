"use client";

import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  gap: theme.spacing(2),

  [theme.breakpoints.up("sm")]: {
    justifyContent: "flex-end",
  },
}));
