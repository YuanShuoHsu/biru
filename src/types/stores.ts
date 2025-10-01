import type { LocaleCode, LocalizedText } from "./locale";

export interface Store {
  id: string;
  name: LocalizedText;
  createdAt: string;
  slug: string;
  updatedAt: string;
}

export type StoreSlug = Store["slug"];
export type StoreName = Store["name"][LocaleCode];
