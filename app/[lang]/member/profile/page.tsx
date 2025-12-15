// vibe coding 未來要修正

import MemberProfile from ".";

type SearchParams = { [key: string]: string | string[] | undefined };

interface MemberProfilePageProps {
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

const MemberProfilePage = async ({
  params,
  searchParams,
}: MemberProfilePageProps) => {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;

  const pathname = `/${lang}/member/profile`;
  const search = toSearchString(resolvedSearchParams);
  const currentURL = search ? `${pathname}?${search}` : pathname;

  return <MemberProfile lang={lang} currentURL={currentURL} />;
};

export default MemberProfilePage;
