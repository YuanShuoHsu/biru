import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Home from ".";

import type { Locale } from "@/i18n/routing";

import { getBanners } from "@/utils/banners";
import { buildMetadata } from "@/utils/metadata";

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export const generateMetadata = async ({
  params,
}: HomePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return buildMetadata({
    description: t("home.description"),
    locale,
    pathname: "",
    title: t("home.title"),
    titleAbsolute: true,
  });
};

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  const banners = await getBanners();

  return <Home banners={banners} />;
};

export default HomePage;
