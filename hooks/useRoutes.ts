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

import { useOrganization } from "@/hooks/organizations";

import { usePathname } from "@/i18n/navigation";

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
  | "back"
  | "organization"
  | "page"
  | "pageSize"
  | "partySize"
  | "redirectTo"
  | "tableNumber";

interface Route {
  children?: Record<string, Route>;
  icon: React.ComponentType<SvgIconProps>;
  label?: LabelKey;
  query?: readonly RouteQuery[];
  to?: string | null;
}

const orderModeChildren: Record<string, Route> = {
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

const routes: Record<string, Route> = {
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
        icon: Settings,
        label: "auth.settings.label",
        to: "/auth/settings/account",
      },
      "sign-in": {
        icon: Login,
        label: "auth.signIn.label",
        query: ["redirectTo"],
      },
      "sign-up": {
        icon: PersonAdd,
        label: "auth.signUp.label",
        query: ["redirectTo"],
      },
      "verify-email": { icon: Email, label: "auth.verifyEmail.label" },
    },
    icon: AccountCircle,
    label: "auth.label",
    to: null,
  },
  company: {
    children: {
      about: { icon: Info, label: "company.about.label" },
      privacy: {
        icon: Policy,
        label: "company.legal.privacy.label",
        query: ["back", "redirectTo"],
      },
      terms: {
        icon: Gavel,
        label: "company.legal.terms.label",
        query: ["back", "redirectTo"],
      },
    },
    icon: Apartment,
    label: "company.label",
    to: null,
  },
  order: {
    children: {
      [ORDER_MODE.Counter]: {
        children: orderModeChildren,
        icon: QrCodeScanner,
        label: "order.mode.counter.label",
        to: null,
      },
      [ORDER_MODE.DineIn]: {
        children: orderModeChildren,
        icon: Restaurant,
        label: "order.mode.dineIn.label",
        to: null,
      },
      [ORDER_MODE.Kiosk]: {
        children: orderModeChildren,
        icon: TouchApp,
        label: "order.mode.kiosk.label",
        to: null,
      },
      [ORDER_MODE.Pickup]: {
        children: orderModeChildren,
        icon: LocalMall,
        label: "order.mode.pickup.label",
      },
    },
    icon: ShoppingCart,
    label: "order.label",
    to: null,
  },
};

const findRoute = (path: string) => {
  let children: Route["children"] = routes;
  let matched: (Route & { param?: string }) | undefined;

  for (const segment of path.split("/").filter(Boolean)) {
    if (!children) return;

    const key: string | undefined =
      segment in children
        ? segment
        : Object.keys(children).find((child) => child.startsWith("["));
    const meta: Route | undefined = key ? children[key] : undefined;
    if (!key || !meta) return;

    matched = {
      ...meta,
      ...(key.startsWith("[") && { param: key.slice(1, -1) }),
    };
    children = meta.children;
  }

  return matched;
};

export const useRoutes = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();

  const organization = useOrganization();

  const labels: Partial<Record<string, string>> = {
    organizationSlug: organization?.name || "",
  };

  const pathname = usePathname();

  const values: Record<RouteQuery, string | null> = {
    back: pathname,
    organization: searchParams.get("organization"),
    page: DEFAULT_PAGINATION_QUERY.page,
    pageSize: DEFAULT_PAGINATION_QUERY.pageSize,
    partySize: searchParams.get("partySize"),
    redirectTo: searchParams.get("redirectTo") || pathname,
    tableNumber: searchParams.get("tableNumber"),
  };

  const buildHref = (href: string, query = findRoute(href)?.query) => {
    if (!query) return href;

    return getHref(
      href,
      Object.fromEntries(query.map((key) => [key, values[key]])),
    );
  };

  return (path: string, href?: string): NavItem => {
    const { icon, label, param, query, to } = findRoute(path) || {};
    const target = to === null ? undefined : (href ?? to ?? path);

    return {
      icon,
      label:
        (param && labels[param]) ??
        (label && t(label)) ??
        path.split("/").at(-1),
      path,
      to: target && buildHref(target, target === path ? query : undefined),
    };
  };
};
