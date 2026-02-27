import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import OrderStepperLayout from "@/components/OrderStepperLayout";

import { routing } from "@/i18n/routing";

const OrderModeStoreSlugTableNumberStepperLayout = async ({
  children,
  params,
}: LayoutProps<"/[locale]">) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return <OrderStepperLayout>{children}</OrderStepperLayout>;
};

export default OrderModeStoreSlugTableNumberStepperLayout;
