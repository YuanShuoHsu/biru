import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Home from ".";

import JsonLd from "@/components/JsonLd";

import type { Locale } from "@/i18n/routing";

import { getBanners } from "@/utils/banners";
import { settle } from "@/utils/fetcher";
import { buildOrganization } from "@/utils/jsonLd";
import { buildMetadata } from "@/utils/metadata";
import { getOrganizations } from "@/utils/organizations";

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export const generateMetadata = async ({
  params,
}: HomePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const tMetadata = await getTranslations({ locale, namespace: "metadata" });

  return buildMetadata({
    description: tMetadata("home.description"),
    locale,
    pathname: "",
    title: tMetadata("home.title"),
    titleAbsolute: true,
  });
};

const HomePage = async ({ params }: HomePageProps) => {
  const [{ locale }, { data: banners = [] }, { data: organizations = [] }] =
    await Promise.all([
      params,
      settle(getBanners()),
      settle(getOrganizations()),
    ]);

  return (
    <>
      <JsonLd data={buildOrganization(locale)} />
      <Home
        banners={banners}
        organizations={organizations.filter(({ closedAt }) => !closedAt)}
      />
    </>
  );
};

export default HomePage;
