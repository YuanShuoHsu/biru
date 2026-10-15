import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import About from ".";

import type { Locale } from "@/i18n/routing";

import { buildMetadata } from "@/utils/metadata";
import { getOrganizations } from "@/utils/organizations";

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

const AboutPage = async () => {
  const organizations = await getOrganizations();

  return <About organizations={organizations} />;
};

export default AboutPage;
