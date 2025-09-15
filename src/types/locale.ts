import type { OrderMode } from "./orderMode";
import type { StoreId } from "./stores";
import type { TableNumber } from "./tableNumbers";

export type LocaleCode = "zh-TW" | "en" | "ja" | "ko" | "zh-CN";

export type LangParam = {
  lang: LocaleCode;
};

export type LangModeStoreIdParam = LangParam & {
  mode: OrderMode;
  storeId: StoreId;
};

export type LangModeStoreIdTableNumberParam = LangParam & {
  mode: OrderMode;
  storeId: StoreId;
  tableNumber: TableNumber;
};
