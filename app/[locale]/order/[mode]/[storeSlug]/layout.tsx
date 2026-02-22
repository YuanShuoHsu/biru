import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import MenuSocketInitializer from "./MenuSocketInitializer";

import CartAnchorTemporaryDrawer from "@/components/CartAnchorTemporaryDrawer";

import type { Locale } from "@/i18n/routing";

import { MenuStoreProvider } from "@/providers/menu-store-provider";

import { getMenus } from "@/utils/menus";
import { getStores } from "@/utils/stores";

interface OrderModeStoreSlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
    mode: string;
    storeSlug: string;
  }>;
}

const OrderModeStoreSlugLayout = async ({
  children,
  params,
}: OrderModeStoreSlugLayoutProps) => {
  const { locale, storeSlug } = await params;

  setRequestLocale(locale as Locale);

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
