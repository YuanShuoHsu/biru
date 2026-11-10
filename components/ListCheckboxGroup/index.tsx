// https://mui.com/material-ui/react-checkbox/#CheckboxesGroup.tsx
// https://v7.mui.com/joy-ui/react-radio-button/#RadioPositionEnd.tsx

"use client";

import { Fragment, useId, type ChangeEvent } from "react";

import {
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Paper,
  Stack,
  Typography,
  type FormHelperTextProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const GroupStack = styled(Stack)(({ theme }) => ({
  width: "100%",
  gap: theme.spacing(2),
}));

const StyledTypography = styled(Typography)({
  fontWeight: "bold",
});

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

interface ListCheckboxGroupOption {
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
    <GroupStack>
      <StyledTypography color="textSecondary" id={labelId} variant="subtitle2">
        {label}
        {required && "\u2009*"}
      </StyledTypography>
      <Paper variant="outlined">
        <FormGroup
          aria-describedby={helperText ? helperTextId : undefined}
          aria-labelledby={labelId}
          role="group"
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
                        <Typography variant="body2">{label}</Typography>
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
              </Fragment>
            ),
          )}
        </FormGroup>
      </Paper>
      {helperText && (
        <FormHelperText error={error} id={helperTextId}>
          {helperText}
        </FormHelperText>
      )}
    </GroupStack>
  );
};

export default ListCheckboxGroup;
