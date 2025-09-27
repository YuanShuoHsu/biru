// https://mui.com/material-ui/react-breadcrumbs/#system-IconBreadcrumbs.tsx
// https://mui.com/material-ui/react-breadcrumbs/#system-RouterBreadcrumbs.tsx

import NextLink from "next/link";
import { useParams, usePathname } from "next/navigation";
import useSWR from "swr";

import { I18nDict, useI18n } from "@/context/i18n";

import {
  AccountCircle,
  Gavel,
  HelpOutline,
  LocalMall,
  LockReset,
  Login,
  Payment,
  PersonAdd,
  Pets,
  Policy,
  Restaurant,
  ShoppingCart,
  Storefront,
  TableBar,
} from "@mui/icons-material";
import type { LinkProps, SvgIconProps, Theme } from "@mui/material";
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { LocaleCode } from "@/types/locale";
import { ORDER_MODE, type OrderMode } from "@/types/orderMode";
import type { RouteParams } from "@/types/routeParams";
import type { Store, StoreId } from "@/types/stores";
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
  storeId: StoreId,
  tableNumber: TableNumber,
  storeName: Store["name"][LocaleCode],
): BreadcrumbItem[] => {
  const orderModePath = `/order/${mode}`;
  const isDineIn = mode === ORDER_MODE.DineIn;
  const isPickup = mode === ORDER_MODE.Pickup && tableNumber === "0";

  return [
    {
      children: [
        {
          icon: Login,
          label: dict.member.auth.signIn.label,
          to: "/member/sign-in",
        },
        {
          icon: PersonAdd,
          label: dict.member.auth.signUp.label,
          to: "/member/sign-up",
        },
        {
          icon: HelpOutline,
          label: dict.member.auth.forgotPassword.label,
          to: "/member/forgot-password",
        },
        {
          icon: LockReset,
          label: dict.member.auth.resetPassword.label,
          to: "/member/reset-password",
        },
        {
          icon: Policy,
          label: dict.member.legal.privacy.label,
          to: "/member/privacy",
        },
        {
          icon: Gavel,
          label: dict.member.legal.terms.label,
          to: "/member/terms",
        },
      ],
      disabled: true,
      icon: AccountCircle,
      label: dict.member.label,
      to: "/member",
    },
    {
      children: [
        {
          children: [
            {
              children: [
                {
                  children: [
                    {
                      icon: Payment,
                      label:
                        dict.order.mode.storeId.tableNumber.stepper.checkout
                          .label,
                      to: `${orderModePath}/${storeId}/${tableNumber}/checkout`,
                    },
                    {
                      icon: Pets,
                      label:
                        dict.order.mode.storeId.tableNumber.stepper.complete
                          .label,
                      to: `${orderModePath}/${storeId}/${tableNumber}/complete`,
                    },
                  ],
                  hidden: isPickup,
                  icon: isPickup ? () => null : TableBar,
                  label: isPickup ? "" : String(tableNumber),
                  to: `${orderModePath}/${storeId}/${tableNumber}`,
                },
              ],
              disabled: isDineIn ? true : false,
              icon: Storefront,
              label: storeName,
              to: `${orderModePath}/${storeId}`,
            },
          ],
          disabled: isDineIn ? true : false,
          icon: isDineIn ? Restaurant : LocalMall,
          label: isDineIn
            ? dict.order.mode.dineIn.label
            : dict.order.mode.pickup.label,
          to: orderModePath,
        },
      ],
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

interface LinkRouterProps extends LinkProps {
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
): Pick<BreadcrumbItem, "disabled" | "hidden" | "icon" | "label"> | undefined =>
  breadcrumbs.flatMap(({ children, disabled, hidden, icon, label, to }) => {
    if (to === targetPath) return [{ disabled, hidden, icon, label }];

    if (children) {
      const found = findBreadcrumb(children, targetPath);
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
  const { lang, mode, storeId, tableNumber } = useParams<RouteParams>();

  const { data = [] } = useSWR<Store[]>("/api/stores");
  const storeName = getStoreName(data, lang, storeId);

  const dict = useI18n();
  const breadcrumbs = breadcrumbsMap(
    dict,
    mode,
    storeId,
    tableNumber,
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
