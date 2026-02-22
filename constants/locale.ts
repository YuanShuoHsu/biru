import { LocaleEnum } from "@/enums/Locale";

import type { Locale } from "@/i18n/routing";

import type { EcpayLanguage } from "@/types/ecpay/createEcpayDto";

export const countryCodeLocaleMap: Record<Locale, string> = {
  [LocaleEnum.ZhTW]: "TW",
  [LocaleEnum.Ja]: "JP",
  [LocaleEnum.Ko]: "KR",
  [LocaleEnum.En]: "US",
  [LocaleEnum.ZhCN]: "CN",
};

export const dayjsLocaleMap: Record<Locale, string> = {
  [LocaleEnum.ZhTW]: "zh-tw",
  [LocaleEnum.En]: "en",
  [LocaleEnum.Ja]: "ja",
  [LocaleEnum.Ko]: "ko",
  [LocaleEnum.ZhCN]: "zh-cn",
};

export const ecpayLocaleMap: Record<Locale, EcpayLanguage> = {
  [LocaleEnum.ZhTW]: "",
  [LocaleEnum.En]: "ENG",
  [LocaleEnum.Ja]: "JPN",
  [LocaleEnum.Ko]: "KOR",
  [LocaleEnum.ZhCN]: "CHI",
};

export const languageLocaleMap: Record<Locale, string> = {
  [LocaleEnum.ZhTW]: "繁體中文",
  [LocaleEnum.En]: "English",
  [LocaleEnum.Ja]: "日本語",
  [LocaleEnum.Ko]: "한국어",
  [LocaleEnum.ZhCN]: "简体中文",
};
