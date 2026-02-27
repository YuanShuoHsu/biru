import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import MainDashboardHeader from ".";

import { routing } from "@/i18n/routing";

const MainDashboardLayout = async ({
  children,
  params,
}: LayoutProps<"/[locale]">) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <>
      <MainDashboardHeader />
      {children}
    </>
  );
};

export default MainDashboardLayout;
