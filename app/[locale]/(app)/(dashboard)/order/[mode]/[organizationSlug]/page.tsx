import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { StyledStack } from "./styled";

import OrderMenuContent from "@/components/OrderMenuContent";
import OrderPartySizeTextField from "@/components/OrderPartySizeTextField";
import OrderPrepEstimateChip from "@/components/OrderPrepEstimateChip";
import OrderTableNumberChip from "@/components/OrderTableNumberChip";

import { ORDER_MODE } from "@/constants/orderMode";
import { PARTY_SIZE_MAX } from "@/constants/partySize";

import type { Locale } from "@/i18n/routing";

import type { PrepEstimate } from "@/types/orders";
import type { Organization } from "@/types/organizations";

import { fetcher } from "@/utils/fetcher";
import { buildMetadata } from "@/utils/metadata";
import { hasOrderAccess } from "@/utils/orderQrSession";
import { getOrganization, redirectToCurrentSlug } from "@/utils/organizations";

interface OrderModeOrganizationSlugPageProps {
  params: Promise<{
    locale: Locale;
    mode: string;
    organizationSlug: Organization["slug"];
  }>;
  searchParams: Promise<{
    partySize?: string;
    tableNumber?: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: OrderModeOrganizationSlugPageProps): Promise<Metadata> => {
  const { locale, mode, organizationSlug } = await params;

  const organization = await getOrganization(organizationSlug);
  if (!organization) return {};

  if (mode !== ORDER_MODE.Pickup)
    return { robots: { follow: true, index: false }, title: organization.name };

  const tMetadata = await getTranslations({ locale, namespace: "metadata" });

  return buildMetadata({
    description: tMetadata("organization.description", {
      name: organization.name,
    }),
    locale,
    pathname: `/order/${ORDER_MODE.Pickup}/${organizationSlug}`,
    title: organization.name,
  });
};

const OrderModeOrganizationSlugPage = async ({
  params,
  searchParams,
}: OrderModeOrganizationSlugPageProps) => {
  const [{ mode, organizationSlug }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const { partySize, tableNumber } = query;

  const organization = await getOrganization(organizationSlug);
  await redirectToCurrentSlug(
    organization,
    organizationSlug,
    (slug) => `/order/${mode}/${slug}`,
    query,
  );
  if (!organization || organization.closedAt) return notFound();

  const [hasAccess, prepEstimate] = await Promise.all([
    hasOrderAccess(organization.slug, mode, tableNumber),
    fetcher<PrepEstimate>(
      `/api/organizations/${organization.slug}/orders/prep-estimate`,
    ).catch(() => null),
  ]);
  if (!hasAccess) return notFound();

  const prepEstimateChip = (
    <OrderPrepEstimateChip
      initialEstimate={prepEstimate}
      organizationSlug={organization.slug}
    />
  );

  if (mode !== ORDER_MODE.DineIn)
    return (
      <>
        {prepEstimateChip}
        <OrderMenuContent />
      </>
    );

  const isValidTableNumber = !!tableNumber && /^[1-9]\d*$/.test(tableNumber);

  if (!isValidTableNumber) return notFound();

  if (!partySize) {
    return (
      <StyledStack direction="row">
        <OrderTableNumberChip tableNumber={tableNumber} />
        <OrderPartySizeTextField />
      </StyledStack>
    );
  }

  const partySizeNum = Number(partySize);
  const isValidPartySize =
    /^[1-9]\d*$/.test(partySize) &&
    partySizeNum >= 1 &&
    partySizeNum <= PARTY_SIZE_MAX;

  if (!isValidPartySize) return notFound();

  return (
    <>
      <StyledStack direction="row">
        <OrderTableNumberChip tableNumber={tableNumber} />
        <OrderPartySizeTextField partySize={partySize} />
        {prepEstimateChip}
      </StyledStack>
      <OrderMenuContent />
    </>
  );
};

export default OrderModeOrganizationSlugPage;
