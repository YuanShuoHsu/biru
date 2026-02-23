import { NextIntlClientProvider } from "next-intl";
import { SWRConfiguration } from "swr";

import ClientProviders from "./client";

interface ProvidersProps {
  children: React.ReactNode;
  fallback: SWRConfiguration["fallback"];
}

const Providers = ({ children, fallback }: ProvidersProps) => (
  <NextIntlClientProvider>
    <ClientProviders fallback={fallback}>{children}</ClientProviders>
  </NextIntlClientProvider>
);

export default Providers;
