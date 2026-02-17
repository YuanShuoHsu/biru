// https://github.com/vercel/next.js/tree/canary/examples/i18n-routing

import { LocaleEnum } from "@/enums/Locale";

export const i18n = {
  defaultLocale: LocaleEnum.ZhTW,
  locales: [
    LocaleEnum.ZhTW,
    LocaleEnum.En,
    LocaleEnum.Ja,
    LocaleEnum.Ko,
    LocaleEnum.ZhCN,
  ],
} as const;
