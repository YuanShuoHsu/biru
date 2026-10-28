import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import type { Locale } from "@/i18n/routing";

import type { OrganizationResponse } from "@/types/organizations";
import type {
  WaitlistQrSessionResponse,
  WaitlistStatusResponse,
} from "@/types/waitlist";

import { fetcher } from "@/utils/fetcher";
import { redirectToCurrentSlug } from "@/utils/organizations";

import Waitlist from ".";

interface WaitlistPageProps {
  params: Promise<{ locale: Locale; organizationSlug: string }>;
}

export const generateMetadata = async ({
  params,
}: WaitlistPageProps): Promise<Metadata> => {
  const { locale, organizationSlug } = await params;
  const [tWaitlist, organization] = await Promise.all([
    getTranslations({ locale, namespace: "waitlist" }),
    fetcher<OrganizationResponse>(
      `/api/organizations/${organizationSlug}`,
    ).catch(() => null),
  ]);

  return {
    title: tWaitlist("title", {
      organizationName: organization?.name || organizationSlug,
    }),
  };
};

const WaitlistPage = async ({ params }: WaitlistPageProps) => {
  const { organizationSlug } = await params;
  const cookieStore = await cookies();

  const [organization, status, qrSession] = await Promise.all([
    fetcher<OrganizationResponse>(
      `/api/organizations/${organizationSlug}`,
    ).catch(() => null),
    fetcher<WaitlistStatusResponse>(
      `/api/organizations/${organizationSlug}/waitlist`,
    ).catch(() => null),
    fetcher<WaitlistQrSessionResponse>(
      `/api/organizations/${organizationSlug}/waitlist/qr-session`,
      { headers: { cookie: cookieStore.toString() } },
    ).catch(() => null),
  ]);

  await redirectToCurrentSlug(
    organization,
    organizationSlug,
    (slug) => `/waitlist/${slug}`,
  );

  if (!organization || organization.closedAt || !status) notFound();

  return (
    <Waitlist
      hasQrSession={!!qrSession}
      organization={organization}
      status={status}
    />
  );
};

export default WaitlistPage;
