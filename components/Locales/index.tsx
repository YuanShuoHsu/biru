// https://mui.com/material-ui/guides/localization/#Locales.tsx

"use client";

import { useLocale } from "next-intl";
import { useMemo } from "react";

import { locales } from "@/constants/locale";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import theme from "@/theme";

interface LocalesProps {
  children: React.ReactNode;
}

const Locales = ({ children }: LocalesProps) => {
  const locale = useLocale();

  const themeWithLocale = useMemo(
    () => createTheme(theme, ...locales[locale].mui),
    [locale],
  );

  return (
    <ThemeProvider theme={themeWithLocale}>
      <LocalizationProvider
        adapterLocale={locales[locale].dayjs}
        dateAdapter={AdapterDayjs}
      >
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default Locales;
