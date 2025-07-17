// https://mui.com/material-ui/react-breadcrumbs/#system-IconBreadcrumbs.tsx
// https://mui.com/material-ui/react-breadcrumbs/#system-RouterBreadcrumbs.tsx

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { I18nDict, useI18n } from "@/context/i18n";

import { Payment, Pets, ShoppingCart, TableBar } from "@mui/icons-material";
import type { LinkProps, SvgIconProps, Theme } from "@mui/material";
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface BreadcrumbItem {
  icon: React.ComponentType<SvgIconProps>;
  label: string;
}

const createBreadcrumbMap = (
  dict: I18nDict,
  tableNumber: string,
): Record<string, BreadcrumbItem> => ({
  // "/": {
  //   icon: Home,
  //   label: "Home",
  // },
  "/order": {
    icon: ShoppingCart,
    label: dict.breadcrumb.order,
  },
  [`/order/${tableNumber}`]: {
    icon: TableBar,
    label: `${tableNumber}`,
  },
  [`/order/${tableNumber}/checkout`]: {
    icon: Payment,
    label: dict.breadcrumb.checkout,
  },
  [`/order/${tableNumber}/complete`]: {
    icon: Pets,
    label: dict.breadcrumb.complete,
  },
});

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = ({ to, ...props }: LinkRouterProps) => (
  <MuiLink component={Link} href={to} {...props} />
);

const iconTextBaseStyles = (theme: Theme) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  ...iconTextBaseStyles(theme),

  "& .MuiSvgIcon-root": {
    transition: "none",
  },
}));

const StyledLinkRouter = styled(LinkRouter)(({ theme }) => ({
  ...iconTextBaseStyles(theme),
}));

const RouterBreadcrumbs = () => {
  const pathname = usePathname();
  const { lang, tableNumber } = useParams();

  const dict = useI18n();
  const breadcrumbs = createBreadcrumbMap(dict, String(tableNumber));
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
