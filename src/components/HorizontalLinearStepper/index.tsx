// https://mui.com/material-ui/react-stepper/#HorizontalLinearStepper.tsx

"use client";

import { useParams, usePathname } from "next/navigation";

import { useI18n } from "@/context/i18n";

import { Step, StepLabel, Stepper } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { OrderMode } from "@/types/orderMode";
import type { PartySize } from "@/types/partySize";
import type { RouteParams } from "@/types/routeParams";
import type { StoreSlug } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

const createStepPathMap = (
  mode: OrderMode,
  storeSlug: StoreSlug,
  tableNumber: TableNumber,
  partySize: PartySize,
): string[] => {
  const base = `/order/${mode}/${storeSlug}/${tableNumber}${
    partySize ? `/${partySize}` : ""
  }`;

  return [base, `${base}/checkout`, `${base}/complete`];
};

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
  const dict = useI18n();

  const { lang, mode, storeSlug, tableNumber, partySize } =
    useParams<RouteParams>();

  const pathname = usePathname();

  const stepPaths = createStepPathMap(mode, storeSlug, tableNumber, partySize);
  const activeStep = stepPaths.findIndex(
    (path) => pathname === `/${lang}${path}`,
  );

  const steps = [
    dict.order.label,
    dict.order.mode.storeSlug.tableNumber.stepper.checkout.label,
    dict.order.mode.storeSlug.tableNumber.stepper.complete.label,
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
