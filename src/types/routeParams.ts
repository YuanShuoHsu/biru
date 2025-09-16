import { LocaleCode } from "./locale";
import { OrderMode } from "./orderMode";
import { StoreId } from "./stores";
import { TableNumber } from "./tableNumbers";

interface RouteParam {
  lang: LocaleCode;
  mode: OrderMode;
  storeId: StoreId;
  tableNumber: TableNumber;
}

export type RouteParams<K extends keyof RouteParam = keyof RouteParam> =
  Readonly<Pick<RouteParam, K>>;
