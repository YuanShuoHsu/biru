// https://mui.com/material-ui/guides/localization/#Locales.tsx
// https://mui.com/x/react-date-pickers/adapters-locale/#LocalizationDayjs.tsx

"use client";

import { useLocale } from "next-intl";
import { useMemo } from "react";

import { LocaleEnum } from "@/enums/Locale";

import type { Locale } from "@/i18n/routing";

import * as muiLocales from "@mui/material/locale";
import {
  createTheme,
  type ThemeOptions,
  ThemeProvider,
} from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as pickersLocales from "@mui/x-date-pickers/locales";

import theme from "@/theme";

import "dayjs/locale/en";
import "dayjs/locale/ja";
import "dayjs/locale/ko";
import "dayjs/locale/zh-cn";
import "dayjs/locale/zh-tw";

const themeLocales: Record<Locale, ThemeOptions[]> = {
  [LocaleEnum.ZhTW]: [muiLocales.zhTW, pickersLocales.zhTW],
  [LocaleEnum.En]: [muiLocales.enUS, pickersLocales.enUS],
  [LocaleEnum.Ja]: [muiLocales.jaJP, pickersLocales.jaJP],
  [LocaleEnum.Ko]: [muiLocales.koKR, pickersLocales.koKR],
  [LocaleEnum.ZhCN]: [muiLocales.zhCN, pickersLocales.zhCN],
};

interface LocaleProviderProps {
  children: React.ReactNode;
}

const LocaleProvider = ({ children }: LocaleProviderProps) => {
  const locale = useLocale();

  const themeWithLocale = useMemo(
    () => createTheme(theme, ...themeLocales[locale]),
    [locale],
  );

  return (
    <ThemeProvider theme={themeWithLocale}>
      <LocalizationProvider
        adapterLocale={locale.toLowerCase()}
        dateAdapter={AdapterDayjs}
      >
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default LocaleProvider;
