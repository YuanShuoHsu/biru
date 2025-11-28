// https://mui.com/material-ui/integrations/nextjs/
// https://mui.com/x/react-date-pickers/adapters-locale/#LocalizationDayjs.tsx

"use client";

import { SnackbarProvider } from "notistack";
import { SWRConfiguration } from "swr";

import type { I18nDict } from "@/context/i18n";

import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import AuthProvider from "@/providers/AuthProvider";
import I18nProvider from "@/providers/I18nProvider";
import SWRProvider from "@/providers/SWRProvider";

import theme from "@/theme";

import type { LocaleCode } from "@/types/locale";

import "dayjs/locale/en";
import "dayjs/locale/ja";
import "dayjs/locale/ko";
import "dayjs/locale/zh-cn";
import "dayjs/locale/zh-tw";

const localeMap: Record<LocaleCode, string> = {
  "zh-TW": "zh-tw",
  en: "en",
  ja: "ja",
  ko: "ko",
  "zh-CN": "zh-cn",
};

const getDayjsLocale = (lang: LocaleCode) => localeMap[lang];

interface ProvidersProps {
  children: React.ReactNode;
  dict: I18nDict;
  fallback: SWRConfiguration["fallback"];
  lang: LocaleCode;
}

const Providers = ({ children, dict, fallback, lang }: ProvidersProps) => (
  <AppRouterCacheProvider options={{ enableCssLayer: true }}>
    <ThemeProvider theme={theme}>
      <LocalizationProvider
        adapterLocale={getDayjsLocale(lang)}
        dateAdapter={AdapterDayjs}
      >
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
      </LocalizationProvider>
    </ThemeProvider>
  </AppRouterCacheProvider>
);

export default Providers;
