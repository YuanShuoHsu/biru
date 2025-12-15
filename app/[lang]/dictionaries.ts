// https://nextjs.org/docs/app/building-your-application/routing/internationalization#localization

import "server-only";

import { Locale } from "@/constants/locale";

import type { LocaleCode } from "@/types/locale";

export const dictionaries = {
  [Locale.ZhTW]: () =>
    import("./dictionaries/zh-TW.json").then((module) => module.default),
  [Locale.En]: () =>
    import("./dictionaries/en.json").then((module) => module.default),
  [Locale.Ja]: () =>
    import("./dictionaries/ja.json").then((module) => module.default),
  [Locale.Ko]: () =>
    import("./dictionaries/ko.json").then((module) => module.default),
  [Locale.ZhCN]: () =>
    import("./dictionaries/zh-CN.json").then((module) => module.default),
};

export const getDictionary = async (locale: LocaleCode) =>
  dictionaries[locale]();
