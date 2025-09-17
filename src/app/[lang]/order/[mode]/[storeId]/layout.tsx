import { notFound } from "next/navigation";

import type { StoreId } from "@/types/stores";

import { stores } from "@/utils/stores";

interface OrderModeStoreIdLayoutProps {
  children: React.ReactNode;
  params: Promise<{ storeId: StoreId }>;
}

const OrderModeStoreIdLayout = async ({
  children,
  params,
}: OrderModeStoreIdLayoutProps) => {
  const { storeId } = await params;

  const hasStore = stores.some(({ id }) => id === storeId);
  if (!hasStore) return notFound();

  return <>{children}</>;
};

export default OrderModeStoreIdLayout;
