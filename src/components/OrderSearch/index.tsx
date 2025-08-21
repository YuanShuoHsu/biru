"use client";

import { useEffect } from "react";

import { useI18n } from "@/context/i18n";

import { Clear, Search } from "@mui/icons-material";
import { IconButton, InputAdornment, styled, TextField } from "@mui/material";

import { useOrderSearchStore } from "@/stores/useOrderSearchStore";

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "visible",
})<{ visible: boolean }>(({ theme, visible }) => ({
  opacity: visible ? 1 : 0,
  pointerEvents: visible ? "auto" : "none",
  transition: theme.transitions.create("opacity"),
}));

const OrderSearch = () => {
  const dict = useI18n();

  const { clearOrderSearchText, orderSearchText, setOrderSearchText } =
    useOrderSearchStore();

  useEffect(() => () => clearOrderSearchText(), [clearOrderSearchText]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setOrderSearchText(event.target.value);

  const handleClick = () => clearOrderSearchText();

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  const handleMouseUp = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  return (
    <TextField
      fullWidth
      onChange={handleChange}
      placeholder={dict.order.store.tableNumber.search.placeholder}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <StyledIconButton
                aria-label="clear search"
                edge="end"
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                size="small"
                visible={!!orderSearchText}
              >
                <Clear fontSize="small" />
              </StyledIconButton>
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
