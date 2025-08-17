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
  SvgIconProps,
  Toolbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { DrawerType } from "@/types/drawer";

const StyledBox = styled(Box)({
  width: 250,
});

interface StyledListItemButtonProps extends ListItemButtonProps {
  level: number;
}

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "level",
})<StyledListItemButtonProps>(({ level, theme }) => ({
  paddingLeft: theme.spacing(2 + level * 2),
}));

interface NavItem {
  children?: NavItem[];
  icon: React.ComponentType;
  label: string;
  to: string;
}

const navItemsMap = (dict: I18nDict): NavItem[] => [
  { icon: Home, label: dict.nav.home, to: "" },
  { icon: ShoppingCart, label: dict.nav.order, to: "/order" },
  {
    // auth: "any",
    children: [
      {
        // auth: "guest",
        icon: Login,
        label: dict.nav.signIn,
        to: "/member/sign-in",
      },
      {
        // auth: "guest",
        icon: PersonAdd,
        label: dict.nav.signUp,
        to: "/member/sign-up",
      },
    ],
    icon: AccountCircle,
    label: dict.nav.member,
    to: "/member",
  },
];

interface ListItemLinkProps extends ListItemButtonProps {
  hasChildren?: boolean;
  icon: React.ComponentType<SvgIconProps>;
  label: string;
  level: number;
  open?: boolean;
}

const ListItemLink = ({
  hasChildren,
  icon: Icon,
  label,
  level,
  onClick,
  open,
  selected,
  ...other
}: ListItemLinkProps) => (
  <StyledListItemButton
    level={level}
    selected={selected}
    onClick={onClick}
    {...other}
  >
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText primary={label} />
    {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
  </StyledListItemButton>
);

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

  const handleIconButtonToggle = (to: string) =>
    setOpenMap((prev) => ({ ...prev, [to]: !prev[to] }));

  const renderItems = (items: NavItem[], level = 0) =>
    items.map(({ children, icon, label, to }) => {
      const hasChildren = !!children?.length;
      const open = openMap[to];

      const fullPath = `/${lang}${to}`;
      const isHome = to === "";
      const selected = isHome
        ? pathname === fullPath
        : pathname === fullPath || pathname.startsWith(`${fullPath}/`);

      const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (hasChildren) {
          event.stopPropagation();
          handleIconButtonToggle(to);
          return;
        }

        router.push(fullPath);
      };

      return (
        <Fragment key={to}>
          <ListItemLink
            hasChildren={hasChildren}
            icon={icon}
            label={label}
            level={level}
            onClick={handleClick}
            open={open}
            selected={selected}
          />
          {hasChildren && (
            <Collapse component="li" in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderItems(children!, level + 1)}
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
