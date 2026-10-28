import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import ErrorAlert from "@/components/ErrorAlert";

import type { Locale } from "@/i18n/routing";

import type { WaitlistTicketDetailResponse } from "@/types/waitlist";

import { fetcher, settle } from "@/utils/fetcher";
import { getOrganization, redirectToCurrentSlug } from "@/utils/organizations";

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
  const { organizationSlug, ticketId } = await params;

  const [{ data: organization, error }, { data: ticket, error: ticketError }] =
    await Promise.all([
      settle(getOrganization(organizationSlug)),
      settle(
        fetcher<WaitlistTicketDetailResponse>(
          `/api/organizations/${organizationSlug}/waitlist/tickets/${ticketId}`,
        ),
      ),
    ]);
  if (error?.status === 404) notFound();
  if (error) return <ErrorAlert />;

  await redirectToCurrentSlug(
    organization,
    organizationSlug,
    (slug) => `/waitlist/${slug}/${ticketId}`,
  );

  if (ticketError?.status === 404) notFound();
  if (ticketError) return <ErrorAlert />;

  return <WaitlistTicket organization={organization} ticket={ticket} />;
};

export default WaitlistTicketPage;
