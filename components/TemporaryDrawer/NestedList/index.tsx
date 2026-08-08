// https://mui.com/material-ui/react-list/#NestedList.tsx

"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import OrderModeMenuItem from "./OrderModeMenuItem";
import SelectedListItem from "./SelectedListItem";

import { ORDER_MODE } from "@/constants/orderMode";

import { useNavChildren } from "@/hooks/useNavChildren";
import { useRoutes } from "@/hooks/useRoutes";

import { Home } from "@mui/icons-material";
import { List, ListSubheader, Toolbar } from "@mui/material";

import type { NavItem } from "@/types/navItem";
import type { RouteParams } from "@/types/routeParams";

const useNavItems = (): NavItem[] => {
  const { mode, organizationSlug } = useParams<Partial<RouteParams>>();

  const navChildren = useNavChildren();
  const navItem = useRoutes();

  const tHome = useTranslations("home");

  const isInStoreOrder =
    Boolean(organizationSlug) &&
    [ORDER_MODE.Counter, ORDER_MODE.DineIn, ORDER_MODE.DriveThru].some(
      (orderMode) => orderMode === mode,
    );

  const orderChildren: NavItem[] = [
    ...(isInStoreOrder ? [{ slot: OrderModeMenuItem }] : []),
    navItem(`/order/${ORDER_MODE.Pickup}`),
  ];

  return [
    { icon: Home, label: tHome("label"), to: "/" },
    {
      ...navItem("/order"),
      children: orderChildren,
    },
    ...(organizationSlug
      ? [
          {
            ...navItem("/order-board"),
            children: [navItem(`/order-board/${organizationSlug}`)],
          },
        ]
      : []),
    {
      ...navItem("/auth"),
      children: navChildren["/auth"],
    },
    {
      ...navItem("/company"),
      children: navChildren["/company"],
    },
  ];
};

const NestedList = () => {
  const navItems = useNavItems();

  return (
    <List
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          <Toolbar />
        </ListSubheader>
      }
    >
      {navItems.map((item, index) => (
        <SelectedListItem item={item} key={item.path || index} />
      ))}
    </List>
  );
};

export default NestedList;
