import type { ElementType } from "react";

import { AcUnit, LocalCafe } from "@mui/icons-material";
import type { SvgIconProps } from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

import type {
  ServingTemperature,
  ServingTemperatureLevel,
} from "@/types/menus";

export const LOW_STOCK_THRESHOLD = 5;

export const SERVING_TEMPERATURE_OF_LEVEL: Record<
  ServingTemperatureLevel,
  ServingTemperature
> = {
  RegularIce: "Iced",
  LessIce: "Iced",
  LightIce: "Iced",
  NoIce: "Iced",
  Warm: "Hot",
  Hot: "Hot",
};

const StyledLocalCafe = styled(LocalCafe)(({ theme }) => ({
  color: theme.vars.palette.error.main,
}));

const StyledAcUnit = styled(AcUnit)(({ theme }) => ({
  color: lightBlue[700],

  ...theme.applyStyles("dark", {
    color: lightBlue[300],
  }),
}));

export const SERVING_TEMPERATURE_ICONS: Record<
  ServingTemperature,
  ElementType<SvgIconProps>
> = {
  Hot: StyledLocalCafe,
  Iced: StyledAcUnit,
};
