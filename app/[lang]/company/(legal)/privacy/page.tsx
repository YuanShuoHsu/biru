import CompanyLegalPrivacy from "./index";

import BackButton from "@/components/BackButton";

interface CompanyLegalPrivacyPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const CompanyLegalPrivacyPage = async ({
  params,
  searchParams,
}: CompanyLegalPrivacyPageProps) => {
  const { lang } = await params;
  const { back, redirect } = await searchParams;

  const safeBack =
    typeof back === "string" && back.startsWith("/") ? back : undefined;
  const safeRedirect = typeof redirect === "string" ? redirect : undefined;

  return (
    <>
      <BackButton back={safeBack} lang={lang} redirect={safeRedirect} />
      <CompanyLegalPrivacy lang={lang} />
    </>
  );
};

export default CompanyLegalPrivacyPage;
