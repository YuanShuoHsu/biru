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
