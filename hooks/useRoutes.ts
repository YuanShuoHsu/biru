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

type MessageKey = MessageKeys<Messages, NestedKeyOf<Messages>>;

type RouteQuery =
  | "back"
  | "organization"
  | "page"
  | "pageSize"
  | "partySize"
  | "redirectTo"
  | "tableNumber"
  | "type";

interface Route {
  children?: Route[];
  icon: React.ComponentType<SvgIconProps>;
  label?: MessageKey;
  query?: readonly RouteQuery[];
  segment: string;
  to?: string | null;
}

const storeRoute: Route = {
  children: [
    {
      icon: ShoppingCart,
      label: "order.mode.storeSlug.tableNumber.stepper.cart.label",
      segment: "cart",
    },
    {
      icon: Payment,
      label: "order.mode.storeSlug.tableNumber.stepper.checkout.label",
      segment: "checkout",
    },
    {
      icon: Pets,
      label: "order.mode.storeSlug.tableNumber.stepper.complete.label",
      segment: "complete",
    },
  ],
  icon: Storefront,
  query: ["partySize", "tableNumber", "type"],
  segment: "[organizationSlug]",
};

const routes: Route[] = [
  {
    children: [
      {
        children: [storeRoute],
        icon: QrCodeScanner,
        label: "order.mode.counter.label",
        segment: ORDER_MODE.Counter,
        to: null,
      },
      {
        children: [storeRoute],
        icon: Restaurant,
        label: "order.mode.dineIn.label",
        segment: ORDER_MODE.DineIn,
        to: null,
      },
      {
        children: [storeRoute],
        icon: TouchApp,
        label: "order.mode.kiosk.label",
        segment: ORDER_MODE.Kiosk,
        to: null,
      },
      {
        children: [storeRoute],
        icon: LocalMall,
        label: "order.mode.pickup.label",
        segment: ORDER_MODE.Pickup,
      },
    ],
    icon: ShoppingCart,
    label: "order.label",
    segment: "order",
    to: null,
  },
  {
    children: [
      {
        icon: GroupAdd,
        label: "auth.acceptInvitation.label",
        segment: "accept-invitation",
      },
      {
        icon: ConfirmationNumber,
        label: "auth.coupons.label",
        segment: "coupons",
      },
      {
        icon: DeleteForever,
        label: "auth.deleteAccount.label",
        segment: "delete-account",
      },
      {
        icon: HelpOutline,
        label: "auth.forgotPassword.label",
        segment: "forgot-password",
      },
      {
        icon: ReceiptLong,
        label: "auth.orders.label",
        query: ["page", "pageSize"],
        segment: "orders",
      },
      {
        children: [
          { icon: Storefront, label: "auth.store.label", segment: "store" },
          {
            icon: Stars,
            label: "auth.points.transactions.label",
            query: ["page", "pageSize"],
            segment: "transactions",
          },
        ],
        icon: Stars,
        label: "auth.points.label",
        segment: "points",
        to: "/auth/points/transactions",
      },
      {
        icon: LockReset,
        label: "auth.resetPassword.label",
        segment: "reset-password",
      },
      {
        children: [
          {
            icon: Person,
            label: "auth.settings.account.label",
            segment: "account",
          },
          {
            icon: Lock,
            label: "auth.settings.security.label",
            segment: "security",
          },
        ],
        icon: Settings,
        label: "auth.settings.label",
        segment: "settings",
        to: "/auth/settings/account",
      },
      {
        icon: Login,
        label: "auth.signIn.label",
        query: ["redirectTo"],
        segment: "sign-in",
      },
      {
        icon: PersonAdd,
        label: "auth.signUp.label",
        query: ["redirectTo"],
        segment: "sign-up",
      },
      {
        icon: Email,
        label: "auth.verifyEmail.label",
        segment: "verify-email",
      },
    ],
    icon: AccountCircle,
    label: "auth.label",
    segment: "auth",
    to: null,
  },
  {
    children: [
      { icon: Info, label: "company.about.label", segment: "about" },
      {
        icon: Policy,
        label: "company.legal.privacy.label",
        query: ["back", "redirectTo"],
        segment: "privacy",
      },
      {
        icon: Gavel,
        label: "company.legal.terms.label",
        query: ["back", "redirectTo"],
        segment: "terms",
      },
    ],
    icon: Apartment,
    label: "company.label",
    segment: "company",
    to: null,
  },
];

const findRoute = (path: string) => {
  let children: Route["children"] = routes;
  let matched: (Route & { param?: string }) | undefined;

  for (const segment of path.split("/").filter(Boolean)) {
    if (!children) return;

    const meta: Route | undefined =
      children.find((page) => page.segment === segment) ??
      children.find((page) => page.segment.startsWith("["));
    if (!meta) return;

    matched = {
      ...meta,
      ...(meta.segment.startsWith("[") && {
        param: meta.segment.slice(1, -1),
      }),
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
    type: searchParams.get("type"),
  };

  const buildHref = (href: string, query = findRoute(href)?.query) => {
    if (!query) return href;

    return getHref(
      href,
      Object.fromEntries(query.map((key) => [key, values[key]])),
    );
  };

  return (path: string, href?: string): NavItem => {
    const { icon, label, param, query, to } = findRoute(path) ?? {};
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
