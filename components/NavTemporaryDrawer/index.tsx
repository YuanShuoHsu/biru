// https://mui.com/material-ui/react-drawer/#AnchorTemporaryDrawer.tsx
// https://mui.com/material-ui/react-list/#NestedList.tsx
// https://mui.com/material-ui/react-breadcrumbs/#RouterBreadcrumbs.tsx

import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { Fragment, useState } from "react";
import useSWR from "swr";

import { ORDER_MODE } from "@/constants/orderMode";

import { useLogout } from "@/hooks/useLogout";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

import {
  AccountCircle,
  ExpandMore,
  Group,
  Home,
  LocalMall,
  Person,
  Restaurant,
  ShoppingCart,
  Storefront,
  TableBar,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  type ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useAuthStore } from "@/providers/auth-store-provider";
import { useDrawerStore } from "@/providers/drawer-store-provider";

import type { MenuItem } from "@/types/menuItem";
import type { PartySize } from "@/types/partySize";
import type { RouteParams } from "@/types/routeParams";
import type { Store, StoreName } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

import { getAccountMenuItems, getProfileMenuItems } from "@/utils/account";
import { getAuthMenuItems, getLogoutMenuItem } from "@/utils/auth";
import { handleDrawerToggle } from "@/utils/drawer";
import { getStoreName } from "@/utils/stores";

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
  gap: theme.spacing(4),

  "&.Mui-selected": {
    backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${level * 0.1}))`,

    "&:hover": {
      backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.hoverOpacity} + ${level * 0.1}))`,
    },
  },

  "& .MuiAvatar-root": {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },

  "& .MuiListItemIcon-root": {
    minWidth: 0,
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  marginLeft: "auto",
  padding: theme.spacing(0.5),
}));

const StyledDivider = styled(Divider, {
  shouldForwardProp: (prop) => prop !== "level",
})<{ level: number }>(({ level, theme }) => ({
  marginBlock: theme.spacing(1),
  marginLeft: theme.spacing(level * 2),
}));

const StyledExpandMore = styled(ExpandMore, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ open, theme }) => ({
  transform: open ? "rotate(180deg)" : "rotate(0deg)",
  transition: theme.transitions.create("transform"),
}));

const createDineInSlot = (
  tOrder: ReturnType<typeof useTranslations<"order">>,
  storeName: StoreName,
  tableNumber?: TableNumber,
  partySize?: PartySize,
  onClick?: () => void,
): MenuItem => ({
  slot: ({ level }) => (
    <StyledListItemButton level={level} onClick={onClick} selected={true}>
      <Stack
        width="100%"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
      >
        <Stack gap={1}>
          <Stack flexDirection="row" alignItems="center" gap={4}>
            <ListItemIcon>
              <Storefront />
            </ListItemIcon>
            <ListItemText primary={storeName} />
          </Stack>
          {tableNumber && (
            <Stack flexDirection="row" alignItems="center" gap={4}>
              <ListItemIcon>
                <TableBar />
              </ListItemIcon>
              <ListItemText
                primary={tOrder("mode.dineIn.storeSlug.tableNumber.value", {
                  tableNumber,
                })}
              />
            </Stack>
          )}
          {partySize && (
            <Stack flexDirection="row" alignItems="center" gap={4}>
              <ListItemIcon>
                {partySize === "1" ? <Person /> : <Group />}
              </ListItemIcon>
              <ListItemText
                primary={tOrder(
                  "mode.dineIn.storeSlug.tableNumber.partySize.select.value",
                  { count: partySize },
                )}
              />
            </Stack>
          )}
        </Stack>
        <StyledChip
          color="primary"
          icon={<Restaurant />}
          label={tOrder("mode.dineIn.label")}
          size="small"
          variant="outlined"
        />
      </Stack>
    </StyledListItemButton>
  ),
});

const dividerSlot: MenuItem = {
  slot: ({ level }) => <StyledDivider level={level} />,
};

interface NavItemsMapOptions {
  accountChildren: MenuItem[];
  authChildren: MenuItem[];
  tHome: ReturnType<typeof useTranslations>;
  tOrder: ReturnType<typeof useTranslations>;
  tAccount: ReturnType<typeof useTranslations>;
  tAuth: ReturnType<typeof useTranslations>;
  dineInChildren: MenuItem[];
  isSignedIn: boolean;
}

const navItemsMap = ({
  accountChildren,
  authChildren,
  tHome,
  tOrder,
  tAccount,
  tAuth,
  dineInChildren,
  isSignedIn,
}: NavItemsMapOptions): MenuItem[] => [
  { icon: Home, label: tHome("label"), to: "/" },
  {
    children: dineInChildren,
    icon: ShoppingCart,
    label: tOrder("label"),
    to: "/order",
  },
  isSignedIn
    ? {
        children: accountChildren,
        icon: AccountCircle,
        label: tAccount("label"),
        to: "/account",
      }
    : {
        children: authChildren,
        icon: AccountCircle,
        label: tAuth("label"),
        to: "/auth",
      },
];

