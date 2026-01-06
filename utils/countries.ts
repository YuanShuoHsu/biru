import { getExampleNumber } from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";

import { Locale } from "@/app/[lang]/dictionaries";

import {
  countries,
  DEFAULT_COUNTRY,
  DEFAULT_NATIONAL_MASK,
  DEFAULT_NATIONAL_PLACEHOLDER,
} from "@/constants/countries";
import { countryCodeLocaleMap } from "@/constants/locale";

import type { CountryType } from "@/types/countries";

export const formatPhone = (phone: CountryType["phone"]) => `+${phone}`;

export const getDefaultCountry = (lang: Locale) => {
  const countryCode = countryCodeLocaleMap[lang];

  return countries.find(({ code }) => code === countryCode) || DEFAULT_COUNTRY;
};

export const toDigits = (value: string) => value.replace(/\D/g, "");

const stripPrefixDigits = (value: string, digitsToStrip: number) => {
  if (digitsToStrip <= 0) return value.trim();

  let remaining = digitsToStrip;
  let started = false;
  let stripped = "";

  for (const char of value) {
    const isDigit = char >= "0" && char <= "9";
    if (!started && !isDigit) continue;

    if (isDigit && remaining > 0) {
      remaining -= 1;
    } else {
      started ||= isDigit;
      stripped += char;
    }
  }

  return stripped.trim();
};

export const getPhoneFormatting = (countryCode: string) => {
  const callingCode = toDigits(countryCode);
  const matchedCountry = countries.find(
    ({ phone }) => toDigits(phone) === callingCode,
  );
  if (!matchedCountry)
    return {
      mask: DEFAULT_NATIONAL_MASK,
      placeholder: DEFAULT_NATIONAL_PLACEHOLDER,
    };

  const exampleNumber = getExampleNumber(matchedCountry.code, examples);
  if (!exampleNumber)
    return {
      mask: DEFAULT_NATIONAL_MASK,
      placeholder: DEFAULT_NATIONAL_PLACEHOLDER,
    };

  const extraPrefixLength =
    callingCode.length - exampleNumber.countryCallingCode.length;
  const nationalFormat = exampleNumber.formatNational();
  const stripped = stripPrefixDigits(nationalFormat, extraPrefixLength);

  const mask = stripped.replace(/\d/g, "0");
  const placeholder = stripped;

  return {
    mask,
    placeholder,
  };
};
