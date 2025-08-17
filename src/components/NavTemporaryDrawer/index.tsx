// https://mui.com/material-ui/react-drawer/#AnchorTemporaryDrawer.tsx
// https://mui.com/material-ui/react-list/#NestedList.tsx
// https://mui.com/material-ui/react-breadcrumbs/#RouterBreadcrumbs.tsx

import { useParams, usePathname, useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import { I18nDict, useI18n } from "@/context/i18n";

import {
  AccountCircle,
  ExpandLess,
  ExpandMore,
  Home,
  Login,
  PersonAdd,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { DrawerType } from "@/types/drawer";

const StyledBox = styled(Box)({
  width: 250,
});

interface StyledListItemButtonProps extends ListItemButtonProps {
  depth: number;
}

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "depth",
})<StyledListItemButtonProps>(({ depth, theme }) => ({
  paddingLeft: theme.spacing(2 + depth * 2),
}));

interface NavItem {
  children?: NavItem[];
  href: string;
  icon: React.ComponentType;
  label: string;
}

const navItemsMap = (dict: I18nDict): NavItem[] => [
  { href: "", icon: Home, label: dict.nav.home },
  { href: "/order", icon: ShoppingCart, label: dict.nav.order },
  {
    // auth: "any",
    children: [
      {
        // auth: "guest",
        href: "/member/sign-in",
        icon: Login,
        label: dict.nav.signIn,
      },
      {
        // auth: "guest",
        href: "/member/sign-up",
        icon: PersonAdd,
        label: dict.nav.signUp,
      },
    ],
    href: "/member",
    icon: AccountCircle,
    label: dict.nav.member,
  },
];

interface NavTemporaryDrawerProps {
  onDrawerToggle: (
    type: DrawerType,
    open: boolean,
  ) => (event: React.MouseEvent | React.KeyboardEvent) => void;
  open: boolean;
}

const NavTemporaryDrawer = ({
  onDrawerToggle,
  open,
}: NavTemporaryDrawerProps) => {
  const pathname = usePathname();
  const { lang } = useParams();
  const router = useRouter();

  const dict = useI18n();
  const navItems = navItemsMap(dict);

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const handleIconButtonToggle = (href: string) =>
    setOpenMap((prev) => ({ ...prev, [href]: !prev[href] }));

  const renderItems = (items: NavItem[], depth = 0) =>
    items.map(({ children, href, icon: Icon, label }) => {
      const hasChildren = children?.length;
      const open = openMap[href];

      const fullPath = `/${lang}${href}`;
      const isHome = href === "";
      const selected = isHome
        ? pathname === fullPath
        : pathname === fullPath || pathname.startsWith(`${fullPath}/`);

      const handleListItemButtonClick = (event: React.MouseEvent) => {
        if (hasChildren) {
          event.stopPropagation();
          handleIconButtonToggle(href);
          return;
        }

        router.push(fullPath);
      };

      return (
        <Fragment key={href}>
          <StyledListItemButton
            depth={depth}
            onClick={handleListItemButtonClick}
            selected={selected}
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={label} />
            {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
          </StyledListItemButton>
          {hasChildren && (
            <Collapse component="li" in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderItems(children!, depth + 1)}
              </List>
            </Collapse>
          )}
        </Fragment>
      );
    });

  const list = (
    <StyledBox
      onClick={onDrawerToggle("nav", false)}
      onKeyDown={onDrawerToggle("nav", false)}
      role="presentation"
    >
      <Toolbar />
      <Divider />
      <List component="nav">{renderItems(navItems)}</List>
    </StyledBox>
  );

  return (
    <Drawer
      ModalProps={{ keepMounted: true }}
      onClose={onDrawerToggle("nav", false)}
      open={open}
    >
      {list}
    </Drawer>
  );
};

export default NavTemporaryDrawer;
