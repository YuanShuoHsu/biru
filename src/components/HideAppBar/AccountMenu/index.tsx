// https://mui.com/material-ui/react-app-bar/#MenuAppBar.tsx
// https://mui.com/material-ui/react-app-bar/#ResponsiveAppBar.tsx
// https://mui.com/material-ui/react-menu/#AccountMenu.tsx

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
  Person,
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
}));

const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { accessToken, clearAuth, profile } = useAuthStore();

  const { isMutating: isMutatingLogout, trigger: triggerLogout } =
    useSWRMutation<LogoutResponseDto, Error, string>(
      "/api/auth/logout",
      sendRequest({
        credentials: "include",
      }),
    );

  const { lang } = useParams<RouteParams>();

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

  const handleAccountSettings = () => {
    if (!isSignedIn) return;

    router.push(`/${lang}/member/account-settings`);
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await triggerLogout();
    } finally {
      clearAuth();
      handleClose();
    }
  };

  return (
    <>
      <Tooltip title={tooltipTitle}>
        <IconButton
          aria-controls={open ? "account-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          aria-label="account of current user"
          color="inherit"
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
        {/* <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem> */}
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleAccountSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem disabled={isMutatingLogout} onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {dict.member.auth.signOut.label}
        </MenuItem>
      </StyledMenu>
    </>
  );
};

export default AccountMenu;
