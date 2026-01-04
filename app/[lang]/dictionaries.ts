// https://nextjs.org/docs/app/guides/internationalization

import "server-only";

import { LocaleEnum } from "@/constants/locale";

export const dictionaries = {
  [LocaleEnum.ZhTW]: () =>
    import("./dictionaries/zh-TW.json").then((module) => module.default),
  [LocaleEnum.En]: () =>
    import("./dictionaries/en.json").then((module) => module.default),
  [LocaleEnum.Ja]: () =>
    import("./dictionaries/ja.json").then((module) => module.default),
  [LocaleEnum.Ko]: () =>
    import("./dictionaries/ko.json").then((module) => module.default),
  [LocaleEnum.ZhCN]: () =>
    import("./dictionaries/zh-CN.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
