// https://mui.com/material-ui/customization/dark-mode/#ToggleColorMode.tsx

import { useI18n } from "@/context/i18n";

import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { styled, useColorScheme } from "@mui/material/styles";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: theme.transitions.create(["color"]),
}));

const ModeToggle = () => {
  const { mode, setMode } = useColorScheme();

  const dict = useI18n();
  if (!mode) return null;

  const isLight = mode === "light";
  const tooltipTitle = isLight ? dict.appBar.darkMode : dict.appBar.lightMode;

  const handleModeToggle = () => setMode(isLight ? "dark" : "light");

  return (
    <Tooltip title={tooltipTitle}>
      <StyledIconButton aria-label={tooltipTitle} onClick={handleModeToggle}>
        {isLight ? <DarkMode /> : <LightMode />}
      </StyledIconButton>
    </Tooltip>
  );
};

export default ModeToggle;
