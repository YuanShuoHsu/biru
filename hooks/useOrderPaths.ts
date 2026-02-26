"use client";

import { useParams } from "next/navigation";

import { ORDER_MODE } from "@/constants/orderMode";

import { usePathname } from "@/i18n/navigation";

import type { RouteParams } from "@/types/routeParams";

export const useOrderPaths = () => {
  const { mode, storeSlug, tableNumber, partySize } = useParams<RouteParams>();
  const pathname = usePathname();

  const isPickup = mode === ORDER_MODE.Pickup;

  const basePath = `/order/${mode}/${storeSlug}${
    isPickup ? "" : `/${tableNumber}`
  }`;
  const menuPath = isPickup ? basePath : `${basePath}/${partySize}`;
  const checkoutPath = `${menuPath}/checkout`;

  const orderRoutes = [menuPath, checkoutPath];
  const isMenuRoute = menuPath === pathname;
  const isOrderRoute = orderRoutes.includes(pathname);

  return {
    menuPath,
    checkoutPath,
    isMenuRoute,
    isOrderRoute,
  };
};
