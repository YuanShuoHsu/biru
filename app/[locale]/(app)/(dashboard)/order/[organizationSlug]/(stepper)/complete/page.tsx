import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

import OrderOrganizationSlugComplete from ".";

interface OrderOrganizationSlugCompletePageProps {
  params: Promise<{ locale: Locale }>;
}

const OrderOrganizationSlugCompletePage = async ({
  params,
}: OrderOrganizationSlugCompletePageProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  return <OrderOrganizationSlugComplete />;
};

export default OrderOrganizationSlugCompletePage;
