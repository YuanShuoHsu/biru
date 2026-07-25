import { setRequestLocale } from "next-intl/server";

import Home from ".";

import type { Locale } from "@/i18n/routing";

import { getBanners } from "@/utils/banners";

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  const banners = await getBanners();

  return <Home banners={banners} />;
};

export default HomePage;
