import { notFound } from "next/navigation";

import OrderModePickupStoreIdSelect from "@/components/OrderModePickupStoreIdSelect";

import { ORDER_MODE, type OrderMode } from "@/types/orderMode";

import { fetcher } from "@/utils/fetcher";

interface OrderModePageProps {
  params: Promise<{ mode: OrderMode }>;
}

const OrderModePage = async ({ params }: OrderModePageProps) => {
  const { mode } = await params;
  if (mode !== ORDER_MODE.Pickup) return notFound();

  const data = await fetcher(`${process.env.NEXT_PUBLIC_NEST_URL}/api/stores`);

  return <OrderModePickupStoreIdSelect data={data} />;
};

export default OrderModePage;
