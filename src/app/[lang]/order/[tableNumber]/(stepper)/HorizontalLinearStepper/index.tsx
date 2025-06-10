// https://mui.com/material-ui/react-stepper/#HorizontalLinearStepper.tsx

"use client";

import { Step, StepLabel, Stepper } from "@mui/material";
import { useParams, usePathname } from "next/navigation";

const steps = ["點餐", "結帳", "完成"];

const createStepPathMap = (tableNumber: string): string[] => [
  `/order/${tableNumber}`,
  `/order/${tableNumber}/checkout`,
  `/order/${tableNumber}/complete`,
];

const HorizontalLinearStepper = () => {
  const pathname = usePathname();
  const { lang, tableNumber } = useParams();

  const stepPaths = createStepPathMap(tableNumber as string);
  const activeStep = stepPaths.findIndex(
    (path) => pathname === `/${lang}${path}`,
  );

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
