import { notFound } from "next/navigation";

import { ORDER_MODE } from "@/constants/orderMode";
import { tableNumbers } from "@/constants/tableNumbers";
// import { ORDER_MODE, type OrderMode } from "@/types/orderMode";
// import type { StoreSlug } from "@/types/stores";
// import type { TableNumber } from "@/types/tableNumbers";

interface OrderModeStoreSlugTableNumberLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    mode: string;
    storeSlug: string;
    tableNumber: string;
    // mode: OrderMode;
    // storeSlug: StoreSlug;
    // tableNumber: TableNumber;
  }>;
}

const OrderModeStoreSlugTableNumberLayout = async ({
  children,
  params,
}: OrderModeStoreSlugTableNumberLayoutProps) => {
  const { mode, storeSlug, tableNumber } = await params;

  const isNumeric = /^(0|[1-9]\d*)$/.test(tableNumber);
  if (!isNumeric) return notFound();

  const maxTableNumbers = tableNumbers[storeSlug];
  const number = Number(tableNumber);

  const isValidTableNumber =
    mode === ORDER_MODE.DineIn && number >= 1 && number <= maxTableNumbers;
  if (!isValidTableNumber) return notFound();

  return <>{children}</>;
};

export default OrderModeStoreSlugTableNumberLayout;
