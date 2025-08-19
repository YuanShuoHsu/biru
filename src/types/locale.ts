import type { StoreValue } from "./stores";

export type LocaleCode = "zh-TW" | "en" | "ja" | "ko" | "zh-CN";

export type LangParam = {
  lang: LocaleCode;
};

export type LangStoreParam = LangParam & {
  store: StoreValue;
};

export type LangTableNumberParam = LangParam & {
  tableNumber: string;
};

export type LangStoreTableNumberParam = LangParam & {
  store: StoreValue;
  tableNumber: string;
};
