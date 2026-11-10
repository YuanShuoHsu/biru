import { useParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

import { ORDER_MODE } from "@/constants/orderMode";

import { useCartStore } from "@/providers/cart-store-provider";
import { useMenuStore } from "@/providers/menu-store-provider";

import type { PrepEstimate } from "@/types/orders";
import type { OrganizationResponse } from "@/types/organizations";

import { getCartLeadTimeMinutes } from "@/utils/menus";

export const usePickupLeadMinutes = (
  organization: Pick<OrganizationResponse, "slug">,
) => {
  const { mode } = useParams();

  const { cartItemsList } = useCartStore((state) => state);
  const { menu } = useMenuStore((state) => state);

  const cartLeadTimeMinutes = useMemo(
    () => getCartLeadTimeMinutes(menu, cartItemsList),
    [cartItemsList, menu],
  );

  const { data, mutate } = useSWR<PrepEstimate>(
    mode === ORDER_MODE.Pickup
      ? `/api/organizations/${organization.slug}/orders/prep-estimate?leadMinutes=${cartLeadTimeMinutes}`
      : null,
    { onError: () => {} },
  );

  return {
    pickupLeadMinutes: Math.max(
      cartLeadTimeMinutes,
      data?.estimatedMinutes ?? 0,
    ),
    refreshPickupLeadMinutes: mutate,
  };
};
