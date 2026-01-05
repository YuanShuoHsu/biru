// https://mui.com/material-ui/integrations/nextjs/
// https://mui.com/x/react-date-pickers/adapters-locale/#LocalizationDayjs.tsx

"use client";

import { closeSnackbar, SnackbarProvider } from "notistack";
import { SWRConfiguration } from "swr";

import type { Locale } from "./dictionaries";

import { dayjsLocaleMap } from "@/constants/locale";

import { Close } from "@mui/icons-material";
import { CssBaseline, IconButton } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { AuthStoreProvider } from "@/providers/auth-store-provider";
import { DialogStoreProvider } from "@/providers/dialog-store-provider";
import type { I18nDict } from "@/providers/i18n-store-provider";
import { I18nStoreProvider } from "@/providers/i18n-store-provider";
import { MenuStoreProvider } from "@/providers/menu-store-provider";
import { OrderSearchStoreProvider } from "@/providers/order-search-store-provider";
import SWRProvider from "@/providers/SWRProvider";
import { ViewStoreProvider } from "@/providers/view-store-provider";

import theme from "@/theme";

import "dayjs/locale/en";
import "dayjs/locale/ja";
import "dayjs/locale/ko";
import "dayjs/locale/zh-cn";
import "dayjs/locale/zh-tw";

interface ProvidersProps {
  children: React.ReactNode;
  dict: I18nDict;
  fallback: SWRConfiguration["fallback"];
  lang: Locale;
}

const Providers = ({ children, dict, fallback, lang }: ProvidersProps) => (
  <AppRouterCacheProvider options={{ enableCssLayer: true }}>
    <ThemeProvider theme={theme}>
      <LocalizationProvider
        adapterLocale={dayjsLocaleMap[lang]}
        dateAdapter={AdapterDayjs}
      >
        <CssBaseline />
        <I18nStoreProvider dict={dict}>
          <SnackbarProvider
            action={(snackbarId) => (
              <IconButton
                aria-label="close"
                color="inherit"
                onClick={() => closeSnackbar(snackbarId)}
                size="small"
              >
                <Close fontSize="small" />
              </IconButton>
            )}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            classes={{
              containerAnchorOriginTopRight:
                "notistack-container-top-right-offset",
            }}
            maxSnack={3}
          >
            <SWRProvider fallback={fallback}>
              <AuthStoreProvider>
                <DialogStoreProvider>
                  <MenuStoreProvider>
                    <OrderSearchStoreProvider>
                      <ViewStoreProvider>{children}</ViewStoreProvider>
                    </OrderSearchStoreProvider>
                  </MenuStoreProvider>
                </DialogStoreProvider>
              </AuthStoreProvider>
            </SWRProvider>
          </SnackbarProvider>
        </I18nStoreProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </AppRouterCacheProvider>
);

export default Providers;
