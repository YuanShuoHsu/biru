// https://mui.com/material-ui/react-breadcrumbs/#system-IconBreadcrumbs.tsx
// https://mui.com/material-ui/react-breadcrumbs/#system-RouterBreadcrumbs.tsx

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { CheckCircle, Home, Payment, ShoppingCart } from "@mui/icons-material";
import type { LinkProps, SvgIconProps } from "@mui/material";
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface BreadcrumbItem {
  icon: React.ComponentType<SvgIconProps>;
  label: string;
}

const createBreadcrumbMap = (
  tableNumber: string,
): Record<string, BreadcrumbItem> => ({
  "/": {
    icon: Home,
    label: "Home",
  },
  "/order": {
    icon: ShoppingCart,
    label: "Order",
  },
  [`/order/${tableNumber}`]: {
    icon: ShoppingCart,
    label: `${tableNumber}`,
  },
  [`/order/${tableNumber}/checkout`]: {
    icon: Payment,
    label: "Checkout",
  },
  [`/order/${tableNumber}/complete`]: {
    icon: CheckCircle,
    label: "Complete",
  },
});

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = ({ to, ...props }: LinkRouterProps) => (
  <MuiLink component={Link} href={to} {...props} />
);

const StyledTypography = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  color: theme.palette.text.primary,
}));

const StyledLinkRouter = styled(LinkRouter)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
}));

const RouterBreadcrumbs = () => {
  const pathname = usePathname();
  const { lang, tableNumber } = useParams();

  const breadcrumbs = createBreadcrumbMap(tableNumber as string);
  const { icon: HomeIcon, label: homeLabel } = breadcrumbs["/"];

  const pathnames = pathname.split("/").filter((x) => x && x !== lang);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <StyledLinkRouter underline="hover" color="inherit" to={`/${lang}`}>
        <HomeIcon fontSize="inherit" />
        {homeLabel}
      </StyledLinkRouter>
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
          <StyledLinkRouter color="inherit" key={to} to={to} underline="hover">
            <Icon fontSize="inherit" />
            {label}
          </StyledLinkRouter>
        );
      })}
    </Breadcrumbs>
  );
};

export default RouterBreadcrumbs;
