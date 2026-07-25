import { cache } from "react";

import { fetcher } from "./fetcher";

import type { Banner } from "@/types/banners";

export const getBanners = cache(async () => {
  try {
    return await fetcher<Banner[]>("/api/banners/active");
  } catch {
    return [];
  }
});
