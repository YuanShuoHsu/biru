import CompanyLegalPrivacy from "./index";

import BackButton from "@/components/BackButton";

import type { Locale } from "@/app/[lang]/dictionaries";

const CompanyLegalPrivacyPage = async ({
  params,
  searchParams,
}: PageProps<"/[lang]">) => {
  const { lang } = await params;
  const { back, redirectTo } = await searchParams;

  const safeBack =
    typeof back === "string" && back.startsWith("/") ? back : undefined;
  const safeRedirectTo =
    typeof redirectTo === "string" && redirectTo.startsWith("/")
      ? redirectTo
      : undefined;

  return (
    <>
      <BackButton
        back={safeBack}
        lang={lang as Locale}
        redirectTo={safeRedirectTo}
      />
      <CompanyLegalPrivacy lang={lang as Locale} />
    </>
  );
};

export default CompanyLegalPrivacyPage;
