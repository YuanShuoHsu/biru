import { notFound } from "next/navigation";

import { TABLE_NUMBERS } from "@/constants/tableNumbers";

import type { TableNumber } from "@/types/tableNumbers";

interface OrderStoreTableNumberLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tableNumber: TableNumber }>;
}

const OrderStoreTableNumberLayout = async ({
  children,
  params,
}: OrderStoreTableNumberLayoutProps) => {
  const { tableNumber } = await params;

  if (
    !/^(0|[1-9]\d*)$/.test(tableNumber) ||
    Number(tableNumber) > TABLE_NUMBERS
  )
    return notFound();

  return <>{children}</>;
};

export default OrderStoreTableNumberLayout;
