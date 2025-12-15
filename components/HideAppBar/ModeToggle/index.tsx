// https://mui.com/material-ui/customization/dark-mode/#ToggleColorMode.tsx
// https://mui.com/material-ui/react-tooltip/#DisabledTooltips.tsx

import { useI18n } from "@/context/i18n";

import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

const ModeToggle = () => {
  const { mode, setMode } = useColorScheme();

  const dict = useI18n();

  const isLoading = !mode;
  const isLight = mode === "light";
  const tooltipTitle = isLight ? dict.appBar.darkMode : dict.appBar.lightMode;

  const handleModeToggle = () => {
    if (isLoading) return;

    setMode(isLight ? "dark" : "light");
  };

  return (
    <Tooltip title={tooltipTitle}>
      <span>
        <IconButton
          aria-label={tooltipTitle}
          color="inherit"
          disabled={isLoading}
          loading={isLoading}
          onClick={handleModeToggle}
        >
          {isLight ? <DarkMode /> : <LightMode />}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default ModeToggle;
