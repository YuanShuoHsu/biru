import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import ErrorAlert from "@/components/ErrorAlert";
import OrderPrepEstimateChip from "@/components/OrderPrepEstimateChip";

import type { Locale } from "@/i18n/routing";

import type { OrderBoardItem, PrepEstimate } from "@/types/orders";

import { fetcher, settle } from "@/utils/fetcher";
import { getOrganization, redirectToCurrentSlug } from "@/utils/organizations";

import OrderBoard from ".";

interface OrderBoardPageProps {
  params: Promise<{ locale: Locale; organizationSlug: string }>;
}

export const generateMetadata = async ({
  params,
}: OrderBoardPageProps): Promise<Metadata> => {
  const { locale, organizationSlug } = await params;
  const [tOrder, { data: organization }] = await Promise.all([
    getTranslations({ locale, namespace: "order" }),
    settle(getOrganization(organizationSlug)),
  ]);

  return {
    title: tOrder("board.title", {
      organizationName: organization?.name || organizationSlug,
    }),
  };
};

const OrderBoardPage = async ({ params }: OrderBoardPageProps) => {
  const { organizationSlug } = await params;

  const [
    { data: organization, error },
    { data: items, error: itemsError },
    prepEstimate,
  ] = await Promise.all([
    settle(getOrganization(organizationSlug)),
    settle(
      fetcher<OrderBoardItem[]>(
        `/api/organizations/${organizationSlug}/orders/board`,
      ),
    ),
    fetcher<PrepEstimate>(
      `/api/organizations/${organizationSlug}/orders/prep-estimate`,
    ).catch(() => null),
  ]);
  if (error?.status === 404) notFound();
  if (error) return <ErrorAlert />;

  await redirectToCurrentSlug(
    organization,
    organizationSlug,
    (slug) => `/order-board/${slug}`,
  );

  if (itemsError) return <ErrorAlert />;

  return (
    <>
      <OrderPrepEstimateChip
        initialEstimate={prepEstimate}
        organizationSlug={organization.slug}
      />
      <OrderBoard items={items} organization={organization} />
    </>
  );
};

export default OrderBoardPage;
