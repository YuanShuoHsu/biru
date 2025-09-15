// https://mui.com/material-ui/react-breadcrumbs/#system-IconBreadcrumbs.tsx
// https://mui.com/material-ui/react-breadcrumbs/#system-RouterBreadcrumbs.tsx

import NextLink from "next/link";
import { useParams, usePathname } from "next/navigation";

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
  ShoppingCart,
  Storefront,
  TableBar,
} from "@mui/icons-material";
import type { LinkProps, SvgIconProps, Theme } from "@mui/material";
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import type {
  LangModeStoreIdTableNumberParam,
  LocaleCode,
} from "@/types/locale";
import { ORDER_MODE, type OrderMode } from "@/types/orderMode";
import type { StoreId } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

import { interpolate } from "@/utils/i18n";
import { getStoreName } from "@/utils/stores";

interface BreadcrumbItem {
  children?: BreadcrumbItem[];
  disabled?: boolean;
  icon: React.ComponentType<SvgIconProps>;
  label: string;
  to: string;
}

const breadcrumbsMap = (
  dict: I18nDict,
  lang: LocaleCode,
  mode: OrderMode,
  storeId: StoreId,
  tableNumber: TableNumber,
): BreadcrumbItem[] => {
  const orderModePath = `/order/${mode}`;
  const isDineIn = mode === ORDER_MODE.DineIn;
  const storeName = getStoreName(lang, storeId);
  const isTakeout = mode === ORDER_MODE.Pickup && tableNumber === "0";

  return [
    {
      children: [
        {
          icon: HelpOutline,
          label: dict.breadcrumb.member.forgotPassword,
          to: "/member/forgot-password",
        },
        {
          icon: LockReset,
          label: dict.breadcrumb.member.resetPassword,
          to: "/member/reset-password",
        },
        {
          icon: Login,
          label: dict.breadcrumb.member.signIn,
          to: "/member/sign-in",
        },
        {
          icon: PersonAdd,
          label: dict.breadcrumb.member.signUp,
          to: "/member/sign-up",
        },
        {
          icon: Policy,
          label: dict.breadcrumb.member.privacy,
          to: "/member/privacy",
        },
        {
          icon: Gavel,
          label: dict.breadcrumb.member.terms,
          to: "/member/terms",
        },
      ],
      icon: AccountCircle,
      label: dict.breadcrumb.member.label,
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
                      label: dict.breadcrumb.order.checkout,
                      to: `${orderModePath}/${storeId}/${tableNumber}/checkout`,
                    },
                    {
                      icon: Pets,
                      label: dict.breadcrumb.order.complete,
                      to: `${orderModePath}/${storeId}/${tableNumber}/complete`,
                    },
                  ],
                  icon: isTakeout ? LocalMall : TableBar,
                  label: isTakeout
                    ? interpolate(dict.order.storeId.tableNumber.takeout, {
                        tableNumber,
                      })
                    : String(tableNumber),
                  to: `${orderModePath}/${storeId}/${tableNumber}`,
                },
              ],
              disabled: true,
              icon: Storefront,
              label: storeName,
              to: `${orderModePath}/${storeId}`,
            },
          ],
          disabled: isDineIn ? true : false,
          icon: isDineIn ? TableBar : LocalMall,
          label: isDineIn ? dict.nav.order.dineIn : dict.nav.order.pickup,
          to: orderModePath,
        },
      ],
      disabled: true,
      icon: ShoppingCart,
      label: dict.breadcrumb.order.label,
      to: "/order",
    },
  ];
};

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
  textAlign: "center",
  wordBreak: "keep-all",

  "& .MuiSvgIcon-root": {
    transition: "none",
  },
}));

const StyledLinkRouter = styled(LinkRouter)(({ theme }) => ({
  ...iconTextBaseStyles(theme),
}));

const findBreadcrumb = (
  breadcrumbs: BreadcrumbItem[],
  targetPath: string,
): Pick<BreadcrumbItem, "disabled" | "icon" | "label"> | undefined =>
  breadcrumbs.flatMap(({ children, disabled, icon, label, to }) => {
    if (to === targetPath) return [{ disabled, icon, label }];

    if (children) {
      const found = findBreadcrumb(children, targetPath);
      if (!found) return [];

      return [found];
    }

    return [];
  })[0];

const RouterBreadcrumbs = () => {
  const pathname = usePathname();
  const { lang, mode, storeId, tableNumber } =
    useParams<LangModeStoreIdTableNumberParam>();

  const pathnames = pathname.split("/").filter((x) => x && x !== lang);

  const dict = useI18n();
  const breadcrumbs = breadcrumbsMap(dict, lang, mode, storeId, tableNumber);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const segmentPath = pathnames.slice(0, index + 1).join("/");
        const matchPath = `/${segmentPath}`;
        const to = `/${lang}/${segmentPath}`;

        const {
          disabled,
          icon: Icon,
          label,
        } = findBreadcrumb(breadcrumbs, matchPath) || {
          disabled: false,
          icon: () => null,
          label: value,
        };

        const isText = last || disabled === true;
        const color = last ? "text.primary" : "text.secondary";

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
            underline="hover"
          >
            <Icon fontSize="inherit" />
            {label}
          </StyledLinkRouter>
        );
      })}
    </Breadcrumbs>
  );
};

export default RouterBreadcrumbs;
