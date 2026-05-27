import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

import OrderOrganizationSlugCheckout from ".";

interface OrderOrganizationSlugCheckoutPageProps {
  params: Promise<{ locale: Locale; organizationSlug: string }>;
}

const OrderOrganizationSlugCheckoutPage = async ({
  params,
}: OrderOrganizationSlugCheckoutPageProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  return <OrderOrganizationSlugCheckout />;
};

export default OrderOrganizationSlugCheckoutPage;
