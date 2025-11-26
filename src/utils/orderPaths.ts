import { ORDER_MODE } from "@/constants/orderMode";

import type { LocaleCode } from "@/types/locale";
import type { OrderMode } from "@/types/orderMode";
import type { PartySize } from "@/types/partySize";
import type { StoreSlug } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

export const createOrderPaths = ({
  lang,
  mode,
  storeSlug,
  tableNumber,
  partySize,
  pathname,
}: {
  lang: LocaleCode;
  mode: OrderMode;
  storeSlug: StoreSlug;
  tableNumber?: TableNumber;
  partySize?: PartySize;
  pathname: string;
}) => {
  const isPickup = mode === ORDER_MODE.Pickup;
  const isDineIn = mode === ORDER_MODE.DineIn;

  const basePath = `/${lang}/order/${mode}/${storeSlug}${
    isPickup ? "" : `/${tableNumber}`
  }`;

  const menuPath = isDineIn ? `${basePath}/${partySize}` : null;
  const checkoutPath = `${basePath}/checkout`;

  const menuRoutes = [
    ...(isPickup ? [basePath] : []),
    ...(menuPath ? [menuPath] : []),
  ];

  const orderRoutes = [checkoutPath, ...menuRoutes];

  const isMenuRoute = menuRoutes.includes(pathname);
  const isOrderRoute = orderRoutes.includes(pathname);

  return {
    isMenuRoute,
    isOrderRoute,
  };
};
