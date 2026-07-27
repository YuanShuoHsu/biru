import type { MessageKeys, Messages, NestedKeyOf } from "next-intl";

import { ORDER_MODE } from "@/constants/orderMode";

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

type LabelKey = MessageKeys<Messages, NestedKeyOf<Messages>>;

export type RouteQuery =
  | "organization"
  | "page"
  | "pageSize"
  | "partySize"
  | "tableNumber";

interface RouteMeta {
  children?: Record<string, RouteMeta>;
  disabled?: true;
  icon: React.ComponentType<SvgIconProps>;
  labelKey?: LabelKey;
  query?: readonly RouteQuery[];
}

interface MatchedRoute extends RouteMeta {
  param?: string;
}

const orderModeChildren: Record<string, RouteMeta> = {
  "[organizationSlug]": {
    children: {
      cart: {
        icon: ShoppingCart,
        labelKey: "order.mode.storeSlug.tableNumber.stepper.cart.label",
      },
      checkout: {
        icon: Payment,
        labelKey: "order.mode.storeSlug.tableNumber.stepper.checkout.label",
      },
      complete: {
        icon: Pets,
        labelKey: "order.mode.storeSlug.tableNumber.stepper.complete.label",
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
        labelKey: "auth.acceptInvitation.label",
      },
      coupons: { icon: ConfirmationNumber, labelKey: "auth.coupons.label" },
      "delete-account": {
        icon: DeleteForever,
        labelKey: "auth.deleteAccount.label",
      },
      "forgot-password": {
        icon: HelpOutline,
        labelKey: "auth.forgotPassword.label",
      },
      orders: {
        icon: ReceiptLong,
        labelKey: "auth.orders.label",
        query: ["page", "pageSize"],
      },
      points: {
        children: {
          store: { icon: Storefront, labelKey: "auth.store.label" },
          transactions: {
            icon: Stars,
            labelKey: "auth.points.transactions.label",
            query: ["page", "pageSize"],
          },
        },
        disabled: true,
        icon: Stars,
        labelKey: "auth.points.label",
      },
      "reset-password": {
        icon: LockReset,
        labelKey: "auth.resetPassword.label",
      },
      settings: {
        children: {
          account: { icon: Person, labelKey: "auth.settings.account.label" },
          security: { icon: Lock, labelKey: "auth.settings.security.label" },
        },
        disabled: true,
        icon: Settings,
        labelKey: "auth.settings.label",
      },
      "sign-in": { icon: Login, labelKey: "auth.signIn.label" },
      "sign-up": { icon: PersonAdd, labelKey: "auth.signUp.label" },
      "verify-email": { icon: Email, labelKey: "auth.verifyEmail.label" },
    },
    disabled: true,
    icon: AccountCircle,
    labelKey: "auth.label",
  },
  company: {
    children: {
      about: { icon: Info, labelKey: "company.about.label" },
      privacy: { icon: Policy, labelKey: "company.legal.privacy.label" },
      terms: { icon: Gavel, labelKey: "company.legal.terms.label" },
    },
    disabled: true,
    icon: Apartment,
    labelKey: "company.label",
  },
  order: {
    children: {
      [ORDER_MODE.Counter]: {
        children: orderModeChildren,
        disabled: true,
        icon: QrCodeScanner,
        labelKey: "order.mode.counter.label",
      },
      [ORDER_MODE.DineIn]: {
        children: orderModeChildren,
        disabled: true,
        icon: Restaurant,
        labelKey: "order.mode.dineIn.label",
      },
      [ORDER_MODE.Kiosk]: {
        children: orderModeChildren,
        disabled: true,
        icon: TouchApp,
        labelKey: "order.mode.kiosk.label",
      },
      [ORDER_MODE.Pickup]: {
        children: orderModeChildren,
        icon: LocalMall,
        labelKey: "order.mode.pickup.label",
      },
    },
    disabled: true,
    icon: ShoppingCart,
    labelKey: "order.label",
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
