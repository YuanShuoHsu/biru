import { countries } from "@/constants/countries";
import { countryCodeLocaleMap, Locale } from "@/constants/locale";

import type { CountryType } from "@/types/countries";

export const formatPhone = (phone?: CountryType["phone"]) =>
  phone ? `+${phone}` : "";

export const getDefaultCountryCode = (locale: string) => {
  const countryCode = countryCodeLocaleMap[locale as Locale];
  const matchedCountry = countries.find(({ code }) => code === countryCode);

  return formatPhone(matchedCountry?.phone);
};
