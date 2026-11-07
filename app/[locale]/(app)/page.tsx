import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Home from ".";

import type { Locale } from "@/i18n/routing";

import { getBanners } from "@/utils/banners";
import { settle } from "@/utils/fetcher";
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

const HomePage = async () => {
  const [{ data: banners = [] }, { data: organizations = [] }] =
    await Promise.all([settle(getBanners()), settle(getOrganizations())]);

  return (
    <Home
      banners={banners}
      organizations={organizations.filter(({ closedAt }) => !closedAt)}
    />
  );
};

export default HomePage;
