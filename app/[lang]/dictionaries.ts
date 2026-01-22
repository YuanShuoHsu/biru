// https://nextjs.org/docs/app/guides/internationalization

import "server-only";

import { LocaleEnum } from "@/constants/locale";

const dictionariesList = [
  "appBar",
  "account",
  "auth",
  "cart",
  "common",
  "company",
  "dialog",
  "home",
  "maintenance",
  "order",
  "validation",
] as const;

const loadDictionary = async (locale: string) => {
  const result = await Promise.all(
    dictionariesList.map((fileName) =>
      import(`./dictionaries/${locale}/${fileName}.json`).then(
        (m) => m.default,
      ),
    ),
  );

  return Object.fromEntries(
    dictionariesList.map((key, index) => [key, result[index]]),
  );
};

export const dictionaries = {
  [LocaleEnum.ZhTW]: () => loadDictionary("zh-TW"),
  [LocaleEnum.En]: () => loadDictionary("en"),
  [LocaleEnum.Ja]: () => loadDictionary("ja"),
  [LocaleEnum.Ko]: () => loadDictionary("ko"),
  [LocaleEnum.ZhCN]: () => loadDictionary("zh-CN"),
};

export type Locale = keyof typeof dictionaries;

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
