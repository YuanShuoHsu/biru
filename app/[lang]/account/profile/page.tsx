// vibe coding 未來要修正

import { SearchParams } from "next/dist/server/request/search-params";
import { notFound } from "next/navigation";

import AccountProfile from ".";

import { hasLocale } from "@/app/[lang]/dictionaries";

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

const AccountProfilePage = async ({
  params,
  searchParams,
}: PageProps<"/[lang]">) => {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const resolvedSearchParams = await searchParams;

  const pathname = `/${lang}/account/profile`;
  const search = toSearchString(resolvedSearchParams);
  const currentURL = search ? `${pathname}?${search}` : pathname;

  return <AccountProfile lang={lang} currentURL={currentURL} />;
};

export default AccountProfilePage;
