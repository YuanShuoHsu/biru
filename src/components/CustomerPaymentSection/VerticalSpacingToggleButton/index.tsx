// https://mui.com/material-ui/react-toggle-button/#CustomizedDividers.tsx
// https://mui.com/material-ui/react-toggle-button/#VerticalSpacingToggleButton.tsx
// https://mui.com/material-ui/react-radio-button/#RadioButtons.tsx

import {
  CreditCard,
  MarkChatRead,
  Payments,
  QrCodeScanner,
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

import type { PaymentMethod } from "@/types/payment";

const paymentOptions = [
  {
    icon: Payments,
    label: "現金",
    value: "Cash",
  },
  {
    icon: CreditCard,
    label: "信用卡",
    value: "Credit",
  },
  {
    icon: QrCodeScanner,
    label: "行動支付",
    value: "TWQR",
  },
  {
    icon: MarkChatRead,
    label: "微信支付",
    value: "WeiXin",
  },
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.action.disabled}`,
}));

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

  "&.Mui-selected": {
    borderColor: theme.palette.primary.main,
  },
}));

const StyledRadio = styled(Radio)({
  pointerEvents: "none",
});

interface VerticalSpacingToggleButtonProps {
  payment: PaymentMethod | null;
  setPayment: React.Dispatch<React.SetStateAction<PaymentMethod | null>>;
}

const VerticalSpacingToggleButton = ({
  payment,
  setPayment,
}: VerticalSpacingToggleButtonProps) => {
  const handlePaymentChange = (
    event: React.MouseEvent<HTMLElement>,
    newPayment: PaymentMethod | null,
  ) => setPayment(newPayment);

  return (
    <StyledPaper elevation={0}>
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
            <StyledRadio
              aria-label={label}
              key={value}
              checked={payment === value}
              name="radio-buttons"
              size="small"
              value={value}
            />
          </StyledToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </StyledPaper>
  );
};

export default VerticalSpacingToggleButton;
