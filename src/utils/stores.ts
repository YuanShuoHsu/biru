import type { LocaleCode } from "@/types/locale";
import type { Store, StoreName, StoreSlug } from "@/types/stores";

export const getStoreName = (
  stores: Store[],
  lang: LocaleCode,
  storeSlug: StoreSlug,
): StoreName => {
  const store = stores.find(({ slug }) => slug === storeSlug);
  if (!store) return storeSlug;

  return store.name[lang];
};
