import { notFound } from "next/navigation";

import OrderTableNumber from "./OrderTableNumber";

import { TABLE_NUMBERS } from "@/constants/tableNumbers";

import type { StoreValue } from "@/types/stores";
import type { TableNumberParam } from "@/types/tableNumbers";

interface OrderTableNumberPageProps {
  params: Promise<{ store: StoreValue; tableNumber: TableNumberParam }>;
}

const OrderTableNumberPage = async ({ params }: OrderTableNumberPageProps) => {
  const { tableNumber } = await params;

  if (
    !/^(0|[1-9]\d*)$/.test(tableNumber) ||
    Number(tableNumber) > TABLE_NUMBERS
  )
    return notFound();

  return <OrderTableNumber />;
};

export default OrderTableNumberPage;
