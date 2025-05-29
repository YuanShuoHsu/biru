"use client";

import { useEffect } from "react";

import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";

import { useOrderSearchStore } from "@/stores/useOrderSearchStore";

const OrderSearch = () => {
  const { orderSearchText, setOrderSearchText } = useOrderSearchStore();

  useEffect(() => {
    setOrderSearchText("");
  }, [setOrderSearchText]);

  return (
    <TextField
      onChange={(e) => setOrderSearchText(e.target.value)}
      placeholder="搜尋菜單"
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
