// vibe coding 未來要修正

import { notFound } from "next/navigation";

import AccountSettings from ".";

import { hasLocale } from "@/app/[lang]/dictionaries";

type SearchParams = { [key: string]: string | string[] | undefined };

const toSearchString = (searchParams: SearchParams) => {
  const urlSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      urlSearchParams.append(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        urlSearchParams.append(key, item);
      }
    }
  }

  return urlSearchParams.toString();
};

const AccountAccountSettingsPage = async ({
  params,
  searchParams,
}: PageProps<"/[lang]">) => {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const resolvedSearchParams = await searchParams;

  const pathname = `/${lang}/account/account-settings`;
  const search = toSearchString(resolvedSearchParams);
  const currentURL = search ? `${pathname}?${search}` : pathname;

  return <AccountSettings currentURL={currentURL} lang={lang} />;
};

export default AccountAccountSettingsPage;
