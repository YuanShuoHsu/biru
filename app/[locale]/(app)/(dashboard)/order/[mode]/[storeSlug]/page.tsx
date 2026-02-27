import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import OrderMenuContent from "@/components/OrderMenuContent";

import { ORDER_MODE } from "@/constants/orderMode";

import type { Locale } from "@/i18n/routing";

import type { OrderMode } from "@/types/orderMode";
import type { StoreSlug } from "@/types/stores";

import { getStores } from "@/utils/stores";

interface OrderModeStoreSlugPageProps {
  params: Promise<{ locale: Locale; mode: OrderMode; storeSlug: StoreSlug }>;
}

const OrderModeStoreSlugPage = async ({
  params,
}: OrderModeStoreSlugPageProps) => {
  const { locale, mode, storeSlug } = await params;

  setRequestLocale(locale);

  if (mode !== ORDER_MODE.Pickup) return notFound();

  const stores = await getStores();

  const store = stores.find(({ slug }) => slug === storeSlug);
  if (!store) return notFound();

  return <OrderMenuContent />;
};

export default OrderModeStoreSlugPage;
