import MemberLegalTerms from "./index";

import BackButton from "@/components/BackButton";

interface MemberLegalTermsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const MemberLegalTermsPage = async ({
  params,
  searchParams,
}: MemberLegalTermsPageProps) => {
  const { lang } = await params;
  const { back, redirect } = await searchParams;

  const safeBack =
    typeof back === "string" && back.startsWith("/") ? back : undefined;
  const safeRedirect = typeof redirect === "string" ? redirect : undefined;

  return (
    <>
      <BackButton back={safeBack} lang={lang} redirect={safeRedirect} />
      <MemberLegalTerms lang={lang} />
    </>
  );
};

export default MemberLegalTermsPage;
