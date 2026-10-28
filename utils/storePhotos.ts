import { cacheLife } from "next/cache";

import { fetcher } from "./fetcher";

import type { Locale } from "@/i18n/routing";

import type { StorePhoto } from "@/types/storePhotos";

export const getStorePhotos = async (locale: Locale) => {
  "use cache";
  cacheLife("minutes");

  try {
    return await fetcher<StorePhoto[]>(
      `/api/store-photos/active?lang=${locale}`,
    );
  } catch {
    return [];
  }
};
