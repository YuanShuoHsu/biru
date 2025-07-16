// https://mui.com/material-ui/react-stepper/#HorizontalLinearStepper.tsx

"use client";

import { useParams, usePathname } from "next/navigation";

import { useI18n } from "@/context/i18n";

import { Step, StepLabel, Stepper } from "@mui/material";
import { styled } from "@mui/material/styles";

const createStepPathMap = (tableNumber: string): string[] => [
  `/order/${tableNumber}`,
  `/order/${tableNumber}/checkout`,
  `/order/${tableNumber}/complete`,
];

const StyledStepper = styled(Stepper)(({ theme }) => ({
  "& .MuiStepConnector-line": {
    transition: theme.transitions.create("border-color"),
  },
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepIcon-root": {
    transition: theme.transitions.create("color"),

    "& .MuiStepIcon-text": {
      transition: theme.transitions.create("fill"),
    },
  },

  "& .MuiStepLabel-label": {
    transition: theme.transitions.create("color"),
  },
}));

const HorizontalLinearStepper = () => {
  const pathname = usePathname();
  const { lang, tableNumber } = useParams();

  const dict = useI18n();

  const stepPaths = createStepPathMap(String(tableNumber));
  const activeStep = stepPaths.findIndex(
    (path) => pathname === `/${lang}${path}`,
  );

  const steps = [
    dict.breadcrumb.order,
    dict.breadcrumb.checkout,
    dict.breadcrumb.complete,
  ];

  return (
    <StyledStepper activeStep={activeStep}>
      {steps.map((label, index) => (
        <Step key={label} completed={activeStep > index}>
          <StyledStepLabel>{label}</StyledStepLabel>
        </Step>
      ))}
    </StyledStepper>
  );
};

export default HorizontalLinearStepper;
