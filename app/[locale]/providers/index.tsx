import { NextIntlClientProvider } from "next-intl";
import { SWRConfiguration } from "swr";

import ClientProviders from "./client";

import type { Locale } from "@/i18n/routing";

interface ProvidersProps {
  children: React.ReactNode;
  fallback: SWRConfiguration["fallback"];
  locale: Locale;
}

const Providers = ({ children, fallback, locale }: ProvidersProps) => (
  <NextIntlClientProvider>
    <ClientProviders fallback={fallback} locale={locale}>
      {children}
    </ClientProviders>
  </NextIntlClientProvider>
);

export default Providers;
