import { setRequestLocale } from "next-intl/server";

import OrderCheckoutContent from "@/components/OrderCheckoutContent";

import type { Locale } from "@/i18n/routing";

interface OrderModeStoreSlugTableNumberPartySizeCheckoutProps {
  params: Promise<{ locale: Locale; mode: string; storeSlug: string }>;
}

const OrderModeStoreSlugTableNumberPartySizeCheckout = async ({
  params,
}: OrderModeStoreSlugTableNumberPartySizeCheckoutProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  return <OrderCheckoutContent />;
};

export default OrderModeStoreSlugTableNumberPartySizeCheckout;
