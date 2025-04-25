// https://mui.com/material-ui/react-app-bar/#system-MenuAppBar.tsx
// https://mui.com/material-ui/react-app-bar/#system-ResponsiveAppBar.tsx

import { useState } from "react";

import { Language } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";

const MenuAppBar = () => {
  const [anchorElLanguage, setAnchorElLanguage] = useState<null | HTMLElement>(
    null,
  );

  const handleOpenLanguageMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElLanguage(event.currentTarget);

  const handleCloseLanguageMenu = () => setAnchorElLanguage(null);

  return (
    <Box>
      <Tooltip title="Open settings">
        <IconButton
          aria-label="language"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenLanguageMenu}
          //   color="inherit"
        >
          <Language />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElLanguage}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElLanguage)}
        onClose={handleCloseLanguageMenu}
      >
        <MenuItem onClick={handleCloseLanguageMenu}>Profile</MenuItem>
        <MenuItem onClick={handleCloseLanguageMenu}>My account</MenuItem>
      </Menu>
    </Box>
  );
};

export default MenuAppBar;
