import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import OrderStepperLayout from "@/components/OrderStepperLayout";

import { routing } from "@/i18n/routing";

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
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return <OrderStepperLayout>{children}</OrderStepperLayout>;
};

export default OrderModeStoreSlugStepperLayout;
