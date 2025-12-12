import MemberAuthVerifyEmail from ".";

interface MemberAuthVerifyEmailPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const MemberAuthVerifyEmailPage = async ({
  params,
  searchParams,
}: MemberAuthVerifyEmailPageProps) => {
  const { lang } = await params;
  const { email, redirect } = await searchParams;

  const safeEmail = typeof email === "string" ? email : undefined;
  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return (
    <MemberAuthVerifyEmail
      email={safeEmail}
      lang={lang}
      redirect={safeRedirect}
    />
  );
};

export default MemberAuthVerifyEmailPage;
