// vibe coding 未來要修正

import AccountSettings from ".";

type SearchParams = { [key: string]: string | string[] | undefined };

interface MemberAccountSettingsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SearchParams>;
}

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

const MemberAccountSettingsPage = async ({
  params,
  searchParams,
}: MemberAccountSettingsPageProps) => {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;

  const pathname = `/${lang}/member/account-settings`;
  const search = toSearchString(resolvedSearchParams);
  const currentURL = search ? `${pathname}?${search}` : pathname;

  return <AccountSettings currentURL={currentURL} lang={lang} />;
};

export default MemberAccountSettingsPage;
