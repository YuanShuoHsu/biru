import { notFound } from "next/navigation";

import type { StoreSlug } from "@/types/stores";

import { getStores } from "@/utils/stores";

interface OrderModeStoreSlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{ storeSlug: StoreSlug }>;
}

const OrderModeStoreSlugLayout = async ({
  children,
  params,
}: OrderModeStoreSlugLayoutProps) => {
  const { storeSlug } = await params;

  const stores = await getStores();

  const hasStore = stores.some(({ slug }) => slug === storeSlug);
  if (!hasStore) return notFound();

  return <>{children}</>;
};

export default OrderModeStoreSlugLayout;
