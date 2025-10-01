import type { LocaleCode } from "./locale";
import type { OrderMode } from "./orderMode";
import type { StoreSlug } from "./stores";
import type { TableNumber } from "./tableNumbers";

interface RouteParam {
  lang: LocaleCode;
  mode: OrderMode;
  storeSlug: StoreSlug;
  tableNumber: TableNumber;
}

export type RouteParams<K extends keyof RouteParam = keyof RouteParam> =
  Readonly<Pick<RouteParam, K>>;
