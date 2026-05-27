import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import HorizontalLinearStepper from "@/components/HorizontalLinearStepper";

import { routing } from "@/i18n/routing";

interface OrderOrganizationSlugStepperLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
    organizationSlug: string;
  }>;
}

const OrderOrganizationSlugStepperLayout = async ({
  children,
  params,
}: OrderOrganizationSlugStepperLayoutProps) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <>
      <HorizontalLinearStepper />
      {children}
    </>
  );
};

export default OrderOrganizationSlugStepperLayout;
