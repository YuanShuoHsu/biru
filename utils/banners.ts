import { cacheLife } from "next/cache";

import { fetcher } from "./fetcher";

import type { Banner } from "@/types/banners";

export const getBanners = async () => {
  "use cache";
  cacheLife("minutes");

  return fetcher<Banner[]>("/api/banners/active");
};
