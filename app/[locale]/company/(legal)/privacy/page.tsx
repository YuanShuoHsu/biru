import { setRequestLocale } from "next-intl/server";

import CompanyLegalPrivacy from ".";

import BackButton from "@/components/BackButton";

import type { Locale } from "@/i18n/routing";

interface CompanyLegalPrivacyPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ back?: string; redirectTo?: string }>;
}

const CompanyLegalPrivacyPage = async ({
  params,
  searchParams,
}: CompanyLegalPrivacyPageProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

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
        locale={locale as Locale}
        redirectTo={safeRedirectTo}
      />
      <CompanyLegalPrivacy locale={locale} />
    </>
  );
};

export default CompanyLegalPrivacyPage;
