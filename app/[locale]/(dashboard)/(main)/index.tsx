"use client";

import OrderSearch from "@/components/OrderSearch";
import RouterBreadcrumbs from "@/components/RouterBreadcrumbs";
import ViewToggleButtons from "@/components/ViewToggleButtons";

import { useOrderPaths } from "@/hooks/useOrderPaths";

import { Stack } from "@mui/material";

const MainDashboardHeader = () => {
  const { isMenuRoute } = useOrderPaths();

  return (
    <Stack
      padding={2}
      height="100%"
      flexWrap={{ xs: "wrap", sm: "nowrap" }}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
    >
      <RouterBreadcrumbs />
      {isMenuRoute && (
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
      )}
    </Stack>
  );
};

export default MainDashboardHeader;
