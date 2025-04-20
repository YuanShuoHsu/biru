// https://mui.com/material-ui/react-drawer/#system-ResponsiveDrawer.tsx

import { useState } from "react";

import HideAppBar from "@/components/ResponsiveDrawer/HideAppBar";
import ScrollTop from "@/components/ResponsiveDrawer/ScrollTop";

import { drawerWidth } from "@/constants/ResponsiveDrawer";

import { KeyboardArrowUp, Mail, MoveToInbox } from "@mui/icons-material";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  Fab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const ContainerBox = styled(Box)({
  display: "flex",
});

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

const MainBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  width: "100%",
  flexGrow: 1,

  [theme.breakpoints.up("sm")]: {
    width: `calc(100% - ${drawerWidth}px)`,
  },
}));

const ResponsiveDrawer = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => setIsClosing(false);

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

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
    <ContainerBox>
      <CssBaseline />
      <HideAppBar onDrawerToggle={handleDrawerToggle} />
      <Toolbar disableGutters id="back-to-top-anchor" />
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
      <MainBox as="main">
        <Toolbar />
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel. Risus at
          ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
          quisque non tellus. Convallis convallis tellus id interdum velit
          laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
          adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
          integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
          eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
          quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
          vivamus at augue. At augue eget arcu dictum varius duis at consectetur
          lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
          faucibus et molestie ac.
        </Typography>
      </MainBox>
      <ScrollTop>
        <Fab aria-label="scroll back to top" size="small">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
    </ContainerBox>
  );
};

export default ResponsiveDrawer;
