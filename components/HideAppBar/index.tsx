// https://mui.com/material-ui/react-app-bar/#system-HideAppBar.tsx

"use client";

import { Suspense } from "react";

import AccountMenu from "./AccountMenu";
import CartIconButton from "./CartIconButton";
import LanguageMenu from "./LanguageMenu";
import ThemeSwitcher from "./ThemeSwitcher";

import BrandMark from "@/components/BrandMark";

import {
  APP_BAR_TOOLBAR_HEIGHT,
  APP_BAR_TOOLBAR_HEIGHT_SM_UP,
  APP_BAR_TOOLBAR_HEIGHT_XS_UP_LANDSCAPE,
} from "@/constants/appBar";
import { SCROLL_TRIGGER_THRESHOLD } from "@/constants/scroll";

import { usePathname } from "@/i18n/navigation";

import { Menu } from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  Stack,
  Toolbar,
  useScrollTrigger,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useToggleDrawer } from "@/utils/drawer";

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "trigger",
})<{ trigger: boolean }>(({ theme, trigger }) => ({
  top: trigger ? -APP_BAR_TOOLBAR_HEIGHT : 0,
  backgroundImage: "none",
  transition: theme.transitions.create(["background-color", "top"]),

  [`${theme.breakpoints.up("xs")} and (orientation: landscape)`]: {
    top: trigger ? -APP_BAR_TOOLBAR_HEIGHT_XS_UP_LANDSCAPE : 0,
  },

  [theme.breakpoints.up("sm")]: {
    top: trigger ? -APP_BAR_TOOLBAR_HEIGHT_SM_UP : 0,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const HideAppBar = () => {
  const pathname = usePathname();

  const trigger = useScrollTrigger({
    threshold: SCROLL_TRIGGER_THRESHOLD,
  });

  const toggleDrawer = useToggleDrawer();

  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE === "true";

  return (
    <StyledAppBar position="fixed" trigger={trigger}>
      <StyledToolbar>
        <Stack minWidth={0} flexDirection="row" alignItems="center" gap={1}>
          {!isMaintenanceMode && (
            <IconButton
              aria-label="open drawer"
              color="inherit"
              edge="start"
              onClick={toggleDrawer("nav", true)}
            >
              <Menu />
            </IconButton>
          )}
          <BrandMark />
        </Stack>
        <Stack direction="row" alignItems="center" gap={0.5}>
          <ThemeSwitcher />
          <Suspense>
            <LanguageMenu />
          </Suspense>
          {!isMaintenanceMode && (
            <Suspense>
              <AccountMenu />
            </Suspense>
          )}
          {pathname.startsWith("/order/") && <CartIconButton />}
        </Stack>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default HideAppBar;
