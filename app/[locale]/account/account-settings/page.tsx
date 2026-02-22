// vibe coding 未來要修正

import { setRequestLocale } from "next-intl/server";

import AccountSettings from ".";

import type { Locale } from "@/i18n/routing";

interface AccountAccountSettingsPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ redirectTo?: string }>;
}

const AccountAccountSettingsPage = async ({
  params,
  searchParams,
}: AccountAccountSettingsPageProps) => {
  const [{ locale }, { redirectTo }] = await Promise.all([params, searchParams]);

  setRequestLocale(locale);

  const pathname = `/${locale}/account/account-settings`;
  const currentURL = redirectTo
    ? `${pathname}?${new URLSearchParams({ redirectTo })}`
    : pathname;

  return <AccountSettings currentURL={currentURL} locale={locale} />;
};

export default AccountAccountSettingsPage;
