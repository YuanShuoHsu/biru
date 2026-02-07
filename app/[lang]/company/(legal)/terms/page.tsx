import { notFound } from "next/navigation";

import CompanyLegalTerms from "./index";

import { hasLocale } from "@/app/[lang]/dictionaries";

import BackButton from "@/components/BackButton";

const CompanyLegalTermsPage = async ({
  params,
  searchParams,
}: PageProps<"/[lang]">) => {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const { back, redirectTo } = await searchParams;

  const safeBack =
    typeof back === "string" && back.startsWith("/") ? back : undefined;
  const safeRedirectTo =
    typeof redirectTo === "string" && redirectTo.startsWith("/")
      ? redirectTo
      : undefined;

  return (
    <>
      <BackButton back={safeBack} lang={lang} redirectTo={safeRedirectTo} />
      <CompanyLegalTerms lang={lang} />
    </>
  );
};

export default CompanyLegalTermsPage;
