"use client";

import { Suspense } from "react";

import CustomizedDialogs from "@/components/CustomizedDialogs";
import HideAppBar from "@/components/HideAppBar";
import NavTemporaryDrawer from "@/components/NavTemporaryDrawer";
import OrderSearch from "@/components/OrderSearch";
import RouterBreadcrumbs from "@/components/RouterBreadcrumbs";
import ScrollTop from "@/components/ScrollTop";
import ViewToggleButtons from "@/components/ViewToggleButtons";

import { useAuthInitializer } from "@/hooks/useAuthInitializer";
import { useOrderPaths } from "@/hooks/useOrderPaths";

import { usePathname } from "@/i18n/navigation";

import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, type BoxProps, Fab, Stack, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  transition: theme.transitions.create("background-color"),
}));

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  useAuthInitializer();

  const { isMenuRoute } = useOrderPaths();

  const pathname = usePathname();

  const isHome = pathname === "/";

  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE === "true";

  return (
    <Box display="flex">
      <HideAppBar />
      <Suspense>
        <NavTemporaryDrawer />
      </Suspense>
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
