import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

import type { Locale } from "@/i18n/routing";

import type { OrderReceiptResponse } from "@/types/orders";
import type { OrganizationResponse } from "@/types/organizations";

import { fetcher } from "@/utils/fetcher";
import { redirectToCurrentSlug } from "@/utils/organizations";

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

  const [order, organization] = await Promise.all([
    orderId
      ? fetcher<OrderReceiptResponse>(
          `/api/organizations/${organizationSlug}/orders/${orderId}${accessToken ? `?${new URLSearchParams({ accessToken })}` : ""}`,
          { headers: { cookie: reqHeaders.get("cookie") || "" } },
        ).catch(() => null)
      : null,
    fetcher<OrganizationResponse>(
      `/api/organizations/${organizationSlug}`,
    ).catch(() => null),
  ]);

  await redirectToCurrentSlug(
    organization,
    organizationSlug,
    (slug) => `/order/${mode}/${slug}/complete`,
    query,
  );

  return (
    <OrderModeOrganizationSlugComplete
      order={order}
      organization={organization}
    />
  );
};

export default OrderModeOrganizationSlugCompletePage;
