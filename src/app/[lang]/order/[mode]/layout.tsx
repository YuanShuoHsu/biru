import { notFound } from "next/navigation";

import { ORDER_MODE, type OrderMode } from "@/types/orderMode";

interface OrderModeLayoutProps {
  children: React.ReactNode;
  params: Promise<{ mode: OrderMode }>;
}

const OrderModeLayout = async ({ children, params }: OrderModeLayoutProps) => {
  const { mode } = await params;

  const isOrderMode = mode === ORDER_MODE.DineIn || mode === ORDER_MODE.Pickup;
  if (!isOrderMode) return notFound();

  return <>{children}</>;
};

export default OrderModeLayout;
