import { notFound } from "next/navigation";

import type { Store, StoreSlug } from "@/types/stores";

import { fetcher } from "@/utils/fetcher";

interface OrderModeStoreSlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{ storeSlug: StoreSlug }>;
}

const OrderModeStoreSlugLayout = async ({
  children,
  params,
}: OrderModeStoreSlugLayoutProps) => {
  const { storeSlug } = await params;

  const data = await fetcher<Store[]>(
    `${process.env.NEXT_PUBLIC_NEST_URL}/api/stores`,
  );

  const hasStore = data.some(({ slug }) => slug === storeSlug);
  if (!hasStore) return notFound();

  return <>{children}</>;
};

export default OrderModeStoreSlugLayout;
