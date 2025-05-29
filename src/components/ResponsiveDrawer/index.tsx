// https://mui.com/material-ui/react-drawer/#system-ResponsiveDrawer.tsx
// https://mui.com/material-ui/react-list/#NestedList.tsx

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Fragment, useState } from "react";

import { drawerWidth } from "@/constants/responsiveDrawer";

import {
  ExpandLess,
  ExpandMore,
  Home,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
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

interface NavItem {
  href: string;
  icon: React.ComponentType;
  text: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { href: "", icon: Home, text: "Home" },
  {
    // children: [{ href: "/order/checkout", icon: Payment, text: "Checkout" }],
    href: "/order",
    icon: ShoppingCart,
    text: "Order",
  },
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

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const handleIconButtonToggle = (href: string) =>
    setOpenMap((prev) => ({ ...prev, [href]: !prev[href] }));

  const renderItems = (items: NavItem[], depth = 0) =>
    items.map(({ children, href, icon: Icon, text }) => {
      const hasChildren = children?.length;

      const fullPath = `/${lang}${href}`;
      const isHome = href === "";
      const selected = isHome
        ? pathname === fullPath
        : pathname === fullPath || pathname.startsWith(`${fullPath}/`);

      const paddingLeft = 2 + depth * 2;

      return (
        <Fragment key={href}>
          <ListItem
            disablePadding
            secondaryAction={
              hasChildren && (
                <IconButton
                  edge="end"
                  onClick={() => handleIconButtonToggle(href)}
                  size="small"
                >
                  {openMap[href] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )
            }
          >
            <ListItemButton
              component={Link}
              href={fullPath}
              onClick={isSmUp ? undefined : onDrawerToggle}
              selected={selected}
              sx={{ pl: paddingLeft }}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
          {hasChildren && (
            <Collapse in={openMap[href]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderItems(children!, depth + 1)}
              </List>
            </Collapse>
          )}
        </Fragment>
      );
    });

  const drawer = (
    <Box>
      <Toolbar />
      <Divider />
      <List>{renderItems(navItems)}</List>
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
