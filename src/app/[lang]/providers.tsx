// https://mui.com/material-ui/integrations/nextjs/

"use client";

import { SnackbarProvider } from "notistack";
import { SWRConfiguration } from "swr";

import { I18nDict } from "@/context/i18n";

import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";

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
        <SWRProvider fallback={fallback}>
          <SnackbarProvider
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            maxSnack={3}
          >
            {children}
          </SnackbarProvider>
        </SWRProvider>
      </I18nProvider>
    </ThemeProvider>
  </AppRouterCacheProvider>
);

export default Providers;
