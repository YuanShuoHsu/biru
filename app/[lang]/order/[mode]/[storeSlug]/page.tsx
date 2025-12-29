import { notFound } from "next/navigation";

import OrderMenuContent from "@/components/OrderMenuContent";

import { ORDER_MODE } from "@/constants/orderMode";

import type { OrderMode } from "@/types/orderMode";
import type { StoreSlug } from "@/types/stores";

import { getStores } from "@/utils/stores";

interface OrderModeStoreSlugPageProps {
  params: Promise<{ mode: OrderMode; storeSlug: StoreSlug }>;
}

const OrderModeStoreSlugPage = async ({
  params,
}: OrderModeStoreSlugPageProps) => {
  const { mode, storeSlug } = await params;
  if (mode !== ORDER_MODE.Pickup) return notFound();

  const stores = await getStores();

  const store = stores.find(({ slug }) => slug === storeSlug);
  if (!store) return notFound();

  return <OrderMenuContent storeId={store.id} />;
};

export default OrderModeStoreSlugPage;
