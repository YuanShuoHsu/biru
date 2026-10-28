import { cookies } from "next/headers";
import { cache } from "react";

import { fetcher } from "./fetcher";

import { API_ORDER_MODE, ORDER_MODE } from "@/constants/orderMode";

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

export const hasOrderAccess = async (
  organizationSlug: OrganizationResponse["slug"],
  mode: string,
  tableNumber: string | string[] | undefined,
) => {
  if (mode === ORDER_MODE.Pickup) return true;

  if (
    mode !== ORDER_MODE.Counter &&
    mode !== ORDER_MODE.DineIn &&
    mode !== ORDER_MODE.DriveThru
  )
    return false;

  const qrSession = await getOrderQrSession(organizationSlug);

  return (
    qrSession?.mode === API_ORDER_MODE[mode] &&
    (mode !== ORDER_MODE.DineIn ||
      qrSession.tableNumber === Number(tableNumber))
  );
};
