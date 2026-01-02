// vibe coding 未來要修正

import { SearchParams } from "next/dist/server/request/search-params";

import MyAccount from ".";

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

interface AccountMyAccountPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const AccountMyAccountPage = async ({
  params,
  searchParams,
}: AccountMyAccountPageProps) => {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;

  const pathname = `/${lang}/account/my-account`;
  const search = toSearchString(resolvedSearchParams);
  const currentURL = search ? `${pathname}?${search}` : pathname;

  return <MyAccount currentURL={currentURL} lang={lang} />;
};

export default AccountMyAccountPage;
