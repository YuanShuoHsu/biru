import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import type { Locale } from "@/i18n/routing";

import type { OrganizationResponse } from "@/types/organizations";
import type { WaitlistTicketDetailResponse } from "@/types/waitlist";

import { fetcher } from "@/utils/fetcher";

import WaitlistTicket from ".";

interface WaitlistTicketPageProps {
  params: Promise<{
    locale: Locale;
    organizationSlug: string;
    ticketId: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: WaitlistTicketPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const tWaitlist = await getTranslations({ locale, namespace: "waitlist" });

  return { title: tWaitlist("ticket.label") };
};

const WaitlistTicketPage = async ({ params }: WaitlistTicketPageProps) => {
  const { locale, organizationSlug, ticketId } = await params;

  setRequestLocale(locale);

  const [organization, ticket] = await Promise.all([
    fetcher<OrganizationResponse>(
      `/api/organizations/${organizationSlug}`,
    ).catch(() => null),
    fetcher<WaitlistTicketDetailResponse>(
      `/api/organizations/${organizationSlug}/waitlist/tickets/${ticketId}`,
    ).catch(() => null),
  ]);

  if (!organization || !ticket) notFound();

  return <WaitlistTicket organization={organization} ticket={ticket} />;
};

export default WaitlistTicketPage;
