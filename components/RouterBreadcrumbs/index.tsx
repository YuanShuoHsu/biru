// https://mui.com/material-ui/react-breadcrumbs/#system-IconBreadcrumbs.tsx
// https://mui.com/material-ui/react-breadcrumbs/#system-RouterBreadcrumbs.tsx

import NextLink from "next/link";
import { useParams, usePathname } from "next/navigation";
import useSWR from "swr";

import { ORDER_MODE } from "@/constants/orderMode";

import { type I18nDict, useI18n } from "@/context/i18n";

import {
  AccountCircle,
  Business,
  Gavel,
  Group,
  HelpOutline,
  LocalMall,
  LockReset,
  Login,
  Payment,
  Person,
  PersonAdd,
  Pets,
  Policy,
  Restaurant,
  Settings,
  ShoppingCart,
  Storefront,
  TableBar,
} from "@mui/icons-material";
import {
  Breadcrumbs,
  Link as MuiLink,
  type LinkProps as MuiLinkProps,
  type SvgIconProps,
  Typography,
} from "@mui/material";
import { styled, type Theme } from "@mui/material/styles";

import type { LocaleCode } from "@/types/locale";
import type { OrderMode } from "@/types/orderMode";
import type { PartySize } from "@/types/partySize";
import type { RouteParams } from "@/types/routeParams";
import type { Store, StoreName, StoreSlug } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

import { getStoreName } from "@/utils/stores";

interface BreadcrumbItem {
  children?: BreadcrumbItem[];
  disabled?: boolean;
  hidden?: boolean;
  icon: React.ComponentType<SvgIconProps>;
  label: string;
  to: string;
}

const breadcrumbsMap = (
  dict: I18nDict,
  mode: OrderMode,
  storeSlug: StoreSlug,
  tableNumber: TableNumber,
  partySize: PartySize,
  storeName: StoreName,
): BreadcrumbItem[] => {
  const isPickup = mode === ORDER_MODE.Pickup;

  const orderModePath = `/order/${mode}`;
  const storePath = `${orderModePath}/${storeSlug}`;
  const dineInTablePath = `${storePath}/${tableNumber}`;
  const dineInPartyPath = `${dineInTablePath}/${partySize}`;
  const dineInCheckoutPath = `${dineInPartyPath}/checkout`;
  const dineInCompletePath = `${dineInPartyPath}/complete`;
  const pickupCheckoutPath = `${storePath}/checkout`;
  const pickupCompletePath = `${storePath}/complete`;

  const dineInChildren: BreadcrumbItem[] = [
    {
      children: [
        {
          icon: Payment,
          label: dict.order.mode.storeSlug.tableNumber.stepper.checkout.label,
          to: dineInCheckoutPath,
        },
        {
          icon: Pets,
          label: dict.order.mode.storeSlug.tableNumber.stepper.complete.label,
          to: dineInCompletePath,
        },
      ],
      icon: partySize === "1" ? Person : Group,
      label: partySize,
      to: dineInPartyPath,
    },
  ];

  const pickupChildren: BreadcrumbItem[] = [
    {
      icon: Payment,
      label: dict.order.mode.storeSlug.tableNumber.stepper.checkout.label,
      to: pickupCheckoutPath,
    },
    {
      icon: Pets,
      label: dict.order.mode.storeSlug.tableNumber.stepper.complete.label,
      to: pickupCompletePath,
    },
  ];

  const storeChildren: BreadcrumbItem[] = isPickup
    ? pickupChildren
    : [
        {
          children: dineInChildren,
          icon: TableBar,
          label: tableNumber,
          to: dineInTablePath,
        },
      ];

  const storeNode: BreadcrumbItem = {
    children: storeChildren,
    disabled: !isPickup,
    icon: Storefront,
    label: storeName,
    to: storePath,
  };

  const modeNode: BreadcrumbItem = {
    children: [storeNode],
    disabled: !isPickup,
    icon: isPickup ? LocalMall : Restaurant,
    label: isPickup
      ? dict.order.mode.pickup.label
      : dict.order.mode.dineIn.label,
    to: orderModePath,
  };

  return [
    {
      children: [
        {
          icon: Gavel,
          label: dict.company.legal.terms.label,
          to: "/terms",
        },
        {
          icon: Policy,
          label: dict.company.legal.privacy.label,
          to: "/privacy",
        },
      ],
      disabled: true,
      icon: Business,
      label: dict.company.label,
      to: "/company",
    },
    {
      children: [
        {
          icon: Login,
          label: dict.member.auth.signIn.label,
          to: "/sign-in",
        },
        {
          icon: PersonAdd,
          label: dict.member.auth.signUp.label,
          to: "/sign-up",
        },
        {
          icon: HelpOutline,
          label: dict.member.auth.forgotPassword.label,
          to: "/forgot-password",
        },
        {
          icon: LockReset,
          label: dict.member.auth.resetPassword.label,
          to: "/reset-password",
        },
        {
          icon: Group,
          label: dict.member.accountMenu.profile,
          to: "/profile",
        },
        {
          icon: Person,
          label: dict.member.accountMenu.myAccount,
          to: "/my-account",
        },
        {
          icon: PersonAdd,
          label: dict.member.accountMenu.addAnotherAccount,
          to: "/add-another-account",
        },
        {
          icon: Settings,
          label: dict.member.accountSettings.label,
          to: "/account-settings",
        },
      ],
      disabled: true,
      icon: AccountCircle,
      label: dict.member.label,
      to: "/member",
    },
    {
      children: [modeNode],
      disabled: true,
      icon: ShoppingCart,
      label: dict.order.label,
      to: "/order",
    },
  ];
};

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  transition: "none",

  "& .MuiBreadcrumbs-separator": {
    transition: theme.transitions.create("color"),
  },

  "& .MuiSvgIcon-root": {
    transition: "none",
  },
}));

