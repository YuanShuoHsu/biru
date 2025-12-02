import { countries } from "@/constants/countries";
import { countryCodeLocaleMap, Locale } from "@/constants/locale";

import type { CountryType } from "@/types/countries";

export const formatPhone = (phone: CountryType["phone"]) => `+${phone}`;

const DEFAULT_COUNTRY_PHONE = "886";

export const getDefaultCountryCode = (locale: string) => {
  const countryCode = countryCodeLocaleMap[locale as Locale];
  const matchedCountry = countries.find(({ code }) => code === countryCode);
  const phone = matchedCountry?.phone || DEFAULT_COUNTRY_PHONE;

  return formatPhone(phone);
};
