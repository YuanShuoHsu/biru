import { notFound } from "next/navigation";

import type { OrderMode } from "@/types/orderMode";

interface OrderModeLayoutProps {
  children: React.ReactNode;
  params: Promise<{ mode: OrderMode }>;
}

const OrderModeLayout = async ({ children, params }: OrderModeLayoutProps) => {
  const { mode } = await params;

  const isValidMode = mode === "dine-in" || mode === "pickup";
  if (!isValidMode) return notFound();

  return <>{children}</>;
};

export default OrderModeLayout;
