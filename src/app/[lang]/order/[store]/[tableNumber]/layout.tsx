import { notFound } from "next/navigation";

import { TABLE_NUMBERS } from "@/constants/tableNumbers";

import type { StoreValue } from "@/types/stores";
import type { TableNumberParam } from "@/types/tableNumbers";

interface OrderTableNumberLayoutProps {
  children: React.ReactNode;
  params: Promise<{ store: StoreValue; tableNumber: TableNumberParam }>;
}

const OrderTableNumberLayout = async ({
  children,
  params,
}: OrderTableNumberLayoutProps) => {
  const { tableNumber } = await params;

  const tableId = Number(tableNumber);
  if (Number.isNaN(tableId) || tableId < 0 || tableId > TABLE_NUMBERS)
    return notFound();

  return <>{children}</>;
};

export default OrderTableNumberLayout;
