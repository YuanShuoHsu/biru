import { useTranslations } from "next-intl";

import {
  RESTRICTED_DIET_ICONS,
  SERVING_TEMPERATURE_ICONS,
} from "@/constants/menus";

import { AutoAwesome, ThumbUp } from "@mui/icons-material";
import { Box } from "@mui/material";
import { amber } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

import type { OrderMenuItem } from "@/types/menus";

const IconBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexShrink: 0,
  gap: theme.spacing(0.5),
}));

const StyledAutoAwesome = styled(AutoAwesome)(({ theme }) => ({
  color: amber[700],

  ...theme.applyStyles("dark", {
    color: amber[300],
  }),
}));

interface MenuItemIconsProps {
  isLatest: boolean;
  isTopSold: boolean;
  menuItem: OrderMenuItem;
}

const MenuItemIcons = ({
  isLatest,
  isTopSold,
  menuItem: { servingTemperatures, suitableForDiet },
}: MenuItemIconsProps) => {
  const tOrder = useTranslations("order");

  const diets = suitableForDiet || [];

  if (
    !isTopSold &&
    !isLatest &&
    servingTemperatures.length === 0 &&
    !diets.some((value) => RESTRICTED_DIET_ICONS[value])
  )
    return null;

  return (
    <IconBox>
      {isTopSold && (
        <ThumbUp
          color="primary"
          fontSize="small"
          titleAccess={tOrder("mode.storeSlug.tableNumber.topSold")}
        />
      )}
      {isLatest && (
        <StyledAutoAwesome
          fontSize="small"
          titleAccess={tOrder("mode.storeSlug.tableNumber.latest")}
        />
      )}
      {servingTemperatures.map((value) => {
        const Icon = SERVING_TEMPERATURE_ICONS[value];

        return (
          <Icon
            fontSize="small"
            key={value}
            titleAccess={tOrder(`menuItem.servingTemperatures.${value}`)}
          />
        );
      })}
      {diets.map((value) => {
        const Icon = RESTRICTED_DIET_ICONS[value];
        if (!Icon) return null;

        return (
          <Icon
            fontSize="small"
            key={value}
            titleAccess={tOrder(`menuItem.diet.${value}`)}
          />
        );
      })}
    </IconBox>
  );
};

export default MenuItemIcons;
