import { notFound } from "next/navigation";
import OrderTableNumber from "./OrderTableNumber";

interface OrderTableNumberPageProps {
  params: { tableNumber: string };
}

const OrderTableNumberPage = ({
  params: { tableNumber },
}: OrderTableNumberPageProps) => {
  const tableId = Number(tableNumber);
  if (Number.isNaN(tableId) || tableId < 0 || tableId > 100) return notFound();

  return <OrderTableNumber />;
};

export default OrderTableNumberPage;
