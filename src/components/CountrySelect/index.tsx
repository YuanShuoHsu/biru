// https://mui.com/material-ui/react-autocomplete/#AutocompleteHint.tsx
// https://mui.com/material-ui/react-autocomplete/#CountrySelect.tsx
// https://mui.com/material-ui/react-autocomplete/#Filter.tsx
// https://mui.com/material-ui/react-autocomplete/#GloballyCustomizedOptions.tsx
// https://mui.com/material-ui/react-autocomplete/#RenderGroup.tsx

import Image from "next/image";
import { useRef, useState } from "react";

import { countries } from "@/constants/countries";

import { useI18n } from "@/context/i18n";

import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  createFilterOptions,
  type BoxProps,
} from "@mui/material";
import { darken, lighten, styled } from "@mui/material/styles";

import type { CountryOption, CountryType } from "@/types/countries";

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: theme.spacing(-1),
  padding: theme.spacing(0.5, 1.25),
  color: theme.palette.primary.main,
  backgroundColor: lighten(theme.palette.primary.light, 0.85),

  ...theme.applyStyles("dark", {
    backgroundColor: darken(theme.palette.primary.main, 0.8),
  }),
}));

const GroupItems = styled("ul")({
  padding: 0,
});

const InputBox = styled(Box)({
  position: "relative",
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  left: theme.spacing(1.75),
  width: "calc(100% - 75px)",
  opacity: 0.5,
  overflow: "hidden",
  whiteSpace: "nowrap",
  pointerEvents: "none",
  zIndex: 1,
}));

const CountryOptionBox = styled((props: BoxProps<"li">) => (
  <Box component="li" {...props} />
))(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const filterOptions = createFilterOptions({
  matchFrom: "start",
  stringify: ({ label }: CountryOption) => label,
});

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
  const hint = useRef("");
  const [value, setValue] = useState<CountryOption | null>(null);
  const [inputValue, setInputValue] = useState("");

  const dict = useI18n();

  const options = countries.map((option) => {
    const firstLetter = option.label[0].toUpperCase();

    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  return (
    <Autocomplete
      autoHighlight
      disablePortal
      filterOptions={(options, state) =>
        value && state.inputValue === value.code
          ? options
          : filterOptions(options, state)
      }
      getOptionLabel={({ code, label, phone }: CountryOption) =>
        `${label} (${code}) +${phone}`
      }
      groupBy={({ firstLetter }: CountryOption) => firstLetter}
      id="country-select-demo"
      inputValue={inputValue}
      onChange={(_, newValue) => {
        setValue(newValue);
        setInputValue(newValue?.code || "");
      }}
      onClose={() => {
        hint.current = "";
      }}
      onInputChange={(_, newInputValue, reason) => {
        if (reason === "reset") return;
        if (reason === "blur") {
          setInputValue(value?.code || "");
          return;
        }

        setInputValue(newInputValue);
      }}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          if (hint.current) {
            setInputValue(hint.current);
            event.preventDefault();
          }
        }
      }}
      options={options.sort(
        (a, b) => -b.firstLetter.localeCompare(a.firstLetter),
      )}
      renderGroup={(params) => (
        <li key={params.key}>
          <GroupHeader>{params.group}</GroupHeader>
          <GroupItems>{params.children}</GroupItems>
        </li>
      )}
      renderInput={(params) => (
        <InputBox>
          <StyledTypography>{hint.current}</StyledTypography>
          <TextField
            {...params}
            label={dict.member.auth.chooseCountry}
            onChange={(event) => {
              const newValue = event.target.value;
              setInputValue(newValue);

              const matchingOption = countries.find((option) =>
                option.label.startsWith(newValue),
              );

              if (newValue && matchingOption) {
                hint.current = matchingOption.label;
              } else {
                hint.current = "";
              }
            }}
            required
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
        </InputBox>
      )}
      renderOption={({ key, ...optionProps }, option, state, ownerState) => {
        const { code, label } = option;

        return (
          <CountryOptionBox key={key} {...optionProps}>
            <FlagImage code={code} label={label} />
            {ownerState.getOptionLabel(option)}
          </CountryOptionBox>
        );
      }}
      value={value}
    />
  );
};

export default CountrySelect;
