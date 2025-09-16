import { notFound } from "next/navigation";

import { TABLE_NUMBERS } from "@/constants/tableNumbers";

import { ORDER_MODE, type OrderMode } from "@/types/orderMode";
import type { TableNumber } from "@/types/tableNumbers";

interface OrderStoreTableNumberLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    mode: OrderMode;
    tableNumber: TableNumber;
  }>;
}

const OrderStoreTableNumberLayout = async ({
  children,
  params,
}: OrderStoreTableNumberLayoutProps) => {
  const { mode, tableNumber } = await params;

  const isValidFormat = /^(0|[1-9]\d*)$/.test(tableNumber);
  if (!isValidFormat) return notFound();

  const number = Number(tableNumber);

  const isDineIn =
    mode === ORDER_MODE.DineIn && number >= 1 && number <= TABLE_NUMBERS;
  const isPickup = mode === ORDER_MODE.Pickup && number === 0;

  if (!(isDineIn || isPickup)) return notFound();

  return <>{children}</>;
};

export default OrderStoreTableNumberLayout;
