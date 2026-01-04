import CompanyLegalPrivacy from "./index";

import BackButton from "@/components/BackButton";

import type { Locale } from "@/app/[lang]/dictionaries";

const CompanyLegalPrivacyPage = async ({
  params,
  searchParams,
}: PageProps<"/[lang]">) => {
  const { lang } = await params;
  const { back, redirect } = await searchParams;

  const safeBack =
    typeof back === "string" && back.startsWith("/") ? back : undefined;
  const safeRedirect = typeof redirect === "string" ? redirect : undefined;

  return (
    <>
      <BackButton
        back={safeBack}
        lang={lang as Locale}
        redirect={safeRedirect}
      />
      <CompanyLegalPrivacy lang={lang as Locale} />
    </>
  );
};

export default CompanyLegalPrivacyPage;
