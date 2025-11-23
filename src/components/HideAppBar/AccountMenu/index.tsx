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
import React, { useState } from "react";
import useSWRMutation from "swr/mutation";

import BadgeAvatars from "@/components/BadgeAvatars";

import { useI18n } from "@/context/i18n";

import {
  AccountCircle,
  Logout,
  PersonAdd,
  Settings,
} from "@mui/icons-material";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useAuthStore } from "@/stores/useAuthStore";
import type { LogoutResponseDto } from "@/types/auth/logout-response.dto";
import { RouteParams } from "@/types/routeParams";

import { sendRequest } from "@/utils/fetcher";
import { getDisplayName } from "@/utils/profile";

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
    "& .MuiMenuItem-root": {
      gap: theme.spacing(2),
    },

    "& .MuiListItemIcon-root": {
      minWidth: 0,
    },

    "& .MuiAvatar-root": {
      width: 20,
      height: 20,
    },
  },
}));

interface AuthMenuItem {
  disabled?: boolean;
  icon: React.ElementType;
  label: React.ReactNode;
  onClick?: () => void;
  to?: string;
}

const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { accessToken, clearAuth, isRefreshing, profile } = useAuthStore();

  const { isMutating: isMutatingLogout, trigger: triggerLogout } =
    useSWRMutation<LogoutResponseDto, Error, string>(
      "/api/auth/logout",
      sendRequest({
        credentials: "include",
      }),
    );

  const { lang } = useParams<RouteParams>();
  const memberBasePath = `/${lang}/member`;

  const isSignedIn = Boolean(accessToken && profile);
  const displayName = getDisplayName(profile, lang);

  const dict = useI18n();
  const tooltipTitle = isSignedIn
    ? dict.member.accountSettings.label
    : dict.member.auth.signIn.label;

  const pathname = usePathname();

  const router = useRouter();

  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentURL = search ? `${pathname}?${search}` : pathname;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isRefreshing) return;

    if (!isSignedIn) {
      const redirectParam = searchParams.get("redirect");
      const isMemberPage = pathname.startsWith(`/${lang}/member`);
      const redirectTo =
        isMemberPage && redirectParam ? redirectParam : currentURL;

      router.push(
        `/${lang}/member/sign-in?redirect=${encodeURIComponent(redirectTo)}`,
      );

      return;
    }

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await triggerLogout();
    } finally {
      clearAuth();
    }
  };

  // label 未來要修正
  const profileMenuItems: AuthMenuItem[] = [
    {
      icon: Avatar,
      label: dict.member.accountMenu.profile,
      to: "/profile",
    },
    {
      icon: Avatar,
      label: dict.member.accountMenu.myAccount,
      to: "/my-account",
    },
  ];

  const accountMenuItems: AuthMenuItem[] = [
    {
      icon: PersonAdd,
      label: dict.member.accountMenu.addAnotherAccount,
      to: "/add-another-account",
    },
    {
      icon: Settings,
      label: dict.member.accountMenu.settings,
      to: "/settings",
    },
    {
      disabled: isMutatingLogout,
      icon: Logout,
      label: dict.member.auth.signOut.label,
      onClick: handleLogout,
    },
  ];

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
            disabled={isRefreshing}
            loading={isRefreshing}
            onClick={handleClick}
          >
            <BadgeAvatars invisible={!isSignedIn}>
              <StyledAvatar
                alt={displayName}
                isSignedIn={isSignedIn}
                src={profile?.image}
              >
                {!isSignedIn && <AccountCircle />}
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
        {profileMenuItems.map(
          ({ disabled, icon: Icon, label, onClick, to }, index) => {
            const href = to ? `${memberBasePath}${to}` : undefined;
            const menuItemProps = href ? { component: NextLink, href } : {};
            const menuItemKey = href || `profile-menuItem-${index}`;

            return (
              <MenuItem
                {...menuItemProps}
                disabled={disabled}
                key={menuItemKey}
                onClick={onClick}
              >
                <ListItemIcon>
                  <Icon fontSize="small" />
                </ListItemIcon>
                {label}
              </MenuItem>
            );
          },
        )}
        <Divider />
        {accountMenuItems.map(
          ({ disabled, icon: Icon, label, onClick, to }, index) => {
            const href = to ? `${memberBasePath}${to}` : undefined;
            const menuItemProps = href ? { component: NextLink, href } : {};
            const menuItemKey = href || `account-menuItem-${index}`;

            return (
              <MenuItem
                {...menuItemProps}
                disabled={disabled}
                key={menuItemKey}
                onClick={onClick}
              >
                <ListItemIcon>
                  <Icon fontSize="small" />
                </ListItemIcon>
                {label}
              </MenuItem>
            );
          },
        )}
      </StyledMenu>
    </>
  );
};

export default AccountMenu;
