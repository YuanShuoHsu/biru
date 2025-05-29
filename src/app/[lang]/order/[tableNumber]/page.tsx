import { notFound } from "next/navigation";

import OrderTableNumber from "./OrderTableNumber";

import { TABLE_NUMBERS } from "@/constants/tableNumbers";

interface OrderTableNumberPageProps {
  params: { tableNumber: string };
}

const OrderTableNumberPage = ({
  params: { tableNumber },
}: OrderTableNumberPageProps) => {
  const tableId = Number(tableNumber);
  if (Number.isNaN(tableId) || tableId < 0 || tableId > TABLE_NUMBERS)
    return notFound();

  return <OrderTableNumber />;
};

export default OrderTableNumberPage;
