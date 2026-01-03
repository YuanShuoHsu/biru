import { notFound } from "next/navigation";

import MenuSocketInitializer from "./MenuSocketInitializer";

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

  const store = stores.find(({ slug }) => slug === storeSlug);
  if (!store) return notFound();

  return (
    <>
      <MenuSocketInitializer storeId={store.id} />
      {children}
    </>
  );
};

export default OrderModeStoreSlugLayout;
