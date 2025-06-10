// https://mui.com/material-ui/react-stepper/#HorizontalLinearStepper.tsx

import { Step, StepLabel, Stepper } from "@mui/material";
import { useParams, usePathname, useRouter } from "next/navigation";

const steps = ["點餐", "結帳", "完成"];

const pathToStepIndex = (pathname: string) => {
  if (pathname.includes("/checkout")) return 1;
  if (pathname.includes("/complete")) return 2;
  return 0;
};

const HorizontalLinearStepper = () => {
  const pathname = usePathname();
  const { lang, tableNumber } = useParams();
  const router = useRouter();

  const activeStep = pathToStepIndex(pathname);

  const handleStepClick = (index: number) => {
    if (!lang || !tableNumber) return;

    const base = `/${lang}/order/${tableNumber}`;
    const path =
      index === 0
        ? base
        : index === 1
          ? `${base}/checkout`
          : `${base}/complete`;

    router.push(path);
  };

  return (
    <Stepper activeStep={activeStep}>
      {steps.map((label, index) => (
        <Step
          key={label}
          completed={activeStep > index}
          onClick={() => handleStepClick(index)}
        >
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default HorizontalLinearStepper;
