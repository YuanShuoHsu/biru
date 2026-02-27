"use client";

import { Suspense } from "react";

import CustomizedDialogs from "@/components/CustomizedDialogs";
import HideAppBar from "@/components/HideAppBar";
import NavTemporaryDrawer from "@/components/NavTemporaryDrawer";
import ScrollTop from "@/components/ScrollTop";

import { useAuthInitializer } from "@/hooks/useAuthInitializer";

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
        <Stack padding={2} height="100%" gap={2}>
          {children}
        </Stack>
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
