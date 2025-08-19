import type { StoreValue } from "./stores";
import type { TableNumberParam } from "./tableNumbers";

export type LocaleCode = "zh-TW" | "en" | "ja" | "ko" | "zh-CN";

export type LangParam = {
  lang: LocaleCode;
};

export type LangStoreParam = LangParam & {
  store: StoreValue;
};

export type LangTableNumberParam = LangParam & {
  tableNumber: TableNumberParam;
};

export type LangStoreTableNumberParam = LangParam & {
  store: StoreValue;
  tableNumber: TableNumberParam;
};
