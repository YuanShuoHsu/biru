import AddAnotherAccount from ".";

interface MemberAddAnotherAccountPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
