import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import ErrorAlert from "@/components/ErrorAlert";

import type { Locale } from "@/i18n/routing";

import type { WaitlistStatusResponse } from "@/types/waitlist";

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

  const [{ data: organization, error }, { data: status, error: statusError }] =
    await Promise.all([
      settle(getOrganization(organizationSlug)),
      settle(
        fetcher<WaitlistStatusResponse>(
          `/api/organizations/${organizationSlug}/waitlist`,
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
  if (statusError) return <ErrorAlert />;

  return <Waitlist organization={organization} status={status} />;
};

export default WaitlistPage;
