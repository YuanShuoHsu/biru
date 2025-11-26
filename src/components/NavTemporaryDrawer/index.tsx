// https://mui.com/material-ui/react-drawer/#AnchorTemporaryDrawer.tsx
// https://mui.com/material-ui/react-list/#NestedList.tsx
// https://mui.com/material-ui/react-breadcrumbs/#RouterBreadcrumbs.tsx

import NextLink from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Fragment, useState } from "react";
import useSWR from "swr";

import { ORDER_MODE } from "@/constants/orderMode";

import { type I18nDict, useI18n } from "@/context/i18n";

import { useLogout } from "@/hooks/useLogout";

import { interpolate } from "@/utils/i18n";

import {
  AccountCircle,
  ExpandMore,
  Group,
  Home,
  LocalMall,
  Login,
  PersonAdd,
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

import { useAuthStore } from "@/stores/useAuthStore";

import type { DrawerType } from "@/types/drawer";
import type { OrderMode } from "@/types/orderMode";
import type { PartySize } from "@/types/partySize";
import type { RouteParams } from "@/types/routeParams";
import type { Store, StoreName } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

import { getAccountMenuItems, getProfileMenuItems } from "@/utils/auth";
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
  marginLeft: theme.spacing(2 + level * 2),
}));

const StyledExpandMore = styled(ExpandMore, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ open, theme }) => ({
  transform: open ? "rotate(180deg)" : "rotate(0deg)",
  transition: theme.transitions.create("transform"),
}));

interface NavLinkItem {
  children?: NavItem[];
  disabled?: boolean;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  query?: string;
  to?: string;
}

type SlotKey = OrderMode | "divider";

interface NavSlotItem {
  slot: SlotKey;
}

type NavItem = NavLinkItem | NavSlotItem;

interface NavItemsMapOptions {
  dict: I18nDict;
  isMutatingLogout?: boolean;
  isSignedIn: boolean;
  onLogout: () => void;
  redirectTo?: string;
}

const navItemsMap = ({
  dict,
  isMutatingLogout,
  isSignedIn,
  onLogout,
  redirectTo,
}: NavItemsMapOptions): NavItem[] => {
  const profileMenuItems = getProfileMenuItems(dict);
  const accountMenuItems = getAccountMenuItems(dict, {
    isMutatingLogout,
    onLogout,
  });

  const query = redirectTo
    ? `?redirect=${encodeURIComponent(redirectTo)}`
    : undefined;

  const memberChildren: NavItem[] = isSignedIn
    ? [...profileMenuItems, { slot: "divider" }, ...accountMenuItems]
    : [
        {
          icon: Login,
          label: dict.member.auth.signIn.label,
          query,
          to: "/sign-in",
        },
        {
          icon: PersonAdd,
          label: dict.member.auth.signUp.label,
          query,
          to: "/sign-up",
        },
      ];

  return [
    { icon: Home, label: dict.home.label, to: "/" },
    {
      children: [
        { slot: ORDER_MODE.DineIn },
        {
          icon: LocalMall,
          label: dict.order.mode.pickup.label,
          to: "/pickup",
        },
      ],
      icon: ShoppingCart,
      label: dict.order.label,
      to: "/order",
    },
    {
      children: memberChildren,
      icon: AccountCircle,
      label: dict.member.label,
      to: "/member",
    },
  ];
};

interface SlotProps {
  dict: I18nDict;
  level: number;
  onClick: () => void;
  storeName: StoreName;
  tableNumber: TableNumber;
  partySize: PartySize;
}

const slots: Partial<Record<SlotKey, React.ComponentType<SlotProps>>> = {
  [ORDER_MODE.DineIn]: ({
    dict,
    level,
    onClick,
    storeName,
    tableNumber,
    partySize,
  }) => (
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
          <Stack flexDirection="row" alignItems="center" gap={4}>
            <ListItemIcon>
              <TableBar />
            </ListItemIcon>
            <ListItemText primary={tableNumber} />
          </Stack>
          {partySize && (
            <Stack flexDirection="row" alignItems="center" gap={4}>
              <ListItemIcon>
                <Group />
              </ListItemIcon>
              <ListItemText
                primary={interpolate(
                  dict.order.mode.dineIn.storeSlug.tableNumber.partySize.select
                    .value,
                  { count: partySize },
                )}
              />
            </Stack>
          )}
        </Stack>
        <StyledChip
          color="primary"
          icon={<Restaurant />}
          label={dict.order.mode.dineIn.label}
          size="small"
          variant="outlined"
        />
      </Stack>
    </StyledListItemButton>
  ),
  divider: ({ level }) => <StyledDivider level={level} />,
};

