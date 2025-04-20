// https://mui.com/material-ui/react-app-bar/#system-HideAppBar.tsx

import CustomizedBadges from "@/components/CustomizedBadges";
import HideOnScroll from "@/components/ResponsiveDrawer/HideAppBar/HideOnScroll";

import { drawerWidth } from "@/constants/ResponsiveDrawer";

import { Menu } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
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
  onDrawerToggle: () => void;
}

const HideAppBar: React.FC<HideAppBarProps> = ({ onDrawerToggle }) => {
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
            Responsive drawer
          </Typography>
          <CustomizedBadges />
        </StyledToolbar>
      </StyledAppBar>
    </HideOnScroll>
  );
};
export default HideAppBar;
