import CompanyLegalTerms from "./index";

import BackButton from "@/components/BackButton";

interface CompanyLegalTermsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const CompanyLegalTermsPage = async ({
  params,
  searchParams,
}: CompanyLegalTermsPageProps) => {
  const { lang } = await params;
  const { back, redirect } = await searchParams;

  const safeBack =
    typeof back === "string" && back.startsWith("/") ? back : undefined;
  const safeRedirect = typeof redirect === "string" ? redirect : undefined;

  return (
    <>
      <BackButton back={safeBack} lang={lang} redirect={safeRedirect} />
      <CompanyLegalTerms lang={lang} />
    </>
  );
};

export default CompanyLegalTermsPage;