interface ListItemLinkProps extends ListItemButtonProps {
  hasChildren?: boolean;
  href?: string;
  icon: React.ElementType;
  label: string;
  level: number;
  open?: boolean;
}

const ListItemLink = ({
  hasChildren,
  href,
  icon: Icon,
  label,
  level,
  onClick,
  open,
  selected,
  ...other
}: ListItemLinkProps) => (
  <StyledListItemButton
    {...(href ? { component: NextLink, href } : {})}
    level={level}
    onClick={onClick}
    selected={selected}
    {...other}
  >
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText primary={label} />
    {hasChildren && <StyledExpandMore open={open} />}
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
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const { data: stores = [] } = useSWR<Store[]>("/api/stores");

  const { isSignedIn } = useAuthStore();

  const { handleLogout, isMutatingLogout } = useLogout();

  const pathname = usePathname();
  const { lang, mode, storeSlug, tableNumber, partySize } =
    useParams<RouteParams>();
  const router = useRouter();

  const dict = useI18n();

  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentURL = search ? `${pathname}?${search}` : pathname;

  const redirectParam = searchParams.get("redirect");
  const isMemberPage = pathname.startsWith(`/${lang}/member`);
  const redirectTo = isMemberPage && redirectParam ? redirectParam : currentURL;

  const navItems = navItemsMap({
    dict,
    isMutatingLogout,
    isSignedIn,
    onLogout: handleLogout,
    redirectTo,
  });

  const handleIconButtonToggle = (key: string) =>
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));

  const composePath = (parentPath: string, to?: string) => {
    const normalizedParent = parentPath === "/" ? "" : parentPath;
    if (!to) return normalizedParent || "/";

    const child = to.startsWith("/") ? to : `/${to}`;
    const combined = `${normalizedParent}${child}`;

    return combined || "/";
  };

  const renderItems = (items: NavItem[], level = 0, parentPath = "") =>
    items.map((item) => {
      if ("slot" in item) {
        const { slot } = item;
        const SlotComponent = slots[slot];
        if (!SlotComponent) return null;

        const isDividerSlot = slot === "divider";
        if (!isDividerSlot && slot !== mode) return null;

        const storeName = getStoreName(lang, stores, storeSlug);

        const handleClick = () => {
          if (isDividerSlot) return;
          if (!storeSlug || !tableNumber || !partySize) return;

          router.push(
            `/${lang}/order/${mode}/${storeSlug}/${tableNumber}/${partySize}`,
          );
        };

        return (
          <SlotComponent
            dict={dict}
            key={`${slot}-${level}`}
            level={level}
            onClick={handleClick}
            tableNumber={tableNumber}
            storeName={storeName}
            partySize={partySize}
          />
        );
      }

      const { children, disabled, icon, label, onClick, query, to } = item;

      const basePath = composePath(parentPath, to);
      const isHome = basePath === "/";
      const pathWithLang = `/${lang}${isHome ? "" : basePath}`;

      const selected =
        pathname === pathWithLang ||
        (!isHome && pathname.startsWith(`${pathWithLang}/`));

      const pathWithQuery = to && `${pathWithLang}${query || ""}`;
      const hasChildren = !!children?.length;
      const href = !hasChildren ? pathWithQuery : undefined;

      const itemKey = to ? pathWithLang : `${label}-${level}`;
      const open = Boolean(to && openMap[itemKey]);

      const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (hasChildren) {
          event.stopPropagation();
          if (to) handleIconButtonToggle(itemKey);
          return;
        }

        onClick?.();
      };

      return (
        <Fragment key={itemKey}>
          <ListItemLink
            disabled={disabled}
            hasChildren={hasChildren}
            href={href}
            icon={icon}
            label={label}
            level={level}
            onClick={handleClick}
            open={open}
            selected={selected}
          />
          {hasChildren && (
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
