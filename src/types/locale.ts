import type { StoreId } from "./stores";
import type { TableNumber } from "./tableNumbers";

export type LocaleCode = "zh-TW" | "en" | "ja" | "ko" | "zh-CN";

export type LangParam = {
  lang: LocaleCode;
};

export type LangStoreParam = LangParam & {
  storeId: StoreId;
};

export type LangTableNumberParam = LangParam & {
  tableNumber: TableNumber;
};

export type LangStoreTableNumberParam = LangParam & {
  storeId: StoreId;
  tableNumber: TableNumber;
};
