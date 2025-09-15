// https://mui.com/material-ui/react-drawer/#AnchorTemporaryDrawer.tsx
// https://mui.com/material-ui/react-list/#NestedList.tsx
// https://mui.com/material-ui/react-breadcrumbs/#RouterBreadcrumbs.tsx

import { useParams, usePathname, useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import { I18nDict, useI18n } from "@/context/i18n";

import {
  AccountCircle,
  ExpandMore,
  Home,
  LocalMall,
  Login,
  PersonAdd,
  ShoppingCart,
  Storefront,
  TableBar,
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
  Stack,
  SvgIconProps,
  Toolbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { DrawerType } from "@/types/drawer";
import type {
  LangModeStoreIdTableNumberParam,
  LocaleCode,
} from "@/types/locale";
import type { StoreId } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

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

  "&.Mui-selected": {
    backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${level * 0.04}))`,

    "&:hover": {
      backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / calc(${theme.vars.palette.action.selectedOpacity} + ${theme.vars.palette.action.hoverOpacity} + ${level * 0.04}))`,
    },
  },
}));

const StyledExpandMore = styled(ExpandMore, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ open, theme }) => ({
  transform: open ? "rotate(180deg)" : "rotate(0deg)",
  transition: theme.transitions.create("transform"),
}));

interface NavLinkItem {
  children?: NavItem[];
  icon: React.ComponentType<SvgIconProps>;
  label: string;
  to: string;
}

const Slot = {
  DineIn: "dine-in",
} as const;

type SlotId = (typeof Slot)[keyof typeof Slot];

interface NavSlotItem {
  slot: SlotId;
}

type NavItem = NavLinkItem | NavSlotItem;

const navItemsMap = (dict: I18nDict): NavItem[] => [
  { icon: Home, label: dict.nav.home, to: "/" },
  {
    children: [
      { slot: Slot.DineIn },
      {
        icon: LocalMall,
        label: dict.nav.order.pickup,
        to: "/order/pickup",
      },
    ],
    icon: ShoppingCart,
    label: dict.nav.order.label,
    to: "/order",
  },
  {
    children: [
      {
        icon: Login,
        label: dict.nav.member.signIn,
        to: "/member/sign-in",
      },
      {
        icon: PersonAdd,
        label: dict.nav.member.signUp,
        to: "/member/sign-up",
      },
    ],
    icon: AccountCircle,
    label: dict.nav.member.label,
    to: "/member",
  },
];

interface SlotProps {
  lang: LocaleCode;
  level: number;
  selected: boolean;
  storeId: StoreId;
  tableNumber: TableNumber;
}

const slots: Record<SlotId, React.ComponentType<SlotProps>> = {
  [Slot.DineIn]: ({ lang, level, selected, storeId, tableNumber }) => (
    <StyledListItemButton level={level} selected={selected}>
      <Stack gap={1}>
        <Stack flexDirection="row" alignItems="center">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText primary={getStoreName(lang, storeId)} />
        </Stack>
        <Stack flexDirection="row" alignItems="center">
          <ListItemIcon>
            <TableBar />
          </ListItemIcon>
          <ListItemText primary={tableNumber} />
        </Stack>
      </Stack>
    </StyledListItemButton>
  ),
};

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

  const pathname = usePathname();
  const { lang, mode, storeId, tableNumber } =
    useParams<LangModeStoreIdTableNumberParam>();
  const router = useRouter();

  const dict = useI18n();

  const navItems = navItemsMap(dict);

  const handleIconButtonToggle = (to: string) =>
    setOpenMap((prev) => ({ ...prev, [to]: !prev[to] }));

  const renderItems = (items: NavItem[], level = 0) =>
    items.map((item) => {
      if ("slot" in item) {
        const selected = mode === "dine-in";
        if (!selected) return null;

        const { slot } = item;
        const SlotComponent = slots[slot];

        return (
          <SlotComponent
            key={`${slot}-${level}`}
            level={level}
            selected={selected}
            lang={lang}
            storeId={storeId}
            tableNumber={tableNumber}
          />
        );
      }

      const { children, icon, label, to } = item;

      const hasChildren = !!children?.length;

      const open = openMap[to];

      const isHome = to === "/";
      const fullPath = `/${lang}${isHome ? "" : to}`;
      const selected =
        pathname === fullPath ||
        (!isHome && pathname.startsWith(`${fullPath}/`));

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
