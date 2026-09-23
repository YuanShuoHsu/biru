import type { ElementType } from "react";

import { AcUnit, LocalFireDepartment } from "@mui/icons-material";
import type { SvgIconProps } from "@mui/material";

import type {
  ServingTemperature,
  ServingTemperatureLevel,
} from "@/types/menus";

export const LOW_STOCK_THRESHOLD = 5;

export const SERVING_TEMPERATURE_OF_LEVEL: Record<
  ServingTemperatureLevel,
  ServingTemperature
> = {
  Warm: "Hot",
  Hot: "Hot",
  RegularIce: "Iced",
  LessIce: "Iced",
  LightIce: "Iced",
  NoIce: "Iced",
};

export const SERVING_TEMPERATURE_ICONS: Record<
  ServingTemperature,
  { color: SvgIconProps["color"]; icon: ElementType<SvgIconProps> }
> = {
  Hot: { color: "error", icon: LocalFireDepartment },
  Iced: { color: "info", icon: AcUnit },
};
