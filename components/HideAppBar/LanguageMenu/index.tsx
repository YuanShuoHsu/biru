// https://github.com/vercel/next.js/tree/canary/examples/i18n-routing
// https://mui.com/material-ui/react-app-bar/#system-MenuAppBar.tsx
// https://mui.com/material-ui/react-app-bar/#system-ResponsiveAppBar.tsx

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import { languageLocaleMap } from "@/constants/locale";

import { type Locale, routing } from "@/i18n/routing";

import { Language } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledMenu = styled(Menu)(({ theme }) => ({
  marginTop: theme.spacing(6),

  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(7),
  },
}));

const languages = routing.locales.map((locale) => ({
  locale,
  label: languageLocaleMap[locale],
}));

const LanguageMenu = () => {
  const [anchorElLanguage, setAnchorElLanguage] = useState<null | HTMLElement>(
    null,
  );
  const open = Boolean(anchorElLanguage);

  const tAppBar = useTranslations("appBar");

  const { locale: currentLang } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return "/";

    const segments = pathname.split("/");
    segments[1] = locale;
    const search = searchParams.toString();

    return `${segments.join("/")}${search ? `?${search}` : ""}`;
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElLanguage(event.currentTarget);

  const handleClose = () => setAnchorElLanguage(null);

  return (
    <>
      <Tooltip title={tAppBar("languageSwitcher")}>
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
        {languages.map(({ label, locale }) => (
          <MenuItem
            component={Link}
            href={redirectedPathname(locale)}
            key={locale}
            onClick={handleClose}
            replace
            selected={locale === currentLang}
          >
            {label}
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  );
};

export default LanguageMenu;
