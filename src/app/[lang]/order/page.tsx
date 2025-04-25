"use client";

import { useState } from "react";

import { Search } from "@mui/icons-material";
import { InputAdornment, Stack, TextField } from "@mui/material";

import CustomizedTabs from "@/components/CustomizedTabs";
import RouterBreadcrumbs from "@/components/RouterBreadcrumbs";

const Order = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <Stack height="100%" direction="column" spacing={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <RouterBreadcrumbs />
        <TextField
          size="small"
          placeholder="搜尋菜單"
          value={searchText}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSearchText(event.target.value)
          }
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>
      <CustomizedTabs searchText={searchText.trim().toLowerCase()} />
    </Stack>
  );
};

export default Order;
