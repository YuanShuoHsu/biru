import { notFound } from "next/navigation";

import { tableNumbers } from "@/constants/tableNumbers";

import { ORDER_MODE, type OrderMode } from "@/types/orderMode";
import type { StoreSlug } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

interface OrderModeStoreSlugTableNumberLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    mode: OrderMode;
    storeSlug: StoreSlug;
    tableNumber: TableNumber;
  }>;
}

const OrderModeStoreSlugTableNumberLayout = async ({
  children,
  params,
}: OrderModeStoreSlugTableNumberLayoutProps) => {
  const { mode, storeSlug, tableNumber } = await params;

  const isValidFormat = /^(0|[1-9]\d*)$/.test(tableNumber);
  if (!isValidFormat) return notFound();

  const maxTableNumbers = tableNumbers[storeSlug];
  const number = Number(tableNumber);

  const isDineIn =
    mode === ORDER_MODE.DineIn && number >= 1 && number <= maxTableNumbers;
  const isPickup = mode === ORDER_MODE.Pickup && number === 0;

  const isValidTableNumber = isDineIn || isPickup;
  if (!isValidTableNumber) return notFound();

  return <>{children}</>;
};

export default OrderModeStoreSlugTableNumberLayout;
