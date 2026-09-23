import { useTranslations } from "next-intl";

import type { ServingTemperature } from "@/types/menus";

// 只供應熱為「溫度」、只供應冰為「冰量」，兩者都有則「溫度／冰量」
export const useServingTemperatureLabel = () => {
  const tOrder = useTranslations("order");

  return (servingTemperatures: ServingTemperature[]) =>
    servingTemperatures.length === 1
      ? tOrder(`menuItem.servingTemperatureLabels.${servingTemperatures[0]}`)
      : tOrder("menuItem.servingTemperatures.label");
};
