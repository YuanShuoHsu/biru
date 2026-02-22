import { setRequestLocale } from "next-intl/server";

import OrderStepperLayout from "@/components/OrderStepperLayout";

import type { Locale } from "@/i18n/routing";

interface OrderModeStoreSlugStepperLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
    mode: string;
    storeSlug: string;
  }>;
}

const OrderModeStoreSlugStepperLayout = async ({
  children,
  params,
}: OrderModeStoreSlugStepperLayoutProps) => {
  const { locale } = await params;

  setRequestLocale(locale as Locale);

  return <OrderStepperLayout>{children}</OrderStepperLayout>;
};

export default OrderModeStoreSlugStepperLayout;
