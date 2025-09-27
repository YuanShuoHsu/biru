import type { LocaleCode } from "./locale";
import type { OrderMode } from "./orderMode";
import type { StoreId } from "./stores";
import type { TableNumber } from "./tableNumbers";

interface RouteParam {
  lang: LocaleCode;
  mode: OrderMode;
  storeId: StoreId;
  tableNumber: TableNumber;
}

export type RouteParams<K extends keyof RouteParam = keyof RouteParam> =
  Readonly<Pick<RouteParam, K>>;
