// https://mui.com/material-ui/react-app-bar/#system-HideAppBar.tsx

import Image from "next/image";
import NextLink from "next/link";
import { useParams, usePathname } from "next/navigation";

import AccountMenu from "./AccountMenu";
import CartIconButton from "./CartIconButton";
import LanguageMenu from "./LanguageMenu";
import ModeToggle from "./ModeToggle";

import { Menu } from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Link as MuiLink,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { DrawerType } from "@/types/drawer";

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "trigger",
})<{ trigger: boolean }>(({ theme, trigger }) => ({
  backgroundImage: "none",
  transform: trigger ? "translateY(-100%)" : "translateY(0)",
  transition: theme.transitions.create("transform"),
  willChange: "transform",
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const ImageBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: theme.spacing(4),
  height: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  flexShrink: 0,
  overflow: "hidden",
}));

interface HideAppBarProps {
  onDrawerToggle: (
    type: DrawerType,
    open: boolean,
  ) => (event: React.MouseEvent | React.KeyboardEvent) => void;
}

const HideAppBar = ({ onDrawerToggle }: HideAppBarProps) => {
  const pathname = usePathname();
  const { lang, store, tableNumber } = useParams();

  const trigger = useScrollTrigger();

  const basePath = `/${lang}/order/${store}/${tableNumber}`;
  const showShoppingCartButton =
    pathname === basePath || pathname === `${basePath}/checkout`;

  return (
    <StyledAppBar position="fixed" trigger={trigger}>
      <StyledToolbar>
        <Stack minWidth={0} flexDirection="row" alignItems="center" gap={1}>
          <IconButton
            aria-label="open drawer"
            color="inherit"
            edge="start"
            onClick={onDrawerToggle("nav", true)}
          >
            <Menu />
          </IconButton>
          <MuiLink
            minWidth={0}
            color="inherit"
            component={NextLink}
            href={`/${lang}`}
            display="flex"
            alignItems="center"
            gap={1}
            underline="none"
          >
            <ImageBox>
              <Image
                alt="biru coffee"
                draggable={false}
                fill
                priority
                sizes="(min-width: 808px) 50vw, 100vw"
                src="/images/IMG_4590.jpg"
                style={{ objectFit: "cover" }}
              />
            </ImageBox>
            <Typography component="span" noWrap variant="h6">
              Biru Coffee
            </Typography>
          </MuiLink>
        </Stack>
        <Stack direction="row" alignItems="center" gap={0.5}>
          <ModeToggle />
          <LanguageMenu />
          <AccountMenu />
          {showShoppingCartButton && (
            <CartIconButton onDrawerToggle={onDrawerToggle} />
          )}
        </Stack>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default HideAppBar;
