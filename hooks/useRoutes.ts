"use client";

import {
  type MessageKeys,
  type Messages,
  type NestedKeyOf,
  useTranslations,
} from "next-intl";
import { useSearchParams } from "next/navigation";

import { ORDER_MODE } from "@/constants/orderMode";
import { DEFAULT_PAGINATION_QUERY } from "@/constants/pagination";

import {
  AccountCircle,
  Apartment,
  ConfirmationNumber,
  DeleteForever,
  Email,
  Gavel,
  GroupAdd,
  HelpOutline,
  Info,
  LocalMall,
  Lock,
  LockReset,
  Login,
  Payment,
  Person,
  PersonAdd,
  Pets,
  Policy,
  QrCodeScanner,
  ReceiptLong,
  Restaurant,
  Settings,
  ShoppingCart,
  Stars,
  Storefront,
  TouchApp,
} from "@mui/icons-material";
import type { SvgIconProps } from "@mui/material";

import type { NavItem } from "@/types/navItem";

import { getHref } from "@/utils/href";

type LabelKey = MessageKeys<Messages, NestedKeyOf<Messages>>;

type RouteQuery =
  | "organization"
  | "page"
  | "pageSize"
  | "partySize"
  | "tableNumber";

interface RouteMeta {
  children?: Record<string, RouteMeta>;
  disabled?: true;
  icon: React.ComponentType<SvgIconProps>;
  label?: LabelKey;
  query?: readonly RouteQuery[];
  to?: string;
}

interface MatchedRoute extends RouteMeta {
  param?: string;
}

const orderModeChildren: Record<string, RouteMeta> = {
  "[organizationSlug]": {
    children: {
      cart: {
        icon: ShoppingCart,
        label: "order.mode.storeSlug.tableNumber.stepper.cart.label",
      },
      checkout: {
        icon: Payment,
        label: "order.mode.storeSlug.tableNumber.stepper.checkout.label",
      },
      complete: {
        icon: Pets,
        label: "order.mode.storeSlug.tableNumber.stepper.complete.label",
      },
    },
    icon: Storefront,
    query: ["partySize", "tableNumber"],
  },
};

const routes: Record<string, RouteMeta> = {
  auth: {
    children: {
      "accept-invitation": {
        icon: GroupAdd,
        label: "auth.acceptInvitation.label",
      },
      coupons: { icon: ConfirmationNumber, label: "auth.coupons.label" },
      "delete-account": {
        icon: DeleteForever,
        label: "auth.deleteAccount.label",
      },
      "forgot-password": {
        icon: HelpOutline,
        label: "auth.forgotPassword.label",
      },
      orders: {
        icon: ReceiptLong,
        label: "auth.orders.label",
        query: ["page", "pageSize"],
      },
      points: {
        children: {
          store: { icon: Storefront, label: "auth.store.label" },
          transactions: {
            icon: Stars,
            label: "auth.points.transactions.label",
            query: ["page", "pageSize"],
          },
        },
        disabled: true,
        icon: Stars,
        label: "auth.points.label",
        to: "/auth/points/transactions",
      },
      "reset-password": {
        icon: LockReset,
        label: "auth.resetPassword.label",
      },
      settings: {
        children: {
          account: { icon: Person, label: "auth.settings.account.label" },
          security: { icon: Lock, label: "auth.settings.security.label" },
        },
        disabled: true,
        icon: Settings,
        label: "auth.settings.label",
        to: "/auth/settings/account",
      },
      "sign-in": { icon: Login, label: "auth.signIn.label" },
      "sign-up": { icon: PersonAdd, label: "auth.signUp.label" },
      "verify-email": { icon: Email, label: "auth.verifyEmail.label" },
    },
    disabled: true,
    icon: AccountCircle,
    label: "auth.label",
  },
  company: {
    children: {
      about: { icon: Info, label: "company.about.label" },
      privacy: { icon: Policy, label: "company.legal.privacy.label" },
      terms: { icon: Gavel, label: "company.legal.terms.label" },
    },
    disabled: true,
    icon: Apartment,
    label: "company.label",
  },
  order: {
    children: {
      [ORDER_MODE.Counter]: {
        children: orderModeChildren,
        disabled: true,
        icon: QrCodeScanner,
        label: "order.mode.counter.label",
      },
      [ORDER_MODE.DineIn]: {
        children: orderModeChildren,
        disabled: true,
        icon: Restaurant,
        label: "order.mode.dineIn.label",
      },
      [ORDER_MODE.Kiosk]: {
        children: orderModeChildren,
        disabled: true,
        icon: TouchApp,
        label: "order.mode.kiosk.label",
      },
      [ORDER_MODE.Pickup]: {
        children: orderModeChildren,
        icon: LocalMall,
        label: "order.mode.pickup.label",
      },
    },
    disabled: true,
    icon: ShoppingCart,
    label: "order.label",
  },
};

export const findRoute = (path: string): MatchedRoute | undefined => {
  let children: RouteMeta["children"] = routes;
  let matched: MatchedRoute | undefined;

  for (const segment of path.split("/").filter(Boolean)) {
    if (!children) return;

    const key: string | undefined =
      segment in children
        ? segment
        : Object.keys(children).find((child) => child.startsWith("["));
    const meta: RouteMeta | undefined = key ? children[key] : undefined;
    if (!key || !meta) return;

    matched = {
      ...meta,
      ...(key.startsWith("[") && { param: key.slice(1, -1) }),
    };
    children = meta.children;
  }

  return matched;
};

export const useRoutes = (defaultOrganization?: string | null) => {
  const t = useTranslations();
  const searchParams = useSearchParams();

  const values: Record<RouteQuery, string | null> = {
    organization:
      searchParams.get("organization") || defaultOrganization || null,
    page: DEFAULT_PAGINATION_QUERY.page,
    pageSize: DEFAULT_PAGINATION_QUERY.pageSize,
    partySize: searchParams.get("partySize"),
    tableNumber: searchParams.get("tableNumber"),
  };

  const buildHref = (href: string) => {
    const { query } = findRoute(href) || {};
    if (!query) return href;

    return getHref(
      href,
      Object.fromEntries(query.map((key) => [key, values[key]])),
    );
  };

  return (path: string, href?: string): NavItem & { to: string } => {
    const { icon, label, to } = findRoute(path) || {};

    return {
      icon,
      label: label && t(label),
      to: buildHref(href ?? to ?? path),
    };
  };
};
