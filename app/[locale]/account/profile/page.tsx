// vibe coding 未來要修正

import { setRequestLocale } from "next-intl/server";

import AccountProfile from ".";

import type { Locale } from "@/i18n/routing";

interface AccountProfilePageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ redirectTo?: string }>;
}

const AccountProfilePage = async ({
  params,
  searchParams,
}: AccountProfilePageProps) => {
  const [{ locale }, { redirectTo }] = await Promise.all([
    params,
    searchParams,
  ]);

  setRequestLocale(locale);

  const pathname = `/${locale}/account/profile`;
  const currentURL = redirectTo
    ? `${pathname}?${new URLSearchParams({ redirectTo })}`
    : pathname;

  return <AccountProfile currentURL={currentURL} locale={locale} />;
};

export default AccountProfilePage;
