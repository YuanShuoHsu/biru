import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { StyledStack } from "./styled";

import ErrorAlert from "@/components/ErrorAlert";
import OrderMenuContent from "@/components/OrderMenuContent";
import OrderPartySizeTextField from "@/components/OrderPartySizeTextField";
import OrderTableNumberChip from "@/components/OrderTableNumberChip";

import { ORDER_MODE } from "@/constants/orderMode";
import { PARTY_SIZE_MAX } from "@/constants/partySize";

import type { Locale } from "@/i18n/routing";

import type { Organization } from "@/types/organizations";

import { settle } from "@/utils/fetcher";
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

  const { data: organization } = await settle(
    getOrganization(organizationSlug),
  );
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

  const { data: organization, error } = await settle(
    getOrganization(organizationSlug),
  );
  if (error?.status === 404) notFound();
  if (error) return <ErrorAlert />;

  await redirectToCurrentSlug(
    organization,
    organizationSlug,
    (slug) => `/order/${mode}/${slug}`,
    query,
  );
  if (organization.closedAt) return notFound();

  const { data: canOrder, error: accessError } = await settle(
    hasOrderAccess(organization.slug, mode, tableNumber),
  );
  if (accessError) return <ErrorAlert />;
  if (!canOrder) return notFound();

  if (mode !== ORDER_MODE.DineIn) return <OrderMenuContent />;

  const isValidTableNumber = !!tableNumber && /^[1-9]\d*$/.test(tableNumber);

  if (!isValidTableNumber) return notFound();

  if (!partySize) {
    return (
      <StyledStack direction="row">
        <OrderTableNumberChip tableNumber={tableNumber} />
        <OrderPartySizeTextField organizationSlug={organizationSlug} />
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
        <OrderPartySizeTextField
          organizationSlug={organizationSlug}
          partySize={partySize}
        />
      </StyledStack>
      <OrderMenuContent />
    </>
  );
};

export default OrderModeOrganizationSlugPage;
