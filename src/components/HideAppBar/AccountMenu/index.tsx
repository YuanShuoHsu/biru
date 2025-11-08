// https://mui.com/material-ui/react-app-bar/#MenuAppBar.tsx
// https://mui.com/material-ui/react-app-bar/#ResponsiveAppBar.tsx
// https://mui.com/material-ui/react-menu/#AccountMenu.tsx
// https://mui.com/material-ui/react-avatar/#BadgeAvatars.tsx

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useMemo, useState } from "react";

import { AccountCircle, Logout, Person } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useAuthStore } from "@/stores/useAuthStore";

const StyledMenu = styled(Menu)(({ theme }) => ({
  marginTop: theme.spacing(6),

  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(7),
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.vars.palette.secondary.main,
    boxShadow: `0 0 0 2px ${theme.vars.palette.primary.main}`,
    color: theme.vars.palette.secondary.main,
    transition: theme.transitions.create(["background-color", "box-shadow"]),

    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      border: `1px solid ${theme.vars.palette.primary.main}`,
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
    },
  },
  [theme.getColorSchemeSelector("dark")]: {
    "& .MuiBadge-badge": {
      boxShadow: `0 0 0 2px ${theme.vars.palette.background.paper}`,

      "&::after": {
        border: `1px solid ${theme.vars.palette.background.paper}`,
      },
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { accessToken, profile, clearAuth } = useAuthStore();

  const isSignedIn = Boolean(accessToken && profile);

  const displayName = useMemo(() => {
    if (!profile) return "";
    const name = [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ");
    return name || profile.email || "Account";
  }, [profile]);

  const avatarInitial = useMemo(() => {
    if (!profile) return "";

    const source =
      profile.firstName ||
      profile.lastName ||
      profile.email ||
      profile.id ||
      "";
    return source.charAt(0).toUpperCase();
  }, [profile]);

  const { lang } = useParams();

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
          {isSignedIn ? (
            <StyledBadge
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              overlap="circular"
              variant="dot"
            >
              <Avatar
                alt={displayName}
                src={profile?.image}
                sx={{ width: 24, height: 24 }}
              >
                {avatarInitial}
              </Avatar>
            </StyledBadge>
          ) : (
            <AccountCircle />
          )}
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
