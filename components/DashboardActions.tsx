"use client";

import OrderSearch from "@/components/OrderSearch";
import ViewToggleButtons from "@/components/ViewToggleButtons";

import { useOrderPaths } from "@/hooks/useOrderPaths";

import { Stack } from "@mui/material";

const DashboardActions = () => {
  const { isMenuRoute } = useOrderPaths();

  if (!isMenuRoute) return null;

  return (
    <Stack
      width={{ xs: "100%", sm: "auto" }}
      direction="row"
      justifyContent={{ xs: "space-between" }}
      alignItems="center"
      gap={2}
    >
      <OrderSearch />
      <ViewToggleButtons />
    </Stack>
  );
};

export default DashboardActions;
