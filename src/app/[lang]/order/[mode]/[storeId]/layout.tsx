import { notFound } from "next/navigation";

import type { Store, StoreId } from "@/types/stores";

import { fetcher } from "@/utils/fetcher";

interface OrderModeStoreIdLayoutProps {
  children: React.ReactNode;
  params: Promise<{ storeId: StoreId }>;
}

const OrderModeStoreIdLayout = async ({
  children,
  params,
}: OrderModeStoreIdLayoutProps) => {
  const { storeId } = await params;

  const data = await fetcher<Store[]>(
    `${process.env.NEXT_PUBLIC_NEST_URL}/api/stores`,
  );

  const hasStore = data.some(({ id }) => id === storeId);
  if (!hasStore) return notFound();

  return <>{children}</>;
};

export default OrderModeStoreIdLayout;
