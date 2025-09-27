import { notFound } from "next/navigation";

import { tableNumbers } from "@/constants/tableNumbers";

import { ORDER_MODE, type OrderMode } from "@/types/orderMode";
import type { StoreId } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

interface OrderModeStoreIdTableNumberLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    mode: OrderMode;
    storeId: StoreId;
    tableNumber: TableNumber;
  }>;
}

const OrderModeStoreIdTableNumberLayout = async ({
  children,
  params,
}: OrderModeStoreIdTableNumberLayoutProps) => {
  const { mode, storeId, tableNumber } = await params;

  const isValidFormat = /^(0|[1-9]\d*)$/.test(tableNumber);
  if (!isValidFormat) return notFound();

  const maxTableNumbers = tableNumbers[storeId];
  const number = Number(tableNumber);

  const isDineIn =
    mode === ORDER_MODE.DineIn && number >= 1 && number <= maxTableNumbers;
  const isPickup = mode === ORDER_MODE.Pickup && number === 0;

  const isValidTableNumber = isDineIn || isPickup;
  if (!isValidTableNumber) return notFound();

  return <>{children}</>;
};

export default OrderModeStoreIdTableNumberLayout;
