// vibe coding 未來要修正

import MyAccount from ".";

import type { Locale } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

interface MyAccountPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ redirectTo?: string }>;
}

const MyAccountPage = async ({ params, searchParams }: MyAccountPageProps) => {
  const [{ locale }, { redirectTo }] = await Promise.all([
    params,
    searchParams,
  ]);

  setRequestLocale(locale);

  const pathname = `/${locale}/account/my-account`;
  const currentURL = redirectTo
    ? `${pathname}?${new URLSearchParams({ redirectTo })}`
    : pathname;

  return <MyAccount currentURL={currentURL} locale={locale} />;
};

export default MyAccountPage;
