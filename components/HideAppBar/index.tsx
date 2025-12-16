// https://mui.com/material-ui/react-app-bar/#system-HideAppBar.tsx

import { useParams, usePathname } from "next/navigation";
import { Suspense } from "react";

import BrandMark from "@/components/BrandMark";

import AccountMenu from "./AccountMenu";
import CartIconButton from "./CartIconButton";
import LanguageMenu from "./LanguageMenu";
import ModeToggle from "./ModeToggle";

import { SCROLL_TRIGGER_THRESHOLD } from "@/constants/scroll";

import { Menu } from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  Stack,
  Toolbar,
  useScrollTrigger,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { DrawerType } from "@/types/drawer";
import type { RouteParams } from "@/types/routeParams";

import { createOrderPaths } from "@/utils/orderPaths";

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "trigger",
})<{ trigger: boolean }>(({ theme, trigger }) => ({
  backgroundImage: "none",
  transform: trigger ? "translateY(-100%)" : "translateY(0)",
  transition: theme.transitions.create(["background-color", "transform"]),
  willChange: "transform",
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(1),
}));

interface HideAppBarProps {
  onDrawerToggle: (
    type: DrawerType,
    open: boolean,
  ) => (event: React.MouseEvent | React.KeyboardEvent) => void;
}

const HideAppBar = ({ onDrawerToggle }: HideAppBarProps) => {
  const pathname = usePathname();
  const { lang, mode, storeSlug, tableNumber, partySize } =
    useParams<RouteParams>();

  const trigger = useScrollTrigger({
    threshold: SCROLL_TRIGGER_THRESHOLD,
  });

  const { isOrderRoute: showShoppingCartButton } = createOrderPaths({
    lang,
    mode,
    storeSlug,
    tableNumber,
    partySize,
    pathname,
  });

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
              onClick={onDrawerToggle("nav", true)}
            >
              <Menu />
            </IconButton>
          )}
          <BrandMark />
        </Stack>
        <Stack direction="row" alignItems="center" gap={0.5}>
          <ModeToggle />
          <LanguageMenu />
          {!isMaintenanceMode && (
            <Suspense>
              <AccountMenu />
            </Suspense>
          )}
          {showShoppingCartButton && (
            <CartIconButton onDrawerToggle={onDrawerToggle} />
          )}
        </Stack>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default HideAppBar;
