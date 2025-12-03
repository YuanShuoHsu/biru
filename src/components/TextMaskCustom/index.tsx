// https://mui.com/material-ui/react-text-field/#FormattedInputs.tsx

import { getExampleNumber } from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";
import React from "react";
import { IMaskInput } from "react-imask";

import { countries } from "@/constants/countries";

const DEFAULT_NATIONAL_MASK = "0000000000";
const DEFAULT_NATIONAL_PLACEHOLDER = "0123456789";

const toDigits = (value: string) => value.replace(/\D/g, "");

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

const getPhoneFormatting = (countryCode: string) => {
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

interface CustomProps {
  countryCode: string;
  name: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
}

const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskCustom({ countryCode, name, onChange, ...other }, ref) {
    const { mask, placeholder } = getPhoneFormatting(countryCode);

    return (
      <IMaskInput
        key={mask}
        {...other}
        mask={mask}
        placeholder={placeholder}
        inputRef={ref}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onAccept={(value: any) => onChange({ target: { name, value } })}
        overwrite
      />
    );
  },
);

export default TextMaskCustom;
