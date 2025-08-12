"use client";

import { SnackbarProvider } from "notistack";

import { I18nDict } from "@/context/i18n";

import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";

import I18nProvider from "@/providers/I18nProvider";

import theme from "@/theme";

interface ProvidersProps {
  children: React.ReactNode;
  dict: I18nDict;
}

const Providers = ({ children, dict }: ProvidersProps) => (
  <AppRouterCacheProvider options={{ enableCssLayer: true }}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <I18nProvider dict={dict}>
        <SnackbarProvider
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          maxSnack={3}
        >
          {children}
        </SnackbarProvider>
      </I18nProvider>
    </ThemeProvider>
  </AppRouterCacheProvider>
);

export default Providers;
