// https://mui.com/material-ui/integrations/nextjs/

"use client";

import { SnackbarProvider } from "notistack";
import { SWRConfiguration } from "swr";

import type { I18nDict } from "@/context/i18n";

import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";

import AuthProvider from "@/providers/AuthProvider";
import I18nProvider from "@/providers/I18nProvider";
import SWRProvider from "@/providers/SWRProvider";

import theme from "@/theme";

interface ProvidersProps {
  children: React.ReactNode;
  dict: I18nDict;
  fallback: SWRConfiguration["fallback"];
}

const Providers = ({ children, dict, fallback }: ProvidersProps) => (
  <AppRouterCacheProvider options={{ enableCssLayer: true }}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <I18nProvider dict={dict}>
        <SnackbarProvider
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          maxSnack={3}
        >
          <SWRProvider fallback={fallback}>
            <AuthProvider>{children}</AuthProvider>
          </SWRProvider>
        </SnackbarProvider>
      </I18nProvider>
    </ThemeProvider>
  </AppRouterCacheProvider>
);

export default Providers;
