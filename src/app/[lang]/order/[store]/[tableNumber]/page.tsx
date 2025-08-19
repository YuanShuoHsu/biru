import { notFound } from "next/navigation";

import OrderTableNumber from "./OrderTableNumber";

import { stores } from "@/constants/stores";
import { TABLE_NUMBERS } from "@/constants/tableNumbers";

interface OrderTableNumberPageProps {
  params: Promise<{ store: string; tableNumber: string }>;
}

const OrderTableNumberPage = async ({ params }: OrderTableNumberPageProps) => {
  const { store, tableNumber } = await params;

  const hasStore = stores.some(({ value }) => value === store);
  if (!hasStore) return notFound();

  const tableId = Number(tableNumber);
  if (Number.isNaN(tableId) || tableId < 0 || tableId > TABLE_NUMBERS)
    return notFound();

  return <OrderTableNumber />;
};

export default OrderTableNumberPage;
