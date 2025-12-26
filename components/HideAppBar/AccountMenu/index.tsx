// https://mui.com/material-ui/react-app-bar/#MenuAppBar.tsx
// https://mui.com/material-ui/react-app-bar/#ResponsiveAppBar.tsx
// https://mui.com/material-ui/react-menu/#AccountMenu.tsx
// https://mui.com/material-ui/react-tooltip/#DisabledTooltips.tsx

import NextLink from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import type { MouseEvent } from "react";
import { useState } from "react";

import BadgeAvatars from "@/components/BadgeAvatars";

import { useI18n } from "@/context/i18n";

import { useLogout } from "@/hooks/useLogout";

import { AccountCircle } from "@mui/icons-material";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useAuthStore } from "@/stores/useAuthStore";
import { RouteParams } from "@/types/routeParams";

import {
  AuthMenuItem,
  getAccountMenuItems,
  getDisplayName,
  getProfileMenuItems,
} from "@/utils/auth";
import { handleQueryParam, QueryParamKey } from "@/utils/queryParams";

const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== "isSignedIn",
})<{ isSignedIn: boolean }>(({ isSignedIn, theme }) => ({
  width: 24,
  height: 24,
  backgroundColor: isSignedIn
    ? theme.vars.palette.background.paper
    : "transparent",
  color: isSignedIn ? theme.vars.palette.primary.main : "inherit",
  transition: theme.transitions.create(["color", "background-color"]),

  ...(isSignedIn && {
    [theme.getColorSchemeSelector("dark")]: {
      backgroundColor: theme.vars.palette.common.white,
      color: theme.vars.palette.primary.contrastText,
    },
  }),
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  marginTop: theme.spacing(6),

  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(7),
  },

  "& .MuiPaper-root": {
    "& .MuiAvatar-root": {
      width: theme.spacing(2.5),
      height: theme.spacing(2.5),
    },

    "& .MuiListItemIcon-root": {
      minWidth: 0,
    },

    "& .MuiMenuItem-root": {
      gap: theme.spacing(2),
    },
  },
}));

const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { isAuthLoading, isSignedIn, profile } = useAuthStore();

  const { handleLogout, isMutatingLogout } = useLogout();

  const { lang } = useParams<RouteParams>();

  const displayName = getDisplayName(lang, profile);
  const avatarChild = !isSignedIn ? <AccountCircle /> : displayName[0];

  const dict = useI18n();
  const tooltipTitle = isSignedIn
    ? dict.member.accountSettings.label
    : dict.member.auth.signIn.label;

  const pathname = usePathname();

  const router = useRouter();

  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentURL = search ? `${pathname}?${search}` : pathname;

  const redirectParam = searchParams.get("redirect");
  const isCompanyPage = pathname.startsWith(`/${lang}/company`);
  const isMemberPage = pathname.startsWith(`/${lang}/member`);

  const redirectTarget =
    (isCompanyPage || isMemberPage) && redirectParam
      ? redirectParam
      : currentURL;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (isAuthLoading) return;

    if (!isSignedIn) {
      router.push(
        handleQueryParam(
          `/${lang}/member/sign-in`,
          QueryParamKey.Redirect,
          redirectTarget,
        ),
      );

      return;
    }

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const profileMenuItems = getProfileMenuItems(dict);
  const accountMenuItems = getAccountMenuItems(dict, {
    isMutatingLogout,
    onLogout: handleLogout,
  });

  const renderMenuItems = (items: AuthMenuItem[]) =>
    items.map(({ disabled, icon: Icon, label, onClick, to }) => {
      const key = to || label;
      const href = to && `/${lang}/member${to}`;

      const selected = href
        ? pathname === href || pathname.startsWith(`${href}/`)
        : false;

      return (
        <MenuItem
          disabled={disabled}
          key={key}
          onClick={onClick}
          selected={selected}
          {...(href ? { component: NextLink, href } : {})}
        >
          <ListItemIcon>
            <Icon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={label} />
        </MenuItem>
      );
    });

  return (
    <>
      <Tooltip title={tooltipTitle}>
        <span>
          <IconButton
            aria-controls={open ? "account-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            aria-label="account of current user"
            color="inherit"
            disabled={isAuthLoading}
            loading={isAuthLoading}
            onClick={handleClick}
          >
            <BadgeAvatars invisible={!isSignedIn}>
              <StyledAvatar
                alt={displayName}
                isSignedIn={isSignedIn}
                src={profile?.image}
              >
                {avatarChild}
              </StyledAvatar>
            </BadgeAvatars>
          </IconButton>
        </span>
      </Tooltip>
      <StyledMenu
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        id="account-menu"
        keepMounted
        onClick={handleClose}
        onClose={handleClose}
        open={open}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        {renderMenuItems(profileMenuItems)}
        <Divider />
        {renderMenuItems(accountMenuItems)}
      </StyledMenu>
    </>
  );
};

export default AccountMenu;
