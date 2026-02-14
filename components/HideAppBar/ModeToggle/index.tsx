"use client";

// https://mui.com/material-ui/customization/css-theme-variables/configuration/
// https://mui.com/material-ui/customization/dark-mode/#ToggleColorMode.tsx
// https://mui.com/material-ui/react-tooltip/#DisabledTooltips.tsx

import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { styled, useColorScheme } from "@mui/material/styles";

import { useI18nStore } from "@/providers/i18n-store-provider";

const StyledDarkMode = styled(DarkMode)(({ theme }) => ({
  display: "block",

  ...theme.applyStyles("dark", {
    display: "none",
  }),
}));

const StyledLightMode = styled(LightMode)(({ theme }) => ({
  display: "none",

  ...theme.applyStyles("dark", {
    display: "block",
  }),
}));

const ModeToggle = () => {
  const { mode, setMode } = useColorScheme();

  const { dict } = useI18nStore((state) => state);

  const isLight = mode === "light";

  const tooltipTitle = !mode
    ? ""
    : isLight
      ? dict.appBar.darkMode
      : dict.appBar.lightMode;

  const handleModeToggle = () => setMode(isLight ? "dark" : "light");

  return (
    <Tooltip title={tooltipTitle}>
      <span>
        <IconButton
          aria-label={tooltipTitle}
          color="inherit"
          disabled={!mode}
          onClick={handleModeToggle}
        >
          <StyledDarkMode />
          <StyledLightMode />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default ModeToggle;
