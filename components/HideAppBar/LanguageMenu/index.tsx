// https://github.com/vercel/next.js/tree/canary/examples/i18n-routing
// https://mui.com/material-ui/react-app-bar/#system-MenuAppBar.tsx
// https://mui.com/material-ui/react-app-bar/#system-ResponsiveAppBar.tsx

import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import type { Locale } from "@/app/[lang]/dictionaries";

import { languageLocaleMap } from "@/constants/locale";

import { i18n } from "@/i18n-config";

import { Language } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useI18nStore } from "@/providers/i18n-store-provider";

const StyledMenu = styled(Menu)(({ theme }) => ({
  marginTop: theme.spacing(6),

  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(7),
  },
}));

const languages = i18n.locales.map((lang) => ({
  lang,
  label: languageLocaleMap[lang],
}));

const LanguageMenu = () => {
  const [anchorElLanguage, setAnchorElLanguage] = useState<null | HTMLElement>(
    null,
  );
  const open = Boolean(anchorElLanguage);

  const { dict } = useI18nStore((state) => state);

  const { lang: currentLang } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const redirectedPathname = (lang: Locale) => {
    if (!pathname) return "/";

    const segments = pathname.split("/");
    segments[1] = lang;
    const search = searchParams.toString();

    return `${segments.join("/")}${search ? `?${search}` : ""}`;
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
            href={redirectedPathname(lang)}
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
