import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import ShellLayout from "@/components/AppLayout";

import { routing } from "@/i18n/routing";

const AppLayout = async ({ children, params }: LayoutProps<"/[locale]">) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return <ShellLayout>{children}</ShellLayout>;
};

export default AppLayout;
