"use client";

import { useParams, usePathname } from "next/navigation";
import { Suspense, useState } from "react";

import CartAnchorTemporaryDrawer from "@/components/CartAnchorTemporaryDrawer";
import CustomizedDialogs from "@/components/CustomizedDialogs";
import HideAppBar from "@/components/HideAppBar";
import NavTemporaryDrawer from "@/components/NavTemporaryDrawer";
import OrderSearch from "@/components/OrderSearch";
import RouterBreadcrumbs from "@/components/RouterBreadcrumbs";
import ScrollTop from "@/components/ScrollTop";
import ViewToggleButtons from "@/components/ViewToggleButtons";

import { useAuthInitializer } from "@/hooks/useAuthInitializer";

import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, type BoxProps, Fab, Stack, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { DrawerType } from "@/types/drawer";
import type { RouteParams } from "@/types/routeParams";

import { createOrderPaths } from "@/utils/orderPaths";

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  transition: theme.transitions.create("background-color"),
}));

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  useAuthInitializer();

  const [drawerState, setDrawerState] = useState({
    cart: false,
    nav: false,
  });

  const { lang, mode, storeSlug, tableNumber, partySize } =
    useParams<RouteParams>();
  const pathname = usePathname();

  const isHome = pathname === `/${lang}`;

  const { isMenuRoute } = createOrderPaths({
    lang,
    mode,
    storeSlug,
    tableNumber,
    partySize,
    pathname,
  });

  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE === "true";

  const handleDrawerToggle =
    (type: DrawerType, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setDrawerState((prev) => ({ ...prev, [type]: open }));
    };

  return (
    <Box display="flex">
      <HideAppBar onDrawerToggle={handleDrawerToggle} />
      <Suspense>
        <NavTemporaryDrawer
          onDrawerToggle={handleDrawerToggle}
          open={drawerState.nav}
        />
      </Suspense>
      <CartAnchorTemporaryDrawer
        onDrawerToggle={handleDrawerToggle}
        open={drawerState.cart}
      />
      <MainBox
        component="main"
        width="100%"
        minHeight="100dvh"
        display="flex"
        flexDirection="column"
        bgcolor="background.default"
      >
        <Toolbar id="back-to-top-anchor" />
        {isHome ? (
          children
        ) : (
          <Stack padding={2} height="100%" gap={2}>
            {!isMaintenanceMode && (
              <Stack
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
            )}
            {children}
          </Stack>
        )}
      </MainBox>
      <ScrollTop>
        <Fab aria-label="scroll back to top" size="small">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
      <CustomizedDialogs />
    </Box>
  );
};

export default AppLayout;
