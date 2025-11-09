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

import BadgeAvatars from "@/components/BadgeAvatars";

import { AccountCircle, Logout, Person } from "@mui/icons-material";
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

import { RouteParams } from "@/types/routeParams";

import { getDisplayName } from "@/utils/profile";

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
  const { lang } = useParams<RouteParams>();
  const isSignedIn = Boolean(accessToken && profile);
  const displayName = getDisplayName(profile, lang);

  const pathname = usePathname();

  const router = useRouter();

  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentURL = search ? `${pathname}?${search}` : pathname;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!isSignedIn) {
      const memberSignInPath = `/${lang}/member/sign-in`;
      const redirectParam = searchParams.get("redirect");
      const isMemberPage = pathname.startsWith(`/${lang}/member`);
      const redirectTarget =
        isMemberPage && redirectParam ? redirectParam : currentURL;

      router.push(
        `${memberSignInPath}?redirect=${encodeURIComponent(redirectTarget)}`,
      );

      return;
    }

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    clearAuth();
    handleClose();
  };

  return (
    <>
      <Tooltip title={isSignedIn ? "Account settings" : "Sign in"}>
        <IconButton
          aria-controls={open ? "account-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          aria-label="account of current user"
          color="inherit"
          onClick={handleClick}
        >
          <BadgeAvatars invisible={!isSignedIn}>
            <Avatar
              alt={displayName}
              src={profile?.image}
              sx={(theme) => ({
                width: 24,
                height: 24,
                bgcolor: isSignedIn
                  ? theme.vars.palette.background.paper
                  : "transparent",
                color: isSignedIn ? theme.vars.palette.primary.main : "inherit",
                transition: theme.transitions.create("color"),

                ...(isSignedIn && {
                  [theme.getColorSchemeSelector("dark")]: {
                    bgcolor: theme.vars.palette.common.white,
                    color: theme.vars.palette.primary.contrastText,
                  },
                }),
              })}
            >
              {!isSignedIn && <AccountCircle color="inherit" />}
            </Avatar>
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
        </MenuItem>
        <Divider /> */}
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
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </StyledMenu>
    </>
  );
};

export default AccountMenu;
