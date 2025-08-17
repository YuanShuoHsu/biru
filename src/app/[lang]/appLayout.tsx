"use client";

import { useParams, usePathname } from "next/navigation";
import { useState } from "react";

import CartAnchorTemporaryDrawer from "@/components/CartAnchorTemporaryDrawer";
import CustomizedDialogs from "@/components/CustomizedDialogs";
import HideAppBar from "@/components/HideAppBar";
import NavTemporaryDrawer from "@/components/NavTemporaryDrawer";
import OrderSearch from "@/components/OrderSearch";
import RouterBreadcrumbs from "@/components/RouterBreadcrumbs";
import ScrollTop from "@/components/ScrollTop";
import ViewToggleButtons from "@/components/ViewToggleButtons";

import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, BoxProps, Fab, Stack, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { DrawerType } from "@/types/drawer";

const ContainerBox = styled(Box)({
  display: "flex",
});

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  width: "100%",
  minHeight: "100dvh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.vars.palette.background.default,
  transition: theme.transitions.create("background-color"),
}));

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [drawerState, setDrawerState] = useState({
    cart: false,
    nav: false,
  });

  const pathname = usePathname();
  const { lang, tableNumber } = useParams();

  const isHome = pathname === `/${lang}`;
  const isOrderPage = pathname === `/${lang}/order/${tableNumber}`;

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
    <ContainerBox>
      <HideAppBar onDrawerToggle={handleDrawerToggle} />
      <NavTemporaryDrawer
        onDrawerToggle={handleDrawerToggle}
        open={drawerState.nav}
      />
      <CartAnchorTemporaryDrawer
        onDrawerToggle={handleDrawerToggle}
        open={drawerState.cart}
      />
      <MainBox component="main">
        <Toolbar id="back-to-top-anchor" />
        {isHome ? (
          children
        ) : (
          <Stack padding={2} gap={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={2}
            >
              <RouterBreadcrumbs />
              {isOrderPage && (
                <Stack direction="row" alignItems="center" gap={2}>
                  <OrderSearch />
                  <ViewToggleButtons />
                </Stack>
              )}
            </Stack>
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
    </ContainerBox>
  );
};

export default AppLayout;
