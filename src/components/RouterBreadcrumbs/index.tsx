// https://mui.com/material-ui/react-breadcrumbs/#system-IconBreadcrumbs.tsx
// https://mui.com/material-ui/react-breadcrumbs/#system-RouterBreadcrumbs.tsx

import NextLink from "next/link";
import { useParams, usePathname } from "next/navigation";

import { I18nDict, useI18n } from "@/context/i18n";

import {
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

import type { LangStoreTableNumberParam } from "@/types/locale";

import { interpolate } from "@/utils/i18n";

import type { StoreId } from "@/types/stores";
import type { TableNumberParam } from "@/types/tableNumbers";

interface BreadcrumbItem {
  icon: React.ComponentType<SvgIconProps>;
  label: string;
}

const breadcrumbMap = (
  dict: I18nDict,
  storeId: StoreId,
  tableNumber: TableNumberParam,
): Record<string, BreadcrumbItem> => {
  const isTakeout = tableNumber === "0";

  return {
    // "/": {
    //   icon: Home,
    //   label: "Home",
    // },
    "/order": {
      icon: ShoppingCart,
      label: dict.breadcrumb.order,
    },
    [`/order/${storeId}`]: {
      icon: Storefront,
      label: storeId,
    },
    [`/order/${storeId}/${tableNumber}`]: {
      icon: isTakeout ? LocalMall : TableBar,
      label: isTakeout
        ? interpolate(dict.order.storeId.tableNumber.takeout, { tableNumber })
        : tableNumber,
    },
    [`/order/${storeId}/${tableNumber}/checkout`]: {
      icon: Payment,
      label: dict.breadcrumb.checkout,
    },
    [`/order/${storeId}/${tableNumber}/complete`]: {
      icon: Pets,
      label: dict.breadcrumb.complete,
    },
    "/forgot-password": {
      icon: HelpOutline,
      label: dict.breadcrumb.forgotPassword,
    },
    "/reset-password": {
      icon: LockReset,
      label: dict.breadcrumb.resetPassword,
    },
    "/sign-in": { icon: Login, label: dict.breadcrumb.signIn },
    "/sign-up": { icon: PersonAdd, label: dict.breadcrumb.signUp },
    "/privacy": { icon: Policy, label: dict.breadcrumb.privacy },
    "/terms": { icon: Gavel, label: dict.breadcrumb.terms },
  };
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

const RouterBreadcrumbs = () => {
  const pathname = usePathname();
  const { lang, storeId, tableNumber } = useParams<LangStoreTableNumberParam>();

  const dict = useI18n();
  const breadcrumbs = breadcrumbMap(dict, storeId, tableNumber);
  // const { icon: HomeIcon, label: homeLabel } = breadcrumbs["/"];

  const pathnames = pathname.split("/").filter((x) => x && x !== lang);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {/* <StyledLinkRouter underline="hover" color="inherit" to={`/${lang}`}>
        <HomeIcon fontSize="inherit" />
        {homeLabel}
      </StyledLinkRouter> */}
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const subPath = pathnames.slice(0, index + 1).join("/");
        const key = `/${subPath}`;
        const to = `/${lang}/${subPath}`;

        const { label = value, icon: Icon = () => null } =
          breadcrumbs[key] || {};

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
