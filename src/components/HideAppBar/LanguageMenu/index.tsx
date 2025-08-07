// https://mui.com/material-ui/react-app-bar/#system-MenuAppBar.tsx
// https://mui.com/material-ui/react-app-bar/#system-ResponsiveAppBar.tsx

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";

import { useI18n } from "@/context/i18n";

import { Language } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";

const languages = [
  { label: "繁體中文", lang: "zh-TW" },
  { label: "English", lang: "en" },
  { label: "日本語", lang: "ja" },
  { label: "한국어", lang: "ko" },
  { label: "简体中文", lang: "zh-CN" },
];

const StyledMenu = styled(Menu)(({ theme }) => ({
  marginTop: theme.spacing(6),

  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(7),
  },
}));

const LanguageMenu = () => {
  const [anchorElLanguage, setAnchorElLanguage] = useState<null | HTMLElement>(
    null,
  );
  const open = Boolean(anchorElLanguage);

  const pathname = usePathname();
  const { lang: currentLang } = useParams();

  const dict = useI18n();

  const switchPath = (lang: string) => {
    const rest = pathname.split("/").slice(2).join("/");

    return `/${lang}${rest ? `/${rest}` : ""}`;
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElLanguage(event.currentTarget);

  const handleClose = () => setAnchorElLanguage(null);

  return (
    <>
      <Tooltip title={dict.appBar.languageSwitcher}>
        <IconButton
          aria-controls={open ? "language-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          aria-label="language"
          color="inherit"
          onClick={handleClick}
        >
          <Language />
        </IconButton>
      </Tooltip>
      <StyledMenu
        anchorEl={anchorElLanguage}
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        id="menu-appbar"
        keepMounted
        onClick={handleClose}
        onClose={handleClose}
        open={open}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
      >
        {languages.map(({ label, lang }) => (
          <MenuItem
            component={Link}
            href={switchPath(lang)}
            key={lang}
            onClick={handleClose}
            replace
            selected={lang === currentLang}
          >
            {label}
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  );
};

export default LanguageMenu;
