// https://mui.com/material-ui/react-toggle-button/#CustomizedDividers.tsx
// https://mui.com/material-ui/react-toggle-button/#VerticalSpacingToggleButton.tsx

import { useState } from "react";

import {
  AttachMoney,
  Chat,
  CreditCard,
  PhoneIphone,
} from "@mui/icons-material";
import {
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  toggleButtonGroupClasses,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const paymentOptions = [
  {
    value: "Cash",
    label: "現金",
    ariaLabel: "Cash payment",
    icon: AttachMoney,
  },
  {
    value: "Credit",
    label: "信用卡",
    ariaLabel: "Credit card payment",
    icon: CreditCard,
  },
  {
    value: "TWQR",
    label: "行動支付",
    ariaLabel: "Taiwan QR code payment",
    icon: PhoneIphone,
  },
  {
    value: "WeiXin",
    label: "微信支付",
    ariaLabel: "WeChat Pay",
    icon: Chat,
  },
];

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  width: "100%",
  gap: theme.spacing(2),

  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderBottomRightRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
  [`& .${toggleButtonGroupClasses.lastButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderTopRightRadius: theme.shape.borderRadius,
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTop: `1px solid ${theme.palette.action.disabled}`,
    },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  paddingInline: theme.spacing(1),
  display: "flex",
  justifyContent: "flex-start",
  gap: theme.spacing(2),
  borderColor: theme.palette.action.disabled,
  borderRadius: theme.shape.borderRadius,
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
        {paymentOptions.map(({ ariaLabel, icon: Icon, label, value }) => (
          <StyledToggleButton aria-label={ariaLabel} key={value} value={value}>
            <Icon />
            <Typography>{label}</Typography>
          </StyledToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </Paper>
  );
};

export default CustomizedDividers;
