"use client";

import { ReactNode } from "react";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";

import theme from "@/theme";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => (
  <AppRouterCacheProvider>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </AppRouterCacheProvider>
);

export default Providers;
