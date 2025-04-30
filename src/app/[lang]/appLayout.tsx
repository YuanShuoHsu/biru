"use client";

import { useParams, usePathname } from "next/navigation";
import { useState } from "react";

import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, CssBaseline, Drawer, Fab, Stack, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";

import CustomizedDialogs from "@/components/CustomizedDialogs";
import HideAppBar from "@/components/HideAppBar";
import ResponsiveDrawer from "@/components/ResponsiveDrawer";
import RouterBreadcrumbs from "@/components/RouterBreadcrumbs";
import ScrollTop from "@/components/ScrollTop";

import { drawerWidth } from "@/constants/ResponsiveDrawer";

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
  const { lang } = useParams();
  const isOrderPage = pathname === `/${lang}/order`;

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
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={handleCartToggle}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <h2>Notifications</h2>
        </Box>
      </Drawer>
      <MainBox as="main">
        <Toolbar />
        {!isOrderPage && (
          <Stack height={40} direction="row" alignItems="center">
            <RouterBreadcrumbs />
          </Stack>
        )}
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
