import { setRequestLocale } from "next-intl/server";

import About from ".";

import type { Locale } from "@/i18n/routing";

interface AboutPageProps {
  params: Promise<{ locale: Locale }>;
}

const AboutPage = async ({ params }: AboutPageProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  return <About locale={locale} />;
};

export default AboutPage;