interface ListItemLinkProps extends ListItemButtonProps {
  href?: string;
  icon?: React.ElementType;
  isExpandable?: boolean;
  label?: string;
  level: number;
  open?: boolean;
}

const ListItemLink = ({
  href,
  icon: Icon,
  isExpandable,
  label,
  level,
  onClick,
  open,
  selected,
  ...other
}: ListItemLinkProps) => (
  <StyledListItemButton
    {...(href ? { component: Link, href } : {})}
    level={level}
    onClick={onClick}
    selected={selected}
    {...other}
  >
    {Icon && (
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
    )}
    <ListItemText primary={label} />
    {isExpandable && <StyledExpandMore open={open} />}
  </StyledListItemButton>
);

const NavTemporaryDrawer = () => {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const { isSignedIn } = useAuthStore((state) => state);

  const { drawer, setDrawerOpen } = useDrawerStore((state) => state);
  const open = drawer.nav;
  const handleNavClose = handleDrawerToggle(setDrawerOpen, "nav", false);

  const tHome = useTranslations("home");
  const tOrder = useTranslations("order");
  const tAuth = useTranslations("auth");
  const tAccount = useTranslations("account");

  const { handleLogout, isMutatingLogout } = useLogout();

  const { locale, mode, storeSlug, tableNumber, partySize } =
    useParams<RouteParams>();
  const pathname = usePathname();
  const router = useRouter();

  const { data: stores = [] } = useSWR<Store[]>("/api/stores");

  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentURL = search ? `${pathname}?${search}` : pathname;

  const redirectParam = searchParams.get("redirectTo");
  const isAccountPage = pathname.startsWith(`/${locale}/account`);
  const isAuthPage = pathname.startsWith(`/${locale}/auth`);
  const isCompanyPage = pathname.startsWith(`/${locale}/company`);

  const redirectTo =
    (isAccountPage || isAuthPage || isCompanyPage) && redirectParam
      ? redirectParam
      : currentURL;

  const storeName = getStoreName(locale, stores, storeSlug);

  const accountChildren = [
    ...getProfileMenuItems(tAccount),
    dividerSlot,
    ...getAccountMenuItems(tAccount),
    getLogoutMenuItem(tAuth, { isMutatingLogout, onLogout: handleLogout }),
  ];

  const authChildren = getAuthMenuItems(tAuth, redirectTo);

  const dineInChildren = [
    ...(mode === ORDER_MODE.DineIn && storeSlug && storeName
      ? [
          createDineInSlot(tOrder, storeName, tableNumber, partySize, () =>
            router.push(
              `/${["order", mode, storeSlug, tableNumber, partySize]
                .filter(Boolean)
                .join("/")}`,
            ),
          ),
        ]
      : []),
    {
      icon: LocalMall,
      label: tOrder("mode.pickup.label"),
      to: "/pickup",
    },
  ];

  const navItems = navItemsMap({
    accountChildren,
    authChildren,
    tHome,
    tOrder,
    tAccount,
    tAuth,
    dineInChildren,
    isSignedIn,
  });

  const handleIconButtonToggle = (key: string) =>
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));

  const renderItems = (items: MenuItem[], level = 0, parentPath = "/") =>
    items.map(({ children, disabled, icon, label, onClick, slot, to }) => {
      const [toPath, toSearchParams] = to?.split("?") || [];
      const toSearch = toSearchParams ? `?${toSearchParams}` : "";

      const parentPrefix = parentPath === "/" ? "" : parentPath;
      const basePath = toPath ? `${parentPrefix}${toPath}` : parentPath;
      const isExpandable = Boolean(children?.length);
      const href = to && !isExpandable ? `${basePath}${toSearch}` : undefined;

      const itemKey = toPath || `${label}-${level}`;
      const open = Boolean(isExpandable && openMap[itemKey]);
      const selected =
        basePath === "/"
          ? pathname === basePath
          : pathname === basePath || pathname.startsWith(`${basePath}/`);

      const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isExpandable) {
          event.stopPropagation();

          if (to) handleIconButtonToggle(itemKey);

          return;
        }

        onClick?.();
      };

      return (
        <Fragment key={itemKey}>
          {slot ? (
            slot({ level })
          ) : (
            <ListItemLink
              disabled={disabled}
              href={href}
              icon={icon}
              isExpandable={isExpandable}
              label={label}
              level={level}
              onClick={handleClick}
              open={open}
              selected={selected}
            />
          )}
          {isExpandable && (
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderItems(children!, level + 1, basePath)}
              </List>
            </Collapse>
          )}
        </Fragment>
      );
    });

  const list = (
    <StyledBox
      onClick={handleNavClose}
      onKeyDown={handleNavClose}
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
      onClose={handleNavClose}
      open={open}
    >
      {list}
    </Drawer>
  );
};

export default NavTemporaryDrawer;
