import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import type { Locale } from "@/i18n/routing";

import type { OrganizationResponse } from "@/types/organizations";
import type { WaitlistStatusResponse } from "@/types/waitlist";

import { fetcher } from "@/utils/fetcher";

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
  const { locale, organizationSlug } = await params;

  setRequestLocale(locale);

  const [organization, status] = await Promise.all([
    fetcher<OrganizationResponse>(
      `/api/organizations/${organizationSlug}`,
    ).catch(() => null),
    fetcher<WaitlistStatusResponse>(
      `/api/organizations/${organizationSlug}/waitlist`,
    ).catch(() => null),
  ]);

  if (!organization || !status) notFound();

  return <Waitlist organization={organization} status={status} />;
};

export default WaitlistPage;
