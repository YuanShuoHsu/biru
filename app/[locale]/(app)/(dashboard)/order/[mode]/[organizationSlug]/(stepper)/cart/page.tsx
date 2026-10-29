import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import OrderModeOrganizationSlugCart from ".";

import ErrorAlert from "@/components/ErrorAlert";

import type { Locale } from "@/i18n/routing";

import { settle } from "@/utils/fetcher";
import { hasOrderAccess } from "@/utils/orderQrSession";
import { getOrganization, redirectToCurrentSlug } from "@/utils/organizations";

interface OrderModeOrganizationSlugCartPageProps {
  params: Promise<{ locale: Locale; mode: string; organizationSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
  searchParams,
}: OrderModeOrganizationSlugCartPageProps) => {
  const [{ mode, organizationSlug }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const { data: organization, error } = await settle(
    getOrganization(organizationSlug),
  );
  if (error?.status === 404) notFound();
  if (error) return <ErrorAlert />;

  await redirectToCurrentSlug(
    organization,
    organizationSlug,
    (slug) => `/order/${mode}/${slug}/cart`,
    query,
  );
  if (organization.closedAt) notFound();

  const { data: canOrder, error: accessError } = await settle(
    hasOrderAccess(organization.slug, mode, query.tableNumber),
  );
  if (accessError) return <ErrorAlert />;
  if (!canOrder) notFound();

  return <OrderModeOrganizationSlugCart />;
};

export default OrderModeOrganizationSlugCartPage;
