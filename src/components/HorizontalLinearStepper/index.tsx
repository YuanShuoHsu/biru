// https://mui.com/material-ui/react-stepper/#HorizontalLinearStepper.tsx

"use client";

import { useParams, usePathname } from "next/navigation";

import { useI18n } from "@/context/i18n";

import { Step, StepLabel, Stepper } from "@mui/material";

const createStepPathMap = (tableNumber: string): string[] => [
  `/order/${tableNumber}`,
  `/order/${tableNumber}/checkout`,
  `/order/${tableNumber}/complete`,
];

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
    <Stepper activeStep={activeStep}>
      {steps.map((label, index) => (
        <Step key={label} completed={activeStep > index}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default HorizontalLinearStepper;
