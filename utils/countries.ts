import { type CountryCode, getExampleNumber } from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";

import type { Locale } from "@/app/[lang]/dictionaries";

import {
  COUNTRY_OPTIONS,
  DEFAULT_COUNTRY,
  DEFAULT_NATIONAL_MASK,
  DEFAULT_NATIONAL_PLACEHOLDER,
} from "@/constants/countries";
import { countryCodeLocaleMap } from "@/constants/locale";

import type { CountryType } from "@/types/countries";

export const formatPhone = (phone: CountryType["phone"]) => `+${phone}`;

export const getDefaultCountry = (lang: Locale) => {
  const countryCode = countryCodeLocaleMap[lang];

  return (
    COUNTRY_OPTIONS.find(({ code }) => code === countryCode) || DEFAULT_COUNTRY
  );
};

export const getPhoneFormatting = (countryCode: CountryCode) => {
  const exampleNumber = getExampleNumber(countryCode, examples);

  if (!exampleNumber) {
    return {
      mask: DEFAULT_NATIONAL_MASK,
      placeholder: DEFAULT_NATIONAL_PLACEHOLDER,
    };
  }

  const nationalFormat = exampleNumber.formatNational();

  const mask = nationalFormat.replace(/\d/g, "0");
  const placeholder = nationalFormat;

  return {
    mask,
    placeholder,
  };
};
