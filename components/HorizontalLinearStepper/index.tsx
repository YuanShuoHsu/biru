// https://mui.com/material-ui/react-stepper/#CustomizedSteppers.tsx
// https://mui.com/material-ui/react-stepper/#HorizontalLinearStepper.tsx

"use client";

import { useParams, usePathname } from "next/navigation";

import { ORDER_MODE } from "@/constants/orderMode";

import {
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useI18nStore } from "@/providers/i18n-store-provider";

import type { OrderMode } from "@/types/orderMode";
import type { PartySize } from "@/types/partySize";
import type { RouteParams } from "@/types/routeParams";
import type { StoreSlug } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    borderColor: theme.vars.palette.primary.main,
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    borderColor: theme.vars.palette.primary.main,
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.vars.palette.divider,
    borderTopWidth: 3,
    borderRadius: 1,
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

const createStepPathMap = (
  mode: OrderMode,
  storeSlug: StoreSlug,
  tableNumber?: TableNumber,
  partySize?: PartySize,
): string[] => {
  const base =
    mode === ORDER_MODE.Pickup
      ? `/order/${mode}/${storeSlug}`
      : `/order/${mode}/${storeSlug}/${tableNumber}/${partySize}`;

  return [base, `${base}/checkout`, `${base}/complete`];
};

const HorizontalLinearStepper = () => {
  const { dict } = useI18nStore((state) => state);

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
    <Stepper activeStep={activeStep} connector={<QontoConnector />}>
      {steps.map((label, index) => (
        <Step key={label} completed={activeStep > index}>
          <StyledStepLabel>{label}</StyledStepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default HorizontalLinearStepper;
