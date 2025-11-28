// https://nextjs.org/docs/app/api-reference/components/image#remotepatterns

import Image from "next/image";
import { useState } from "react";

import { countries } from "@/constants/countries";

import { useI18n } from "@/context/i18n";

import {
  Autocomplete,
  Box,
  TextField,
  createFilterOptions,
  type BoxProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { CountryType } from "@/types/countries";

const StyledBox = styled((props: BoxProps<"li">) => (
  <Box component="li" {...props} />
))(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const FlagImage = ({ code, label }: Pick<CountryType, "code" | "label">) => (
  <Image
    alt={label}
    height={14}
    loading="lazy"
    src={`/images/flags/w20/${code.toLowerCase()}.png`}
    style={{ flexShrink: 0 }}
    unoptimized
    width={20}
  />
);

const CountrySelect = () => {
  const [value, setValue] = useState<CountryType | null>(null);
  const [inputValue, setInputValue] = useState("");

  const dict = useI18n();

  const filter = createFilterOptions<CountryType>();

  return (
    <Autocomplete
      autoHighlight
      filterOptions={(options, state) =>
        value && state.inputValue === value.code
          ? options
          : filter(options, state)
      }
      getOptionLabel={({ label }) => label}
      id="country-select-demo"
      inputValue={inputValue}
      onChange={(_, newValue) => {
        setValue(newValue);
        setInputValue(newValue?.code || "");
      }}
      onInputChange={(_, newInputValue, reason) => {
        if (reason === "reset") return;
        if (reason === "blur") {
          setInputValue(value?.code || "");
          return;
        }

        setInputValue(newInputValue);
      }}
      options={countries}
      renderInput={(params) => (
        <TextField
          {...params}
          label={dict.member.auth.chooseCountry}
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              autoComplete: "new-password",
            },
            input: {
              ...params.InputProps,
              startAdornment: value ? (
                <FlagImage code={value.code} label={value.label} />
              ) : (
                params.InputProps.startAdornment
              ),
            },
          }}
        />
      )}
      renderOption={({ key, ...optionProps }, { code, label, phone }) => (
        <StyledBox key={key} {...optionProps}>
          <FlagImage code={code} label={label} />
          {label} ({code}) +{phone}
        </StyledBox>
      )}
      value={value}
    />
  );
};

export default CountrySelect;
