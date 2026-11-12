import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { StyledStack } from "./styled";

import ErrorAlert from "@/components/ErrorAlert";
import JsonLd from "@/components/JsonLd";
import LocationDetails from "@/components/LocationDetails";
import OrderMenuContent from "@/components/OrderMenuContent";
import OrderPartySizeTextField from "@/components/OrderPartySizeTextField";
import OrderPrepEstimateChip from "@/components/OrderPrepEstimateChip";
import OrderTableNumberChip from "@/components/OrderTableNumberChip";

import { API_ORDER_MODE, ORDER_MODE } from "@/constants/orderMode";
import { PARTY_SIZE_MAX } from "@/constants/partySize";

import type { Locale } from "@/i18n/routing";

import type { OrderMode } from "@/types/orderMode";
import type { FrequentItem, PrepEstimate } from "@/types/orders";
import type { Organization } from "@/types/organizations";

import { clientIpHeaders } from "@/utils/clientIp";
import { fetcher, settle } from "@/utils/fetcher";
import { buildCafeOrCoffeeShop } from "@/utils/jsonLd";
import { buildMetadata } from "@/utils/metadata";
import { hasOrderAccess } from "@/utils/orderQrSession";
import { getOrganization, redirectToCurrentSlug } from "@/utils/organizations";
import { getSession } from "@/utils/session";

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

const getFrequentItems = async (
  organizationSlug: Organization["slug"],
  mode: string,
): Promise<FrequentItem[]> => {
  const apiMode = API_ORDER_MODE[mode as OrderMode];
  if (!apiMode || !(await getSession())) return [];

  return fetcher<FrequentItem[]>(
    `/api/users/me/frequent-items?${new URLSearchParams({
      mode: apiMode,
      organizationSlug,
    })}`,
    {
      headers: {
        cookie: (await cookies()).toString(),
        ...(await clientIpHeaders()),
      },
    },
  ).catch(() => []);
};

const OrderModeOrganizationSlugPage = async ({
  params,
  searchParams,
}: OrderModeOrganizationSlugPageProps) => {
  const [{ locale, mode, organizationSlug }, query] = await Promise.all([
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

  const [{ data: canOrder, error: accessError }, prepEstimate, frequentItems] =
    await Promise.all([
      settle(hasOrderAccess(organization.slug, mode, tableNumber)),
      fetcher<PrepEstimate>(
        `/api/organizations/${organization.slug}/orders/prep-estimate`,
        { headers: await clientIpHeaders() },
      ).catch(() => null),
      getFrequentItems(organization.slug, mode),
    ]);
  if (accessError) return <ErrorAlert />;
  if (!canOrder) return notFound();

  const prepEstimateChip = (
    <OrderPrepEstimateChip
      initialEstimate={prepEstimate}
      organizationSlug={organization.slug}
    />
  );

  if (mode !== ORDER_MODE.DineIn)
    return (
      <>
        {mode === ORDER_MODE.Pickup && (
          <>
            <JsonLd data={buildCafeOrCoffeeShop(organization, locale)} />
            <LocationDetails organization={organization} showMap={false} />
          </>
        )}
        {prepEstimateChip}
        <OrderMenuContent frequentItems={frequentItems} />
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
      <OrderMenuContent frequentItems={frequentItems} />
    </>
  );
};

export default OrderModeOrganizationSlugPage;
