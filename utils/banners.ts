import { cacheLife } from "next/cache";

import { fetcher } from "./fetcher";

import type { Banner } from "@/types/banners";

export const getBanners = async () => {
  "use cache";
  cacheLife("minutes");

  try {
    return await fetcher<Banner[]>("/api/banners/active");
  } catch {
    return [];
  }
};
