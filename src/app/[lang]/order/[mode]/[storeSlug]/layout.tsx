import { notFound } from "next/navigation";

import type { StoreSlug } from "@/types/stores";

import getStores from "@/utils/getStores";

interface OrderModeStoreSlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{ storeSlug: StoreSlug }>;
}

const OrderModeStoreSlugLayout = async ({
  children,
  params,
}: OrderModeStoreSlugLayoutProps) => {
  const { storeSlug } = await params;

  const data = await getStores();

  const hasStore = data.some(({ slug }) => slug === storeSlug);
  if (!hasStore) return notFound();

  return <>{children}</>;
};

export default OrderModeStoreSlugLayout;
