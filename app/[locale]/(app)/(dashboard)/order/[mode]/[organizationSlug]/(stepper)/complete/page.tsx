import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import ErrorAlert from "@/components/ErrorAlert";

import type { Locale } from "@/i18n/routing";

import type { OrderReceiptResponse } from "@/types/orders";

import { fetcher, settle } from "@/utils/fetcher";
import { getOrganization, redirectToCurrentSlug } from "@/utils/organizations";

import OrderModeOrganizationSlugComplete from ".";

interface OrderModeOrganizationSlugCompletePageProps {
  params: Promise<{ locale: Locale; mode: string; organizationSlug: string }>;
  searchParams: Promise<{ accessToken?: string; orderId?: string }>;
}

export const generateMetadata = async ({
  params,
}: OrderModeOrganizationSlugCompletePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const tOrder = await getTranslations({ locale, namespace: "order" });

  return {
    title: tOrder("mode.storeSlug.tableNumber.stepper.complete.label"),
  };
};

const OrderModeOrganizationSlugCompletePage = async ({
  params,
  searchParams,
}: OrderModeOrganizationSlugCompletePageProps) => {
  const { mode, organizationSlug } = await params;
  const query = await searchParams;
  const { accessToken, orderId } = query;

  const reqHeaders = await headers();

  const [{ data: organization, error }, { data: order, error: orderError }] =
    await Promise.all([
      settle(getOrganization(organizationSlug)),
      orderId
        ? settle(
            fetcher<OrderReceiptResponse>(
              `/api/organizations/${organizationSlug}/orders/${orderId}${accessToken ? `?${new URLSearchParams({ accessToken })}` : ""}`,
              { headers: { cookie: reqHeaders.get("cookie") || "" } },
            ),
          )
        : { data: null, error: undefined },
    ]);
  if (error?.status === 404) notFound();
  if (error) return <ErrorAlert />;

  if (orderError && orderError.status !== 403 && orderError.status !== 404)
    return <ErrorAlert />;

  await redirectToCurrentSlug(
    organization,
    organizationSlug,
    (slug) => `/order/${mode}/${slug}/complete`,
    query,
  );

  return (
    <OrderModeOrganizationSlugComplete
      order={order ?? null}
      organization={organization}
    />
  );
};

export default OrderModeOrganizationSlugCompletePage;
