import type { EcpayLanguage } from "@/types/ecpay/createEcpayDto";
import type { LocaleCode } from "@/types/locale";

export enum Locale {
  ZhTW = "zh-TW",
  En = "en",
  Ja = "ja",
  Ko = "ko",
  ZhCN = "zh-CN",
}

export const locales = [
  Locale.ZhTW,
  Locale.En,
  Locale.Ja,
  Locale.Ko,
  Locale.ZhCN,
] as const;

export const defaultLocale = Locale.ZhTW;

export const countryCodeLocaleMap: Record<Locale, string> = {
  [Locale.ZhTW]: "TW",
  [Locale.Ja]: "JP",
  [Locale.Ko]: "KR",
  [Locale.En]: "US",
  [Locale.ZhCN]: "CN",
};

export const dayjsLocaleMap: Record<Locale, string> = {
  [Locale.ZhTW]: "zh-tw",
  [Locale.En]: "en",
  [Locale.Ja]: "ja",
  [Locale.Ko]: "ko",
  [Locale.ZhCN]: "zh-cn",
};

export const ecpayLocaleMap: Record<LocaleCode, EcpayLanguage> = {
  "zh-TW": "",
  en: "ENG",
  ja: "JPN",
  ko: "KOR",
  "zh-CN": "CHI",
};

export const languageLocaleMap: Record<Locale, string> = {
  [Locale.ZhTW]: "繁體中文",
  [Locale.En]: "English",
  [Locale.Ja]: "日本語",
  [Locale.Ko]: "한국어",
  [Locale.ZhCN]: "简体中文",
};
