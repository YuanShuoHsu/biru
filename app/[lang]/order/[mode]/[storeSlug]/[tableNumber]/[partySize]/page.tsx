import { notFound } from "next/navigation";

import OrderMenuContent from "@/components/OrderMenuContent";

import type { StoreSlug } from "@/types/stores";

import { getStores } from "@/utils/stores";

interface OrderModeStoreSlugTableNumberPartySizePageProps {
  params: Promise<{ storeSlug: StoreSlug }>;
}

const OrderModeStoreSlugTableNumberPartySizePage = async ({
  params,
}: OrderModeStoreSlugTableNumberPartySizePageProps) => {
  const { storeSlug } = await params;

  const stores = await getStores();
  const store = stores.find(({ slug }) => slug === storeSlug);

  if (!store) return notFound();

  return <OrderMenuContent storeId={store.id} />;
};

export default OrderModeStoreSlugTableNumberPartySizePage;
