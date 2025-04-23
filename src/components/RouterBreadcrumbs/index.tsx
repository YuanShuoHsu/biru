// https://mui.com/material-ui/react-breadcrumbs/#system-RouterBreadcrumbs.tsx

import NextLink from "next/link";
import { usePathname } from "next/navigation";

import type { LinkProps } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";

const breadcrumbNameMap: { [key: string]: string } = {
  "/inbox": "Inbox",
  "/inbox/important": "Important",
  "/trash": "Trash",
  "/spam": "Spam",
  "/drafts": "Drafts",
};

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = ({ to, ...props }: LinkRouterProps) => {
  return <Link component={NextLink} href={to} {...props} />;
};

const RouterBreadcrumbs = () => {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <LinkRouter underline="hover" color="inherit" to="/">
        Home
      </LinkRouter>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return last ? (
          <Typography key={to} sx={{ color: "text.primary" }}>
            {breadcrumbNameMap[to]}
          </Typography>
        ) : (
          <LinkRouter underline="hover" color="inherit" to={to} key={to}>
            {breadcrumbNameMap[to]}
          </LinkRouter>
        );
      })}
    </Breadcrumbs>
  );
};

export default RouterBreadcrumbs;
