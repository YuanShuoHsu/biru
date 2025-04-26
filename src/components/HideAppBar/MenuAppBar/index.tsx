// https://mui.com/material-ui/react-app-bar/#system-MenuAppBar.tsx
// https://mui.com/material-ui/react-app-bar/#system-ResponsiveAppBar.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Language } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";

const languages = [
  { label: "繁體中文", lang: "zh-TW" },
  { label: "简体中文", lang: "zh-CN" },
  { label: "English", lang: "en" },
  { label: "日本語", lang: "ja" },
  { label: "한국어", lang: "ko" },
];

const MenuAppBar = () => {
  const [anchorElLanguage, setAnchorElLanguage] = useState<null | HTMLElement>(
    null,
  );

  const pathname = usePathname();

  const switchPath = (lang: string) => {
    const segments = pathname.split("/").slice(2);
    const rest = segments.join("/");
    return rest ? `/${lang}/${rest}` : `/${lang}`;
  };

  const handleOpenLanguageMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElLanguage(event.currentTarget);

  const handleCloseLanguageMenu = () => setAnchorElLanguage(null);

  return (
    <Box>
      <Tooltip title="切換語系">
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
        {languages.map(({ label, lang }) => (
          <MenuItem
            component={Link}
            href={switchPath(lang)}
            key={lang}
            onClick={handleCloseLanguageMenu}
            replace
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default MenuAppBar;
