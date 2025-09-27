import type { LocaleCode, LocalizedText } from "./locale";

export interface Store {
  id: string;
  name: LocalizedText;
  createdAt: string;
  updatedAt: string;
}

export type StoreId = Store["id"];
export type StoreName = Store["name"][LocaleCode];
