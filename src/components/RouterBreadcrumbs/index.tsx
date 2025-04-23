// https://mui.com/material-ui/react-breadcrumbs/#system-IconBreadcrumbs.tsx
// https://mui.com/material-ui/react-breadcrumbs/#system-RouterBreadcrumbs.tsx

import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { Home, ShoppingCart } from "@mui/icons-material";
import type { LinkProps, SvgIconProps } from "@mui/material";
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";

interface BreadcrumbItem {
  icon: React.ComponentType<SvgIconProps>;
  label: string;
}

const breadcrumbMap: { [key: string]: BreadcrumbItem } = {
  "/": {
    icon: Home,
    label: "Home",
  },
  "/order": {
    icon: ShoppingCart,
    label: "Order",
  },
};

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = ({ to, ...props }: LinkRouterProps) => (
  <MuiLink component={NextLink} href={to} {...props} />
);

const RouterBreadcrumbs = () => {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  const breadcrumbRootItem = breadcrumbMap["/"];
  const { label: rootLabel, icon: RootIcon } = breadcrumbRootItem;

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <LinkRouter
        underline="hover"
        color="inherit"
        to="/"
        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
      >
        <RootIcon fontSize="inherit" />
        {rootLabel}
      </LinkRouter>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        const breadcrumbItem = breadcrumbMap[to];
        const { label, icon: Icon } = breadcrumbItem;

        return last ? (
          <Typography
            key={to}
            sx={{
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Icon fontSize="inherit" />
            {label}
          </Typography>
        ) : (
          <LinkRouter
            color="inherit"
            key={to}
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            to={to}
            underline="hover"
          >
            <Icon fontSize="inherit" />
            {label}
          </LinkRouter>
        );
      })}
    </Breadcrumbs>
  );
};

export default RouterBreadcrumbs;
