// https://mui.com/material-ui/react-toggle-button/#CustomizedDividers.tsx
// https://mui.com/material-ui/react-toggle-button/#VerticalSpacingToggleButton.tsx
// https://mui.com/material-ui/react-radio-button/#RadioButtons.tsx

import { useState } from "react";

import {
  AttachMoney,
  Chat,
  CreditCard,
  PhoneIphone,
} from "@mui/icons-material";
import {
  Paper,
  Radio,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  toggleButtonGroupClasses,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const paymentOptions = [
  {
    icon: AttachMoney,
    label: "現金",
    value: "Cash",
  },
  {
    icon: CreditCard,
    label: "信用卡",
    value: "Credit",
  },
  {
    icon: PhoneIphone,
    label: "行動支付",
    value: "TWQR",
  },
  {
    icon: Chat,
    label: "微信支付",
    value: "WeiXin",
  },
];

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  width: "100%",
  gap: theme.spacing(2),

  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderColor: theme.palette.action.disabled,
      borderBottomRightRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
  [`& .${toggleButtonGroupClasses.lastButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderColor: theme.palette.action.disabled,
      borderTopRightRadius: theme.shape.borderRadius,
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTop: `1px solid ${theme.palette.action.disabled}`,
    },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  paddingInline: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  transition: theme.transitions.create([
    "background-color",
    "border-color",
    "color",
  ]),

  "&.Mui-selected": {
    borderColor: theme.palette.primary.main,
  },
}));

const CustomizedDividers = () => {
  const [payment, setPayment] = useState<string | null>(null);

  const handlePaymentChange = (
    event: React.MouseEvent<HTMLElement>,
    newPayment: string | null,
  ) => setPayment(newPayment);

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: 2,
        border: `1px solid ${theme.palette.action.disabled}`,
      })}
    >
      <StyledToggleButtonGroup
        aria-label="payment method selection"
        exclusive
        onChange={handlePaymentChange}
        orientation="vertical"
        value={payment}
        size="small"
      >
        {paymentOptions.map(({ icon: Icon, label, value }) => (
          <StyledToggleButton aria-label={label} key={value} value={value}>
            <Stack
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap={2}
            >
              <Icon />
              <Typography>{label}</Typography>
            </Stack>
            <Radio
              aria-label={label}
              checked={payment === value}
              name="radio-buttons"
              size="small"
              value={value}
            />
          </StyledToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </Paper>
  );
};

export default CustomizedDividers;
