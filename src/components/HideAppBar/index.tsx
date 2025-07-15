// https://mui.com/material-ui/react-app-bar/#system-HideAppBar.tsx

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import HideOnScroll from "./HideOnScroll";
import MenuAppBar from "./MenuAppBar";
import ModeToggle from "./ModeToggle";

import CustomizedBadges from "@/components/CustomizedBadges";

import { useI18n } from "@/context/i18n";

import { Menu, ShoppingCart } from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/stores/useCartStore";

import type { DrawerType } from "@/types/drawer";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  transition: theme.transitions.create(["background-color"]),
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

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: theme.transitions.create(["color"]),
}));

interface HideAppBarProps {
  onDrawerToggle: (
    type: DrawerType,
    open: boolean,
  ) => (event: React.MouseEvent | React.KeyboardEvent) => void;
}

const HideAppBar = ({ onDrawerToggle }: HideAppBarProps) => {
  const pathname = usePathname();
  const { lang, tableNumber } = useParams();

  const dict = useI18n();

  const basePath = `/${lang}/order/${tableNumber}`;
  const showShoppingCartButton =
    pathname === basePath || pathname === `${basePath}/checkout`;

  const { totalQuantity } = useCartStore();

  return (
    <HideOnScroll>
      <StyledAppBar>
        <StyledToolbar>
          <Stack flexDirection="row" alignItems="center" gap={1}>
            <IconButton
              aria-label="open drawer"
              color="inherit"
              edge="start"
              onClick={onDrawerToggle("nav", true)}
            >
              <Menu />
            </IconButton>
            <Stack
              component={Link}
              href={`/${lang}`}
              flexDirection="row"
              alignItems="center"
              gap={1}
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
              <Typography component="span" variant="h6">
                Biru Coffee
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <ModeToggle />
            <MenuAppBar />
            {showShoppingCartButton && (
              <Tooltip title={dict.appBar.cart}>
                <StyledIconButton
                  aria-label="cart"
                  color="inherit"
                  onClick={onDrawerToggle("cart", true)}
                >
                  <CustomizedBadges badgeContent={totalQuantity}>
                    <ShoppingCart />
                  </CustomizedBadges>
                </StyledIconButton>
              </Tooltip>
            )}
          </Stack>
        </StyledToolbar>
      </StyledAppBar>
    </HideOnScroll>
  );
};

export default HideAppBar;
