// https://mui.com/material-ui/react-app-bar/#system-HideAppBar.tsx

import HideOnScroll from "./HideOnScroll";
import MenuAppBar from "./MenuAppBar";

import CustomizedBadges from "@/components/CustomizedBadges";

import { drawerWidth } from "@/constants/ResponsiveDrawer";
import { Menu, ShoppingCart } from "@mui/icons-material";
import { AppBar, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  width: "100%",
  marginLeft: 0,

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
            <IconButton aria-label="cart" onClick={onCartToggle}>
              <CustomizedBadges badgeContent={4}>
                <ShoppingCart />
              </CustomizedBadges>
            </IconButton>
          </Stack>
        </StyledToolbar>
      </StyledAppBar>
    </HideOnScroll>
  );
};
export default HideAppBar;
