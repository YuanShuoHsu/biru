import { notFound } from "next/navigation";

import OrderTableNumber from "./OrderTableNumber";

import { TABLE_NUMBERS } from "@/constants/tableNumbers";

import type { StoreValue } from "@/types/stores";

import { stores } from "@/utils/stores";

interface OrderTableNumberPageProps {
  params: Promise<{ store: StoreValue; tableNumber: string }>;
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
