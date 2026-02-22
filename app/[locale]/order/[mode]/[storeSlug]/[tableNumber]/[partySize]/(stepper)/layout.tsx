import { setRequestLocale } from "next-intl/server";

import OrderStepperLayout from "@/components/OrderStepperLayout";

import type { Locale } from "@/i18n/routing";

interface OrderModeStoreSlugTableNumberStepperLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
    mode: string;
    storeSlug: string;
    tableNumber: string;
    partySize: string;
  }>;
}

const OrderModeStoreSlugTableNumberStepperLayout = async ({
  children,
  params,
}: OrderModeStoreSlugTableNumberStepperLayoutProps) => {
  const { locale } = await params;

  setRequestLocale(locale as Locale);

  return <OrderStepperLayout>{children}</OrderStepperLayout>;
};

export default OrderModeStoreSlugTableNumberStepperLayout;
