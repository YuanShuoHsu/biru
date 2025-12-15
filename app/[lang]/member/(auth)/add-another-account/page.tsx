import AddAnotherAccount from ".";

type SearchParams = { [key: string]: string | string[] | undefined };

interface MemberAddAnotherAccountPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SearchParams>;
}

const MemberAddAnotherAccountPage = async ({
  params,
  searchParams,
}: MemberAddAnotherAccountPageProps) => {
  const { lang } = await params;
  const { redirect } = await searchParams;

  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return <AddAnotherAccount lang={lang} redirect={safeRedirect} />;
};

export default MemberAddAnotherAccountPage;

