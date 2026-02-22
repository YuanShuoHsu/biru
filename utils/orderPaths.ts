import { ORDER_MODE } from "@/constants/orderMode";

import type { Locale } from "@/i18n/routing";

import type { OrderMode } from "@/types/orderMode";
import type { PartySize } from "@/types/partySize";
import type { StoreSlug } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

export const createOrderPaths = ({
  locale,
  mode,
  storeSlug,
  tableNumber,
  partySize,
  pathname,
}: {
  locale: Locale;
  mode: OrderMode;
  storeSlug: StoreSlug;
  tableNumber: TableNumber;
  partySize: PartySize;
  pathname: string;
}) => {
  const isPickup = mode === ORDER_MODE.Pickup;

  const basePath = `/${locale}/order/${mode}/${storeSlug}${
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
