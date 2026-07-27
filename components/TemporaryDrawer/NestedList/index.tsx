// https://mui.com/material-ui/react-list/#NestedList.tsx

"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import DividerSlot from "./DividerSlot";
import SelectedListItem from "./SelectedListItem";

import { ORDER_MODE } from "@/constants/orderMode";

import { useAuthNavItems } from "@/hooks/useAuth";
import { useCompanyNavItems } from "@/hooks/useCompany";
import { getRouteSlots, useRoutes } from "@/hooks/useRoutes";

import { Home } from "@mui/icons-material";
import { List, ListSubheader, Toolbar } from "@mui/material";

import { useAuthStore } from "@/providers/auth-store-provider";

import type { NavItem } from "@/types/navItem";
import type { RouteParams } from "@/types/routeParams";

import { useAccountNavItems } from "@/utils/account";

const useNavItems = (): NavItem[] => {
  const session = useAuthStore((state) => state.session);

  const { mode, organizationSlug } = useParams<Partial<RouteParams>>();

  const accountChildren = useAccountNavItems(DividerSlot);
  const authChildren = useAuthNavItems();
  const companyChildren = useCompanyNavItems();

  const navItem = useRoutes();

  const tHome = useTranslations("home");

  // 只有現場點餐模式底下有這一項；外帶自取沒有
  const orderModeSlots = getRouteSlots(`/order/${mode}`);

  const orderChildren: NavItem[] = [
    ...(organizationSlug ? orderModeSlots.map((slot) => ({ slot })) : []),
    navItem(`/order/${ORDER_MODE.Pickup}`),
  ];

  return [
    { icon: Home, label: tHome("label"), to: "/" },
    {
      ...navItem("/order"),
      children: orderChildren,
    },
    {
      ...navItem("/auth"),
      children: session ? accountChildren : authChildren,
    },
    {
      ...navItem("/company"),
      children: companyChildren,
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
