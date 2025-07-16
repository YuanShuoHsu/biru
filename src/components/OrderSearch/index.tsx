"use client";

import { useEffect } from "react";

import { useI18n } from "@/context/i18n";

import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";

import { useOrderSearchStore } from "@/stores/useOrderSearchStore";

const OrderSearch = () => {
  const dict = useI18n();

  const { orderSearchText, setOrderSearchText } = useOrderSearchStore();

  useEffect(() => {
    return () => setOrderSearchText("");
  }, [setOrderSearchText]);

  return (
    <TextField
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
