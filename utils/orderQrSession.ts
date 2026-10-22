import { cookies } from "next/headers";
import { cache } from "react";

import { fetcher } from "./fetcher";

import type { OrganizationResponse } from "@/types/organizations";
import type { OrderQrSessionResponse } from "@/types/orders";

export const getOrderQrSession = cache(
  async (organizationSlug: OrganizationResponse["slug"]) => {
    const cookieStore = await cookies();

    try {
      return await fetcher<OrderQrSessionResponse>(
        `/api/organizations/${organizationSlug}/order-qr-sessions/current`,
        { headers: { cookie: cookieStore.toString() } },
      );
    } catch {
      return null;
    }
  },
);
