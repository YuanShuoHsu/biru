import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import About from ".";

import ErrorAlert from "@/components/ErrorAlert";

import type { Locale } from "@/i18n/routing";

import { settle } from "@/utils/fetcher";
import { buildMetadata } from "@/utils/metadata";
import { getOrganizations, getOrganizationTeam } from "@/utils/organizations";
import { getStorePhotos } from "@/utils/storePhotos";

interface AboutPageProps {
  params: Promise<{ locale: Locale }>;
}

export const generateMetadata = async ({
  params,
}: AboutPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const tCompany = await getTranslations({ locale, namespace: "company" });
  const tMetadata = await getTranslations({ locale, namespace: "metadata" });

  return buildMetadata({
    description: tMetadata("about.description"),
    locale,
    pathname: "/company/about",
    title: tCompany("about.label"),
  });
};

const AboutPage = async ({ params }: AboutPageProps) => {
  const { locale } = await params;
  const [{ data: organizations, error }, storePhotos] = await Promise.all([
    settle(getOrganizations()),
    getStorePhotos(locale),
  ]);
  if (error) return <ErrorAlert />;

  const teamResults = await Promise.all(
    organizations.map(
      async ({ id, slug }) =>
        [id, await settle(getOrganizationTeam(slug))] as const,
    ),
  );
  if (teamResults.some(([, result]) => result.error)) return <ErrorAlert />;

  const organizationTeams = Object.fromEntries(
    teamResults.map(([id, { data = [] }]) => [id, data]),
  );

  return (
    <About
      organizations={organizations}
      organizationTeams={organizationTeams}
      storePhotos={storePhotos}
    />
  );
};

export default AboutPage;
