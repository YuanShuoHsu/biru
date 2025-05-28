// https://mui.com/material-ui/react-breadcrumbs/#system-IconBreadcrumbs.tsx
// https://mui.com/material-ui/react-breadcrumbs/#system-RouterBreadcrumbs.tsx

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { Home, Payment, ShoppingCart } from "@mui/icons-material";
import type { LinkProps, SvgIconProps } from "@mui/material";
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface BreadcrumbItem {
  icon: React.ComponentType<SvgIconProps>;
  label: string;
}

const breadcrumbMap: { [key: string]: BreadcrumbItem } = {
  "/order": {
    icon: ShoppingCart,
    label: "Order",
  },
  "/order/checkout": {
    icon: Payment,
    label: "Checkout",
  },
};

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
  const { lang } = useParams();

  const pathnames = pathname.split("/").filter((x) => x && x !== lang);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <StyledLinkRouter underline="hover" color="inherit" to={`/${lang}`}>
        <Home fontSize="inherit" />
        Home
      </StyledLinkRouter>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const subPath = pathnames.slice(0, index + 1).join("/");
        const key = `/${subPath}`;
        const to = `/${lang}/${subPath}`;

        const { label = value, icon: Icon = () => null } =
          breadcrumbMap[key] || {};

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
