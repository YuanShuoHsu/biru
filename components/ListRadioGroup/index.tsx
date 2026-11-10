// https://mui.com/material-ui/react-radio-button/#show-error
// https://v7.mui.com/joy-ui/react-radio-button/#ExamplePaymentChannels.tsx
// https://v7.mui.com/joy-ui/react-radio-button/#RadioPositionEnd.tsx

"use client";

import { Fragment, useId } from "react";

import {
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  type FormHelperTextProps,
  type RadioGroupProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  gap: theme.spacing(2),
}));

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  ...theme.typography.subtitle2,
  fontWeight: "bold",
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(1, 2),
  flexDirection: "row-reverse",
  justifyContent: "space-between",
}));

const OptionLabelStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  gap: theme.spacing(2),
}));

interface ListRadioGroupOption {
  disabled?: boolean;
  disabledReason?: string;
  icon?: React.ReactNode;
  label: string;
  secondary?: string;
  value: string;
}

interface ListRadioGroupProps {
  error?: FormHelperTextProps["error"];
  helperText?: FormHelperTextProps["children"];
  inputRef?: React.Ref<HTMLInputElement>;
  label: string;
  onChange?: RadioGroupProps["onChange"];
  options: ListRadioGroupOption[];
  required?: boolean;
  value: string;
}

const ListRadioGroup = ({
  error,
  helperText,
  inputRef,
  label,
  onChange,
  options,
  required,
  value,
}: ListRadioGroupProps) => {
  const id = useId();
  const labelId = `${id}-label`;
  const helperTextId = `${id}-helper-text`;
  const firstEnabledValue = options.find(({ disabled }) => !disabled)?.value;

  return (
    <StyledFormControl
      error={error}
      fullWidth
      required={required}
      variant="standard"
    >
      <StyledFormLabel focused={false} id={labelId}>
        {label}
      </StyledFormLabel>
      <Paper variant="outlined">
        <RadioGroup
          aria-describedby={helperText ? helperTextId : undefined}
          aria-labelledby={labelId}
          onChange={onChange}
          value={value}
        >
          {options.map(
            (
              {
                disabled,
                disabledReason,
                icon,
                label,
                secondary,
                value: optionValue,
              },
              index,
            ) => (
              <Fragment key={optionValue}>
                {index !== 0 && <Divider />}
                <StyledFormControlLabel
                  control={
                    <Radio
                      size="small"
                      slotProps={{
                        input: {
                          ref:
                            optionValue === firstEnabledValue
                              ? inputRef
                              : undefined,
                        },
                      }}
                    />
                  }
                  disabled={disabled}
                  label={
                    <OptionLabelStack direction="row">
                      {icon}
                      <Stack>
                        <Typography variant="body2">{label}</Typography>
                        {secondary && (
                          <Typography color="textSecondary" variant="caption">
                            {secondary}
                          </Typography>
                        )}
                      </Stack>
                      {disabled && disabledReason && (
                        <Chip label={disabledReason} size="small" />
                      )}
                    </OptionLabelStack>
                  }
                  value={optionValue}
                />
              </Fragment>
            ),
          )}
        </RadioGroup>
      </Paper>
      {helperText && (
        <FormHelperText id={helperTextId}>{helperText}</FormHelperText>
      )}
    </StyledFormControl>
  );
};

export default ListRadioGroup;
