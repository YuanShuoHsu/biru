import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import type { Locale } from "@/i18n/routing";

import type { OrderBoardItem } from "@/types/orders";
import type { OrganizationResponse } from "@/types/organizations";

import { fetcher } from "@/utils/fetcher";
import { redirectToCurrentSlug } from "@/utils/organizations";

import OrderBoard from ".";

interface OrderBoardPageProps {
  params: Promise<{ locale: Locale; organizationSlug: string }>;
}

export const generateMetadata = async ({
  params,
}: OrderBoardPageProps): Promise<Metadata> => {
  const { locale, organizationSlug } = await params;
  const [tOrder, organization] = await Promise.all([
    getTranslations({ locale, namespace: "order" }),
    fetcher<OrganizationResponse>(
      `/api/organizations/${organizationSlug}`,
    ).catch(() => null),
  ]);

  return {
    title: tOrder("board.title", {
      organizationName: organization?.name || organizationSlug,
    }),
  };
};

const OrderBoardPage = async ({ params }: OrderBoardPageProps) => {
  const { organizationSlug } = await params;

  const organization = await fetcher<OrganizationResponse>(
    `/api/organizations/${organizationSlug}`,
  ).catch(() => null);

  await redirectToCurrentSlug(
    organization,
    organizationSlug,
    (slug) => `/order-board/${slug}`,
  );

  if (!organization) notFound();

  const items = await fetcher<OrderBoardItem[]>(
    `/api/organizations/${organizationSlug}/orders/board`,
  ).catch(() => []);

  return <OrderBoard items={items} organization={organization} />;
};

export default OrderBoardPage;
