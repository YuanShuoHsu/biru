import { setRequestLocale } from "next-intl/server";

import OrderCompleteContent from "@/components/OrderCompleteContent";

import type { Locale } from "@/i18n/routing";

interface OrderModeStoreSlugTableNumberPartySizeCompleteProps {
  params: Promise<{ locale: Locale }>;
}

const OrderModeStoreSlugTableNumberPartySizeComplete = async ({
  params,
}: OrderModeStoreSlugTableNumberPartySizeCompleteProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  return <OrderCompleteContent />;
};

export default OrderModeStoreSlugTableNumberPartySizeComplete;
