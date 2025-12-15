import { notFound } from "next/navigation";

import OrderMenuContent from "@/components/OrderMenuContent";

import { ORDER_MODE } from "@/constants/orderMode";

import type { OrderMode } from "@/types/orderMode";

interface OrderModeStoreSlugPageProps {
  params: Promise<{ mode: OrderMode }>;
}

const OrderModeStoreSlugPage = async ({
  params,
}: OrderModeStoreSlugPageProps) => {
  const { mode } = await params;
  if (mode !== ORDER_MODE.Pickup) return notFound();

  return <OrderMenuContent />;
};

export default OrderModeStoreSlugPage;
