import { notFound } from "next/navigation";

import OrderModePickupStoreIdSelect from "@/components/OrderModePickupStoreIdSelect";

import { ORDER_MODE, type OrderMode } from "@/types/orderMode";

interface OrderModePageProps {
  params: Promise<{ mode: OrderMode }>;
}

const OrderModePage = async ({ params }: OrderModePageProps) => {
  const { mode } = await params;

  if (mode !== ORDER_MODE.Pickup) return notFound();

  return <OrderModePickupStoreIdSelect />;
};

export default OrderModePage;
