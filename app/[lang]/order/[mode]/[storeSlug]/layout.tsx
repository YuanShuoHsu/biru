import { notFound } from "next/navigation";

import MenuSocketInitializer from "./MenuSocketInitializer";

import CartAnchorTemporaryDrawer from "@/components/CartAnchorTemporaryDrawer";

import { MenuStoreProvider } from "@/providers/menu-store-provider";

import type { StoreSlug } from "@/types/stores";

import { getMenus } from "@/utils/menus";
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

  const menus = await getMenus(store.id);

  return (
    <MenuStoreProvider menus={menus}>
      <MenuSocketInitializer storeId={store.id} />
      <CartAnchorTemporaryDrawer />
      {children}
    </MenuStoreProvider>
  );
};

export default OrderModeStoreSlugLayout;
