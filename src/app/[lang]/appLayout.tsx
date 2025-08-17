"use client";

import { useState } from "react";

import CartAnchorTemporaryDrawer from "@/components/CartAnchorTemporaryDrawer";
import CustomizedDialogs from "@/components/CustomizedDialogs";
import HideAppBar from "@/components/HideAppBar";
import NavTemporaryDrawer from "@/components/NavTemporaryDrawer";
import ScrollTop from "@/components/ScrollTop";

import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, BoxProps, Fab, Toolbar } from "@mui/material";
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
        {children}
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
