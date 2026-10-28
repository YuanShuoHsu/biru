import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import ErrorAlert from "@/components/ErrorAlert";

import type { Locale } from "@/i18n/routing";

import type { OrderBoardItem } from "@/types/orders";

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

  const { data: organization, error } = await settle(
    getOrganization(organizationSlug),
  );
  if (error?.status === 404) notFound();
  if (error) return <ErrorAlert />;

  await redirectToCurrentSlug(
    organization,
    organizationSlug,
    (slug) => `/order-board/${slug}`,
  );

  const { data: items, error: itemsError } = await settle(
    fetcher<OrderBoardItem[]>(
      `/api/organizations/${organizationSlug}/orders/board`,
    ),
  );
  if (itemsError) return <ErrorAlert />;

  return <OrderBoard items={items} organization={organization} />;
};

export default OrderBoardPage;
