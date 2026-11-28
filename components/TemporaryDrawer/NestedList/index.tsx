// https://mui.com/material-ui/react-list/#NestedList.tsx
// https://mui.com/material-ui/react-list/#PinnedSubheaderList.tsx

"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Fragment } from "react";

import DividerSlot from "./DividerSlot";
import OrderModeMenuItem from "./OrderModeMenuItem";
import SelectedListItem from "./SelectedListItem";

import { ORDER_MODE } from "@/constants/orderMode";

import { useNavChildren } from "@/hooks/useNavChildren";
import { useRoutes } from "@/hooks/useRoutes";

import { Home } from "@mui/icons-material";
import { List, ListSubheader, Toolbar } from "@mui/material";

import type { NavGroup, NavItem } from "@/types/navItem";
import type { RouteParams } from "@/types/routeParams";

const useNavGroups = (): NavGroup[] => {
  const { mode, organizationSlug } = useParams<Partial<RouteParams>>();

  const navChildren = useNavChildren(DividerSlot);
  const navItem = useRoutes();

  const tAppBar = useTranslations("appBar");
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
    { items: [{ icon: Home, label: tHome("label"), to: "/" }] },
    {
      items: [
        {
          ...navItem("/order"),
          children: orderChildren,
        },
        navItem("/order-board"),
        navItem("/waitlist-board"),
      ],
      label: tAppBar("navGroup.ordering"),
    },
    {
      items: [
        {
          ...navItem("/auth"),
          children: navChildren["/auth"],
        },
        {
          ...navItem("/company"),
          children: navChildren["/company"],
        },
      ],
      label: tAppBar("navGroup.more"),
    },
  ];
};

const NestedList = () => {
  const navGroups = useNavGroups();

  return (
    <List
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" disableSticky id="nested-list-subheader">
          <Toolbar />
        </ListSubheader>
      }
    >
      {navGroups.map(({ items, label }, groupIndex) => (
        <Fragment key={label || items[0]?.path || groupIndex}>
          {groupIndex > 0 && <DividerSlot level={0} />}
          <li>
            <List disablePadding>
              {label && <ListSubheader color="primary">{label}</ListSubheader>}
              {items.map((item, index) => (
                <SelectedListItem item={item} key={item.path || index} />
              ))}
            </List>
          </li>
        </Fragment>
      ))}
    </List>
  );
};

export default NestedList;
