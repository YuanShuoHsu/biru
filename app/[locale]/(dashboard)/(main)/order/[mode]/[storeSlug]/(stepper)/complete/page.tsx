import { setRequestLocale } from "next-intl/server";

import OrderCompleteContent from "@/components/OrderCompleteContent";

import type { Locale } from "@/i18n/routing";

interface OrderModeStoreSlugCompleteProps {
  params: Promise<{ locale: Locale }>;
}

const OrderModeStoreSlugComplete = async ({
  params,
}: OrderModeStoreSlugCompleteProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  return <OrderCompleteContent />;
};

export default OrderModeStoreSlugComplete;
