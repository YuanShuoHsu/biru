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

import type { LangStoreTableNumberParam, LocaleCode } from "@/types/locale";
import { StoreId } from "@/types/stores";
import { TableNumber } from "@/types/tableNumbers";

import { interpolate } from "@/utils/i18n";
import { getStoreName } from "@/utils/stores";
import React from "react";

interface BreadcrumbItem {
  children?: BreadcrumbItem[];
  icon: React.ComponentType<SvgIconProps>;
  label: string;
  to: string;
}

const breadcrumbsMap = (
  dict: I18nDict,
  lang: LocaleCode,
  storeId: StoreId,
  tableNumber: TableNumber,
): BreadcrumbItem[] => {
  const storeName = getStoreName(lang, storeId);
  const isTakeout = tableNumber === "0";

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
        { icon: TableBar, label: dict.nav.order.dineIn, to: "/order/dine-in" },
        { icon: LocalMall, label: dict.nav.order.pickup, to: "/order/pickup" },
        {
          icon: Storefront,
          label: storeName,
          to: `/order/${storeId}`,
          children: [
            {
              children: [
                {
                  icon: Payment,
                  label: dict.breadcrumb.order.checkout,
                  to: `/order/${storeId}/${tableNumber}/checkout`,
                },
                {
                  icon: Pets,
                  label: dict.breadcrumb.order.complete,
                  to: `/order/${storeId}/${tableNumber}/complete`,
                },
              ],
              icon: isTakeout ? LocalMall : TableBar,
              label: isTakeout
                ? interpolate(dict.order.storeId.tableNumber.takeout, {
                    tableNumber,
                  })
                : String(tableNumber),
              to: `/order/${storeId}/${tableNumber}`,
            },
          ],
        },
      ],
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
): Pick<BreadcrumbItem, "icon" | "label"> | undefined =>
  breadcrumbs.flatMap(({ children, icon, label, to }) => {
    if (to === targetPath) return [{ icon, label }];

    if (children) {
      const found = findBreadcrumb(children, targetPath);
      if (!found) return [];

      return [found];
    }

    return [];
  })[0];

const RouterBreadcrumbs = () => {
  const pathname = usePathname();
  const { lang, storeId, tableNumber } = useParams<LangStoreTableNumberParam>();

  const pathnames = pathname.split("/").filter((x) => x && x !== lang);

  const dict = useI18n();
  const breadcrumbs = breadcrumbsMap(dict, lang, storeId, tableNumber);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const segmentPath = pathnames.slice(0, index + 1).join("/");
        const matchPath = `/${segmentPath}`;
        const to = `/${lang}/${segmentPath}`;

        const { label, icon: Icon } = findBreadcrumb(
          breadcrumbs,
          matchPath,
        ) || { label: value, icon: () => null };

        return last ? (
          <StyledTypography color="text.primary" key={to}>
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
