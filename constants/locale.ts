import type { EcpayLanguage } from "@/types/ecpay/createEcpayDto";
import type { LocaleCode } from "@/types/locale";

export enum LocaleEnum {
  ZhTW = "zh-TW",
  En = "en",
  Ja = "ja",
  Ko = "ko",
  ZhCN = "zh-CN",
}

export const locales = [
  LocaleEnum.ZhTW,
  LocaleEnum.En,
  LocaleEnum.Ja,
  LocaleEnum.Ko,
  LocaleEnum.ZhCN,
] as const;

export const defaultLocale = LocaleEnum.ZhTW;

export const countryCodeLocaleMap: Record<LocaleEnum, string> = {
  [LocaleEnum.ZhTW]: "TW",
  [LocaleEnum.Ja]: "JP",
  [LocaleEnum.Ko]: "KR",
  [LocaleEnum.En]: "US",
  [LocaleEnum.ZhCN]: "CN",
};

export const dayjsLocaleMap: Record<LocaleEnum, string> = {
  [LocaleEnum.ZhTW]: "zh-tw",
  [LocaleEnum.En]: "en",
  [LocaleEnum.Ja]: "ja",
  [LocaleEnum.Ko]: "ko",
  [LocaleEnum.ZhCN]: "zh-cn",
};

export const ecpayLocaleMap: Record<LocaleCode, EcpayLanguage> = {
  "zh-TW": "",
  en: "ENG",
  ja: "JPN",
  ko: "KOR",
  "zh-CN": "CHI",
};

export const languageLocaleMap: Record<LocaleEnum, string> = {
  [LocaleEnum.ZhTW]: "繁體中文",
  [LocaleEnum.En]: "English",
  [LocaleEnum.Ja]: "日本語",
  [LocaleEnum.Ko]: "한국어",
  [LocaleEnum.ZhCN]: "简体中文",
};
