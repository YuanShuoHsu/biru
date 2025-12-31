// https://mui.com/material-ui/react-autocomplete/#AutocompleteHint.tsx
// https://mui.com/material-ui/react-autocomplete/#CountrySelect.tsx
// https://mui.com/material-ui/react-autocomplete/#Filter.tsx
// https://mui.com/material-ui/react-autocomplete/#GloballyCustomizedOptions.tsx
// https://mui.com/material-ui/react-autocomplete/#Highlights.tsx
// https://mui.com/material-ui/react-autocomplete/#RenderGroup.tsx

import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import Image from "next/image";
import React, { useRef, useState } from "react";

import { countries } from "@/constants/countries";
import { countryCodeLocaleMap, Locale } from "@/constants/locale";

import { useI18n } from "@/context/i18n";

import {
  Autocomplete,
  Box,
  createFilterOptions,
  InputAdornment,
  TextField,
  Typography,
  TypographyProps,
  type BoxProps,
} from "@mui/material";
import { darken, lighten, styled } from "@mui/material/styles";

import type { CountryOption, CountryType } from "@/types/countries";

import { formatPhone } from "@/utils/countries";

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

const HintTypography = styled(Typography)(({ theme }) => ({
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

const StyledInputAdornment = styled(InputAdornment)(({ theme }) => ({
  position: "relative",
  marginInline: theme.spacing(0.625),
  width: theme.spacing(2.5),
}));

type CountryOptionBoxProps = Omit<BoxProps<"li">, "component"> & {
  selected: boolean;
};

const CountryOptionRoot = React.forwardRef<
  HTMLLIElement,
  CountryOptionBoxProps
>((props, ref) => <Box component="li" ref={ref} {...props} />);

CountryOptionRoot.displayName = "CountryOptionRoot";

const CountryOptionBox = styled(CountryOptionRoot, {
  shouldForwardProp: (prop) => prop !== "selected",
})<CountryOptionBoxProps>(({ selected, theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  backgroundColor: selected
    ? theme.vars.palette.action.selected
    : "transparent",
}));

const HighlightTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "highlight",
})<TypographyProps<"span"> & { highlight: boolean }>(
  ({ highlight, theme }) => ({
    fontWeight: highlight
      ? theme.typography.fontWeightBold
      : theme.typography.fontWeightRegular,
  }),
);

const getCountryLabel = ({ label, code, phone }: CountryOption) =>
  `${label} (${code}) ${formatPhone(phone)}`;

const filter = createFilterOptions<CountryOption>({
  // matchFrom: "start",
  stringify: getCountryLabel,
});

const FlagImage = ({ code, label }: Pick<CountryType, "code" | "label">) => (
  <Image
    alt={label}
    fill
    loading="lazy"
    sizes="(min-width: 808px) 50vw, 100vw"
    src={`/images/flags/w20/${code.toLowerCase()}.png`}
    style={{
      objectFit: "contain",
    }}
    unoptimized
  />
);

interface CountrySelectProps {
  lang: string;
  onChange: (code: string) => void;
}

const CountrySelect = ({ lang, onChange }: CountrySelectProps) => {
  const options = countries.map((option) => {
    const firstLetter = option.label[0].toUpperCase();

    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  const matchedCountry = options.find(
    ({ code }) => code === countryCodeLocaleMap[lang as Locale],
  );

  const defaultCountry = matchedCountry || {
    code: "TW",
    label: "Taiwan",
    phone: "886",
    firstLetter: "T",
  };

  const [value, setValue] = useState<CountryOption>(defaultCountry);
  const [inputValue, setInputValue] = useState(
    formatPhone(defaultCountry.phone),
  );

  const hint = useRef("");

  const dict = useI18n();

  return (
    <Autocomplete
      autoHighlight
      disableClearable
      disablePortal
      filterOptions={(options, params) => {
        const { inputValue } = params;
        if (value && inputValue === formatPhone(value.phone)) return options;

        return filter(options, params);
      }}
      getOptionLabel={getCountryLabel}
      isOptionEqualToValue={({ code: optionCode }, { code: valueCode }) =>
        optionCode === valueCode
      }
      groupBy={({ firstLetter }: CountryOption) => firstLetter}
      id="country-select-demo"
      inputValue={inputValue}
      onChange={(_, newValue: CountryOption) => {
        setValue(newValue);

        const formattedPhone = formatPhone(newValue.phone);
        setInputValue(formattedPhone);
        onChange(formattedPhone);
      }}
      onClose={() => {
        hint.current = "";
      }}
      onInputChange={(_, newInputValue, reason) => {
        if (reason === "reset") return;
        if (reason === "blur") {
          setInputValue(formatPhone(value.phone));
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
        <Box component="li" key={params.key}>
          <GroupHeader>{params.group}</GroupHeader>
          <GroupItems>{params.children}</GroupItems>
        </Box>
      )}
      renderInput={(params) => (
        <InputBox>
          <HintTypography>{hint.current}</HintTypography>
          <TextField
            {...params}
            label={dict.auth.chooseCountry}
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
                  <StyledInputAdornment position="start">
                    <FlagImage code={value.code} label={value.label} />
                  </StyledInputAdornment>
                ) : (
                  params.InputProps.startAdornment
                ),
              },
            }}
          />
        </InputBox>
      )}
      renderOption={(
        { key, ...optionProps },
        option,
        { inputValue, selected },
        ownerState,
      ) => {
        const { code, label } = option;
        const optionLabelText = ownerState.getOptionLabel(option);
        const matches = match(optionLabelText, inputValue, {
          findAllOccurrences: true,
          insideWords: true,
        });
        const parts = parse(optionLabelText, matches);

        return (
          <CountryOptionBox key={key} selected={selected} {...optionProps}>
            <FlagImage code={code} label={label} />
            <Box component="div">
              {parts.map(({ highlight, text }, index) => (
                <HighlightTypography
                  component="span"
                  highlight={highlight}
                  key={index}
                >
                  {text}
                </HighlightTypography>
              ))}
            </Box>
          </CountryOptionBox>
        );
      }}
      value={value}
    />
  );
};

export default CountrySelect;
