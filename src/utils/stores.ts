import { cache } from "react";

import { getErrorMessage } from "./errors";
import { fetcher } from "./fetcher";

import type { LocaleCode } from "@/types/locale";
import type { Store, StoreName, StoreSlug } from "@/types/stores";

export const getStoreName = (
  lang: LocaleCode,
  stores: Store[],
  storeSlug?: StoreSlug,
): StoreName => {
  if (!storeSlug) return "";

  const store = stores.find(({ slug }) => slug === storeSlug);
  const localizedName = store?.name?.[lang];

  return localizedName || storeSlug;
};

export const getStores = cache(async () => {
  try {
    const data = await fetcher<Store[]>("/api/stores", {
      next: { revalidate: 60, tags: ["stores"] },
    });

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(getErrorMessage(error));
    return [];
  }
});
