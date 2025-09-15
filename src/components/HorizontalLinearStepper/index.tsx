// https://mui.com/material-ui/react-stepper/#HorizontalLinearStepper.tsx

"use client";

import { useParams, usePathname } from "next/navigation";

import { useI18n } from "@/context/i18n";

import { Step, StepLabel, Stepper } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { LangModeStoreIdTableNumberParam } from "@/types/locale";
import type { OrderMode } from "@/types/orderMode";
import type { StoreId } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

const createStepPathMap = (
  mode: OrderMode,
  storeId: StoreId,
  tableNumber: TableNumber,
): string[] => [
  `/order/${mode}/${storeId}/${tableNumber}`,
  `/order/${mode}/${storeId}/${tableNumber}/checkout`,
  `/order/${mode}/${storeId}/${tableNumber}/complete`,
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
  const { lang, mode, storeId, tableNumber } =
    useParams<LangModeStoreIdTableNumberParam>();

  const dict = useI18n();

  const stepPaths = createStepPathMap(mode, storeId, tableNumber);
  const activeStep = stepPaths.findIndex(
    (path) => pathname === `/${lang}${path}`,
  );

  const steps = [
    dict.breadcrumb.order.label,
    dict.breadcrumb.order.checkout,
    dict.breadcrumb.order.complete,
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
