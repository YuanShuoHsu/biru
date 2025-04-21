import { useState } from "react";

import ScrollTop from "@/components/ScrollTop";

import HideAppBar from "@/components/HideAppBar";
import { drawerWidth } from "@/constants/ResponsiveDrawer";

import ResponsiveDrawer from "@/components/ResponsiveDrawer";
import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, CssBaseline, Fab, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const ContainerBox = styled(Box)({
  display: "flex",
});

const MainBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  width: "100%",
  flexGrow: 1,

  [theme.breakpoints.up("sm")]: {
    width: `calc(100% - ${drawerWidth}px)`,
  },
}));

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => setIsClosing(false);

  return (
    <ContainerBox>
      <CssBaseline />
      <HideAppBar onDrawerToggle={handleDrawerToggle} />
      <Toolbar disableGutters id="back-to-top-anchor" />
      <ResponsiveDrawer
        handleDrawerClose={handleDrawerClose}
        handleDrawerTransitionEnd={handleDrawerTransitionEnd}
        mobileOpen={mobileOpen}
      />
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

export default Layout;
