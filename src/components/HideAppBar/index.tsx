// https://mui.com/material-ui/react-app-bar/#system-HideAppBar.tsx

import { useParams, usePathname } from "next/navigation";

import HideOnScroll from "./HideOnScroll";
import MenuAppBar from "./MenuAppBar";

import CustomizedBadges from "@/components/CustomizedBadges";

import { drawerWidth } from "@/constants/responsiveDrawer";

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

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  width: "100%",
  marginLeft: 0,
  backgroundColor: "blue",

  [theme.breakpoints.up("sm")]: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  display: "flex",

  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

interface HideAppBarProps {
  onCartToggle: () => void;
  onDrawerToggle: () => void;
}

const HideAppBar = ({ onCartToggle, onDrawerToggle }: HideAppBarProps) => {
  const pathname = usePathname();
  const { lang, tableNumber } = useParams();

  const basePath = `/${lang}/order/${tableNumber}`;
  const showShoppingCartButton =
    pathname === basePath || pathname === `${basePath}/checkout`;

  const { totalQuantity } = useCartStore();

  return (
    <HideOnScroll>
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <StyledIconButton
            aria-label="open drawer"
            color="inherit"
            edge="start"
            onClick={onDrawerToggle}
          >
            <Menu />
          </StyledIconButton>
          <Typography component="div" flexGrow="1" noWrap variant="h6">
            Biru Coffee
          </Typography>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <MenuAppBar />
            {showShoppingCartButton && (
              <Tooltip title="購物車">
                <IconButton aria-label="cart" onClick={onCartToggle}>
                  <CustomizedBadges badgeContent={totalQuantity}>
                    <ShoppingCart />
                  </CustomizedBadges>
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </StyledToolbar>
      </StyledAppBar>
    </HideOnScroll>
  );
};

export default HideAppBar;
