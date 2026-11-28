import { useParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

import { useSession } from "@/hooks/useSession";

import type { PurchasedToday } from "@/types/orders";
import type { RouteParams } from "@/types/routeParams";

import { fetcher } from "@/utils/fetcher";

export const usePurchasedToday = () => {
  const session = useSession();

  const { organizationSlug } = useParams<RouteParams<"organizationSlug">>();

  const { data, mutate } = useSWR<PurchasedToday[]>(
    session
      ? [
          `/api/users/me/purchased-today?${new URLSearchParams({ organizationSlug })}`,
          session.user.id,
        ]
      : null,
    ([url]: [string, string]) => fetcher<PurchasedToday[]>(url),
    { onError: () => {} },
  );

  const purchased = useMemo(
    () =>
      new Map(data?.map(({ menuItemId, quantity }) => [menuItemId, quantity])),
    [data],
  );

  return {
    getPurchasedToday: (menuItemId: string) => purchased.get(menuItemId) ?? 0,
    isMember: !!session,
    refreshPurchasedToday: mutate,
  };
};
