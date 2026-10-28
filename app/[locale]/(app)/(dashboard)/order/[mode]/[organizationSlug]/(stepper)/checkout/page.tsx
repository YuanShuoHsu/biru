import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import OrderModeOrganizationSlugCheckout from ".";

import type { Locale } from "@/i18n/routing";

import { hasOrderAccess } from "@/utils/orderQrSession";
import { getOrganization, redirectToCurrentSlug } from "@/utils/organizations";

interface OrderModeOrganizationSlugCheckoutPageProps {
  params: Promise<{ locale: Locale; mode: string; organizationSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
  searchParams,
}: OrderModeOrganizationSlugCheckoutPageProps) => {
  const [{ mode, organizationSlug }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const organization = await getOrganization(organizationSlug);
  await redirectToCurrentSlug(
    organization,
    organizationSlug,
    (slug) => `/order/${mode}/${slug}/checkout`,
    query,
  );
  if (!organization || organization.closedAt) return notFound();

  if (!(await hasOrderAccess(organization.slug, mode, query.tableNumber)))
    return notFound();

  return <OrderModeOrganizationSlugCheckout organization={organization} />;
};

export default OrderModeOrganizationSlugCheckoutPage;
