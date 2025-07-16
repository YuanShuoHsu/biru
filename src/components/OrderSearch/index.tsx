"use client";

import { useEffect } from "react";

import { useI18n } from "@/context/i18n";

import { Search } from "@mui/icons-material";
import { InputAdornment, styled, TextField } from "@mui/material";

import { useOrderSearchStore } from "@/stores/useOrderSearchStore";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.vars.palette.background.paper,
    transition: theme.transitions.create(["background-color", "color"]),

    "& .MuiOutlinedInput-notchedOutline": {
      transition: theme.transitions.create("border-color"),
    },

    "& .MuiInputAdornment-root svg": {
      transition: theme.transitions.create("color"),
    },
  },
}));

const OrderSearch = () => {
  const dict = useI18n();

  const { orderSearchText, setOrderSearchText } = useOrderSearchStore();

  useEffect(() => {
    return () => setOrderSearchText("");
  }, [setOrderSearchText]);

  return (
    <StyledTextField
      onChange={(e) => setOrderSearchText(e.target.value)}
      placeholder={dict.order.tableNumber.search.placeholder}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
      size="small"
      value={orderSearchText}
    />
  );
};

export default OrderSearch;
