// https://mui.com/material-ui/react-checkbox/#formgroup
// https://v7.mui.com/joy-ui/react-radio-button/#RadioPositionEnd.tsx

"use client";

import { Fragment, useId, type ChangeEvent } from "react";

import {
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Paper,
  Stack,
  Typography,
  type FormHelperTextProps,
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

const LabelTypography = styled(Typography)({
  overflowWrap: "anywhere",
});

const OptionLabelStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  gap: theme.spacing(2),
}));

interface ListCheckboxGroupOption {
  children?: React.ReactNode;
  disabled?: boolean;
  disabledReason?: string;
  icon?: React.ReactNode;
  label: string;
  secondary?: string;
  value: string;
}

interface ListCheckboxGroupProps {
  error?: FormHelperTextProps["error"];
  helperText?: FormHelperTextProps["children"];
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>, value: string[]) => void;
  options: ListCheckboxGroupOption[];
  required?: boolean;
  value: string[];
}

const ListCheckboxGroup = ({
  error,
  helperText,
  label,
  onChange,
  options,
  required,
  value,
}: ListCheckboxGroupProps) => {
  const id = useId();
  const labelId = `${id}-label`;
  const helperTextId = `${id}-helper-text`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    onChange(
      event,
      checked
        ? [...value, name]
        : value.filter((selected) => selected !== name),
    );
  };

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
        <FormGroup
          aria-describedby={helperText ? helperTextId : undefined}
          aria-labelledby={labelId}
          role="group"
        >
          {options.map(
            (
              {
                children,
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
                    <Checkbox
                      checked={value.includes(optionValue)}
                      name={optionValue}
                      onChange={handleChange}
                      size="small"
                    />
                  }
                  disabled={disabled}
                  label={
                    <OptionLabelStack direction="row">
                      {icon}
                      <Stack>
                        <LabelTypography variant="body2">
                          {label}
                        </LabelTypography>
                        {secondary && (
                          <Typography color="textSecondary" variant="caption">
                            {secondary}
                          </Typography>
                        )}
                      </Stack>
                      {disabledReason && (
                        <Chip label={disabledReason} size="small" />
                      )}
                    </OptionLabelStack>
                  }
                />
                {children}
              </Fragment>
            ),
          )}
        </FormGroup>
      </Paper>
      {helperText && (
        <FormHelperText id={helperTextId}>{helperText}</FormHelperText>
      )}
    </StyledFormControl>
  );
};

export default ListCheckboxGroup;
