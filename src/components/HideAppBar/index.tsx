// https://mui.com/material-ui/react-app-bar/#system-HideAppBar.tsx

import { useParams, usePathname } from "next/navigation";

import HideOnScroll from "./HideOnScroll";
import MenuAppBar from "./MenuAppBar";

import CustomizedBadges from "@/components/CustomizedBadges";

import { Menu, ShoppingCart } from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCartStore } from "@/stores/useCartStore";

import { DrawerType } from "@/types/drawer";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
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

  const basePath = `/${lang}/order/${tableNumber}`;
  const showShoppingCartButton =
    pathname === basePath || pathname === `${basePath}/checkout`;

  const { totalQuantity } = useCartStore();

  return (
    <HideOnScroll>
      <AppBar position="fixed">
        <StyledToolbar>
          <IconButton
            aria-label="open drawer"
            color="inherit"
            edge="start"
            onClick={onDrawerToggle("nav", true)}
          >
            <Menu />
          </IconButton>
          <Typography component="div" flexGrow="1" noWrap variant="h6">
            Biru Coffee
          </Typography>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <MenuAppBar />
            {showShoppingCartButton && (
              <Tooltip title="購物車">
                <IconButton
                  aria-label="cart"
                  onClick={onDrawerToggle("cart", true)}
                >
                  <CustomizedBadges badgeContent={totalQuantity}>
                    <ShoppingCart />
                  </CustomizedBadges>
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </StyledToolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default HideAppBar;
