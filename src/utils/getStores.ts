import { cache } from "react";

import type { Store } from "@/types/stores";

import { fetcher } from "./fetcher";

const getStores = cache(() =>
  fetcher<Store[]>("/api/stores", {
    next: { revalidate: 60, tags: ["stores"] },
  }),
);

export default getStores;
