import AddAnotherAccount from ".";

interface AccountAddAnotherAccountPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const AccountAddAnotherAccountPage = async ({
  params,
  searchParams,
}: AccountAddAnotherAccountPageProps) => {
  const { lang } = await params;
  const { redirect } = await searchParams;

  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return <AddAnotherAccount lang={lang} redirect={safeRedirect} />;
};

export default AccountAddAnotherAccountPage;
