import BackButton from "../BackButton";
import MemberLegalTerms from "./index";

interface MemberLegalTermsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const MemberLegalTermsPage = async ({
  params,
  searchParams,
}: MemberLegalTermsPageProps) => {
  const { lang } = await params;
  const { redirect } = await searchParams;

  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return (
    <>
      <BackButton lang={lang} redirect={safeRedirect} />{" "}
      <MemberLegalTerms lang={lang} />;
    </>
  );
};

export default MemberLegalTermsPage;
