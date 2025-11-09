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
