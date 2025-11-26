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

  const basePath = `/${lang}/order/${mode}/${storeSlug}${
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