interface LinkRouterProps extends MuiLinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = ({ to, ...props }: LinkRouterProps) => (
  <MuiLink component={NextLink} href={to} {...props} />
);

const iconTextBaseStyles = (theme: Theme) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  ...iconTextBaseStyles(theme),
}));

const StyledLinkRouter = styled(LinkRouter)(({ theme }) => ({
  ...iconTextBaseStyles(theme),
}));

const findBreadcrumb = (
  breadcrumbs: BreadcrumbItem[],
  targetPath: string,
  parentPath = "",
): Pick<BreadcrumbItem, "disabled" | "hidden" | "icon" | "label"> | undefined =>
  breadcrumbs.flatMap(({ children, disabled, hidden, icon, label, to }) => {
    const currentPath = `${parentPath}${to}`;

    if (currentPath === targetPath) return [{ disabled, hidden, icon, label }];

    if (children) {
      const found = findBreadcrumb(children, targetPath, currentPath);
      if (!found) return [];

      return [found];
    }

    return [];
  })[0];

const findHiddenTo = (
  startIndex: number,
  pathnames: string[],
  lang: LocaleCode,
  breadcrumbs: BreadcrumbItem[],
): string | undefined => {
  const nextIndex = startIndex + 1;
  if (nextIndex >= pathnames.length) return;

  const nextMatchPath = `/${pathnames.slice(0, nextIndex + 1).join("/")}`;
  const { hidden = false } = findBreadcrumb(breadcrumbs, nextMatchPath) || {};
  if (!hidden) return;

  const nextTo = findHiddenTo(nextIndex, pathnames, lang, breadcrumbs);
  if (!nextTo) return `/${lang}${nextMatchPath}`;

  return nextTo;
};

const RouterBreadcrumbs = () => {
  const { lang, mode, storeSlug, tableNumber, partySize } =
    useParams<RouteParams>();

  const { data: stores = [] } = useSWR<Store[]>("/api/stores");
  const storeName = getStoreName(lang, stores, storeSlug);

  const dict = useI18n();
  const breadcrumbs = breadcrumbsMap(
    dict,
    mode,
    storeSlug,
    tableNumber,
    partySize,
    storeName,
  );

  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x && x !== lang);

  const segments = pathnames.flatMap((value, index) => {
    const segmentPath = pathnames.slice(0, index + 1).join("/");
    const matchPath = `/${segmentPath}`;
    const baseTo = `/${lang}/${segmentPath}`;

    const {
      disabled = false,
      hidden = false,
      icon = () => null,
      label = value,
    } = findBreadcrumb(breadcrumbs, matchPath) || {};
    if (hidden) return [];

    const hiddenTo = findHiddenTo(index, pathnames, lang, breadcrumbs);
    const to = hiddenTo || baseTo;

    return [{ disabled, icon, label, to }];
  });

  const lastIndex = segments.length - 1;

  return (
    <StyledBreadcrumbs aria-label="breadcrumb">
      {segments.map(({ disabled, icon: Icon, label, to }, index) => {
        const isLast = index === lastIndex;
        const isText = isLast || disabled;
        const color = isLast ? "text.primary" : "text.secondary";

        return isText ? (
          <StyledTypography color={color} key={to}>
            <Icon fontSize="inherit" />
            {label}
          </StyledTypography>
        ) : (
          <StyledLinkRouter
            color="text.secondary"
            key={to}
            to={to}
            underline="always"
          >
            <Icon fontSize="inherit" />
            {label}
          </StyledLinkRouter>
        );
      })}
    </StyledBreadcrumbs>
  );
};

export default RouterBreadcrumbs;
