import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import OrderModeOrganizationSlugCart from ".";

import type { Locale } from "@/i18n/routing";

import { getOrganization } from "@/utils/organizations";

interface OrderModeOrganizationSlugCartPageProps {
  params: Promise<{ locale: Locale; organizationSlug: string }>;
}

export const generateMetadata = async ({
  params,
}: OrderModeOrganizationSlugCartPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const tOrder = await getTranslations({ locale, namespace: "order" });

  return {
    title: tOrder("mode.storeSlug.tableNumber.stepper.cart.label"),
  };
};

const OrderModeOrganizationSlugCartPage = async ({
  params,
}: OrderModeOrganizationSlugCartPageProps) => {
  const { locale, organizationSlug } = await params;

  setRequestLocale(locale);

  const organization = await getOrganization(organizationSlug);
  if (!organization || organization.closedAt) notFound();

  return <OrderModeOrganizationSlugCart />;
};

export default OrderModeOrganizationSlugCartPage;
