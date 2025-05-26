// https://mui.com/material-ui/react-drawer/#system-ResponsiveDrawer.tsx

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { drawerWidth } from "@/constants/responsiveDrawer";

import { Mail, MoveToInbox } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import theme from "@/theme";

const NavBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    width: drawerWidth,
    flexShrink: 0,
  },
}));

const TemporaryDrawer = styled(Drawer)(({ theme }) => ({
  display: "block",

  [theme.breakpoints.up("sm")]: {
    display: "none",
  },

  "& .MuiDrawer-paper": {
    boxSizing: "border-box",
    width: drawerWidth,
  },
}));

const PermanentDrawer = styled(Drawer)(({ theme }) => ({
  display: "none",

  [theme.breakpoints.up("sm")]: {
    display: "block",
  },

  "& .MuiDrawer-paper": {
    boxSizing: "border-box",
    width: drawerWidth,
  },
}));

const navItems = [
  { href: "/", text: "Home" },
  { href: "/order", text: "Order" },
];

interface ResponsiveDrawerProps {
  mobileOpen: boolean;
  onDrawerClose: () => void;
  onDrawerToggle: () => void;
  onDrawerTransitionEnd: () => void;
}

const ResponsiveDrawer = ({
  onDrawerClose,
  onDrawerToggle,
  onDrawerTransitionEnd,
  mobileOpen,
}: ResponsiveDrawerProps) => {
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const pathname = usePathname();
  const { lang } = useParams();

  const drawer = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {navItems.map(({ href, text }, index) => {
          const localizedHref = `/${lang}${href}`;

          return (
            <ListItem key={href} disablePadding>
              <ListItemButton
                component={Link}
                href={localizedHref}
                selected={pathname === localizedHref}
                onClick={isSmUp ? undefined : onDrawerToggle}
              >
                <ListItemIcon>
                  {index % 2 === 0 ? <MoveToInbox /> : <Mail />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <NavBox aria-label="folders" as="nav">
      <TemporaryDrawer
        ModalProps={{
          keepMounted: true,
        }}
        onClose={onDrawerClose}
        onTransitionEnd={onDrawerTransitionEnd}
        open={mobileOpen}
        variant="temporary"
      >
        {drawer}
      </TemporaryDrawer>
      <PermanentDrawer open variant="permanent">
        {drawer}
      </PermanentDrawer>
    </NavBox>
  );
};

export default ResponsiveDrawer;
