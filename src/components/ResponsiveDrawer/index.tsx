// https://mui.com/material-ui/react-drawer/#system-ResponsiveDrawer.tsx

import { drawerWidth } from "@/constants/ResponsiveDrawer";
import { Mail, MoveToInbox } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const NavBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    width: drawerWidth,
    flexShrink: 0,
  },
}));

const TemporaryDrawer = styled(Drawer)(({ theme }) => ({
  display: "block",

  [theme.breakpoints.up("sm")]: {
    display: "none",
  },

  "& .MuiDrawer-paper": {
    boxSizing: "border-box",
    width: drawerWidth,
  },
}));

const PermanentDrawer = styled(Drawer)(({ theme }) => ({
  display: "none",

  [theme.breakpoints.up("sm")]: {
    display: "block",
  },

  "& .MuiDrawer-paper": {
    boxSizing: "border-box",
    width: drawerWidth,
  },
}));

interface ResponsiveDrawerProps {
  mobileOpen: boolean;
  handleDrawerClose: () => void;
  handleDrawerTransitionEnd: () => void;
}

const ResponsiveDrawer = ({
  handleDrawerClose,
  handleDrawerTransitionEnd,
  mobileOpen,
}: ResponsiveDrawerProps) => {
  const drawer = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {["Home", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <MoveToInbox /> : <Mail />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <NavBox aria-label="folders" as="nav">
      <TemporaryDrawer
        ModalProps={{
          keepMounted: true,
        }}
        onClose={handleDrawerClose}
        onTransitionEnd={handleDrawerTransitionEnd}
        open={mobileOpen}
        variant="temporary"
      >
        {drawer}
      </TemporaryDrawer>
      <PermanentDrawer open variant="permanent">
        {drawer}
      </PermanentDrawer>
    </NavBox>
  );
};

export default ResponsiveDrawer;
