"use client";

import { ReactNode } from "react";

import { SnackbarProvider } from "notistack";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";

import theme from "@/theme";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => (
  <AppRouterCacheProvider>
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {children}
      </SnackbarProvider>
    </ThemeProvider>
  </AppRouterCacheProvider>
);

export default Providers;
