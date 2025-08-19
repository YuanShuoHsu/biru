import { notFound } from "next/navigation";

import type { StoreValue } from "@/types/stores";

import { stores } from "@/utils/stores";

interface OrderStoreLayoutProps {
  children: React.ReactNode;
  params: Promise<{ store: StoreValue }>;
}

const OrderStoreLayout = async ({
  children,
  params,
}: OrderStoreLayoutProps) => {
  const { store } = await params;

  const hasStore = stores.some(({ value }) => value === store);
  if (!hasStore) return notFound();

  return <>{children}</>;
};

export default OrderStoreLayout;
