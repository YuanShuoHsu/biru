import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import ErrorAlert from "@/components/ErrorAlert";

import type { Locale } from "@/i18n/routing";

import type {
  WaitlistQrSessionResponse,
  WaitlistStatusResponse,
} from "@/types/waitlist";

import { fetcher, settle } from "@/utils/fetcher";
import { getOrganization, redirectToCurrentSlug } from "@/utils/organizations";

import Waitlist from ".";

interface WaitlistPageProps {
  params: Promise<{ locale: Locale; organizationSlug: string }>;
}

export const generateMetadata = async ({
  params,
}: WaitlistPageProps): Promise<Metadata> => {
  const { locale, organizationSlug } = await params;
  const [tWaitlist, { data: organization }] = await Promise.all([
    getTranslations({ locale, namespace: "waitlist" }),
    settle(getOrganization(organizationSlug)),
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

  const [
    { data: organization, error },
    { data: status, error: statusError },
    { data: qrSession, error: qrSessionError },
  ] = await Promise.all([
    settle(getOrganization(organizationSlug)),
    settle(
      fetcher<WaitlistStatusResponse>(
        `/api/organizations/${organizationSlug}/waitlist`,
      ),
    ),
    settle(
      fetcher<WaitlistQrSessionResponse>(
        `/api/organizations/${organizationSlug}/waitlist/qr-session`,
        { headers: { cookie: cookieStore.toString() } },
      ),
    ),
  ]);
  if (error?.status === 404) notFound();
  if (error) return <ErrorAlert />;

  await redirectToCurrentSlug(
    organization,
    organizationSlug,
    (slug) => `/waitlist/${slug}`,
  );

  if (organization.closedAt || statusError?.status === 404) notFound();
  if (statusError || (qrSessionError && qrSessionError.status !== 404))
    return <ErrorAlert />;

  return (
    <Waitlist
      hasQrSession={!!qrSession}
      organization={organization}
      status={status}
    />
  );
};

export default WaitlistPage;
