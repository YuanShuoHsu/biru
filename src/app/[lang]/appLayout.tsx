"use client";

import { useParams, usePathname } from "next/navigation";
import { useState } from "react";

import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, CssBaseline, Fab, Stack, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";

import CartDrawer from "@/components/CartDrawer";
import CustomizedDialogs from "@/components/CustomizedDialogs";
import HideAppBar from "@/components/HideAppBar";
import OrderSearch from "@/components/OrderSearch";
import ResponsiveDrawer from "@/components/ResponsiveDrawer";
import RouterBreadcrumbs from "@/components/RouterBreadcrumbs";
import ScrollTop from "@/components/ScrollTop";

import { drawerWidth } from "@/constants/responsiveDrawer";

const ContainerBox = styled(Box)({
  display: "flex",
});

const MainBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",

  [theme.breakpoints.up("sm")]: {
    width: `calc(100% - ${drawerWidth}px)`,
  },
}));

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [cartOpen, setCartOpen] = useState(false);

  const pathname = usePathname();
  const { lang, tableNumber } = useParams();
  const isOrderPage = pathname === `/${lang}/order/${tableNumber}`;

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleDrawerTransitionEnd = () => setIsClosing(false);

  const handleCartToggle = () => setCartOpen(!cartOpen);

  return (
    <ContainerBox>
      <CssBaseline />
      <HideAppBar
        onCartToggle={handleCartToggle}
        onDrawerToggle={handleDrawerToggle}
      />
      <Toolbar disableGutters id="back-to-top-anchor" />
      <ResponsiveDrawer
        onDrawerClose={handleDrawerClose}
        onDrawerToggle={handleDrawerToggle}
        onDrawerTransitionEnd={handleDrawerTransitionEnd}
        mobileOpen={mobileOpen}
      />
      <CartDrawer onClose={handleCartToggle} open={cartOpen} />
      <MainBox as="main">
        <Toolbar />
        <Stack height="100%" direction="column" spacing={2}>
          <Stack
            minHeight={40}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            <RouterBreadcrumbs />
            {isOrderPage && <OrderSearch />}
          </Stack>
          {children}
        </Stack>
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
