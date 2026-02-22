import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import OrderMenuContent from "@/components/OrderMenuContent";

import type { Locale } from "@/i18n/routing";

import type { StoreSlug } from "@/types/stores";

import { getStores } from "@/utils/stores";

interface OrderModeStoreSlugTableNumberPartySizePageProps {
  params: Promise<{ locale: Locale; storeSlug: StoreSlug }>;
}

const OrderModeStoreSlugTableNumberPartySizePage = async ({
  params,
}: OrderModeStoreSlugTableNumberPartySizePageProps) => {
  const { locale, storeSlug } = await params;

  setRequestLocale(locale);

  const stores = await getStores();
  const store = stores.find(({ slug }) => slug === storeSlug);

  if (!store) return notFound();

  return <OrderMenuContent />;
};

export default OrderModeStoreSlugTableNumberPartySizePage;
