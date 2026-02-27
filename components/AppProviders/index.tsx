import { NextIntlClientProvider } from "next-intl";
import { SWRConfiguration } from "swr";

import AppClientProviders from "./AppClientProviders";

interface AppProvidersProps {
  children: React.ReactNode;
  fallback: SWRConfiguration["fallback"];
}

const AppProviders = ({ children, fallback }: AppProvidersProps) => (
  <NextIntlClientProvider>
    <AppClientProviders fallback={fallback}>{children}</AppClientProviders>
  </NextIntlClientProvider>
);

export default AppProviders;
