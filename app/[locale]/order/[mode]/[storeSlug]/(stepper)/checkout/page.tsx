import { setRequestLocale } from "next-intl/server";

import OrderCheckoutContent from "@/components/OrderCheckoutContent";

import type { Locale } from "@/i18n/routing";

interface OrderModeStoreSlugCheckoutProps {
  params: Promise<{ locale: Locale; mode: string; storeSlug: string }>;
}

const OrderModeStoreSlugCheckout = async ({
  params,
}: OrderModeStoreSlugCheckoutProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  return <OrderCheckoutContent />;
};

export default OrderModeStoreSlugCheckout;
