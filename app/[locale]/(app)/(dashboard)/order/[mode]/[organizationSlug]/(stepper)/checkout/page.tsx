import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import OrderModeOrganizationSlugCheckout from ".";

import type { Locale } from "@/i18n/routing";

import { getOrganization } from "@/utils/organizations";

interface OrderModeOrganizationSlugCheckoutPageProps {
  params: Promise<{ locale: Locale; organizationSlug: string }>;
}

export const generateMetadata = async ({
  params,
}: OrderModeOrganizationSlugCheckoutPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const tOrder = await getTranslations({ locale, namespace: "order" });

  return {
    title: tOrder("mode.storeSlug.tableNumber.stepper.checkout.label"),
  };
};

const OrderModeOrganizationSlugCheckoutPage = async ({
  params,
}: OrderModeOrganizationSlugCheckoutPageProps) => {
  const { organizationSlug } = await params;

  const organization = await getOrganization(organizationSlug);
  if (!organization || organization.closedAt) return notFound();

  return <OrderModeOrganizationSlugCheckout organization={organization} />;
};

export default OrderModeOrganizationSlugCheckoutPage;
