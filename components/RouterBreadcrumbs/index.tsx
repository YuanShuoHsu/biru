// https://mui.com/material-ui/react-breadcrumbs/#CondensedWithMenu.tsx
// https://mui.com/material-ui/react-breadcrumbs/#system-IconBreadcrumbs.tsx
// https://mui.com/material-ui/react-breadcrumbs/#system-RouterBreadcrumbs.tsx

"use client";

import { useState } from "react";

import { findRoute } from "@/constants/routes";

import { useNavItem } from "@/hooks/useNavItem";

import { Link, usePathname } from "@/i18n/navigation";

import { MoreHoriz } from "@mui/icons-material";
import {
  Breadcrumbs,
  IconButton,
  LinkProps,
  Menu,
  type MenuItemProps,
  Link as MuiLink,
  MenuItem as MuiMenuItem,
  Typography,
} from "@mui/material";
import { type CSSObject, styled, type Theme } from "@mui/material/styles";

import type { NavItem } from "@/types/navItem";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  flex: 1,
  transition: "none",

  "& .MuiBreadcrumbs-separator": {
    transition: theme.transitions.create("color"),
  },

  "& .MuiSvgIcon-root": {
    transition: "none",
  },
}));

const iconTextBaseStyles = (theme: Theme): CSSObject => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(0.5),
  overflowWrap: "anywhere",

  "& > .MuiSvgIcon-root": {
    marginTop: "calc((1lh - 1em) / 2)",
  },
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  ...iconTextBaseStyles(theme),
}));

const StyledLink = styled(MuiLink)<LinkProps>(({ theme }) => ({
  ...iconTextBaseStyles(theme),
}));

const StyledMenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  ...iconTextBaseStyles(theme),
}));

const ITEMS_BEFORE_COLLAPSE = 1;
const ITEMS_AFTER_COLLAPSE = 2;
const MAX_ITEMS = ITEMS_BEFORE_COLLAPSE + ITEMS_AFTER_COLLAPSE + 1;

interface RouterBreadcrumbsProps {
  organizationName: string;
}

const RouterBreadcrumbs = ({ organizationName }: RouterBreadcrumbsProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const navItem = useNavItem();

  const labels: Partial<Record<string, string>> = {
    organizationSlug: organizationName,
  };

  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  const segments: NavItem[] = pathnames.map((value, index) => {
    const segmentPath = pathnames.slice(0, index + 1).join("/");
    const path = `/${segmentPath}`;

    const { icon, label, to } = navItem(path);
    const { disabled, param } = findRoute(path) || {};

    const dynamicLabel = param ? labels[param] : undefined;

    return {
      disabled,
      icon,
      label: dynamicLabel ?? label ?? value,
      to,
    };
  });

  const lastSegment = segments.at(-1);
  const isCollapsed = segments.length > MAX_ITEMS;
  const afterStart = segments.length - ITEMS_AFTER_COLLAPSE;
  const collapsedItems = segments.slice(ITEMS_BEFORE_COLLAPSE, afterStart);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement> | null) => {
    if (event) setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const renderSegment = (segment: NavItem) => {
    const { disabled, icon: Icon, label, to } = segment;
    const isLast = segment === lastSegment;
    const isText = isLast || disabled;
    const color = isLast ? "text.primary" : "text.secondary";

    return isText ? (
      <StyledTypography color={color} key={to}>
        {Icon && <Icon fontSize="inherit" />}
        {label}
      </StyledTypography>
    ) : (
      <StyledLink
        color="text.secondary"
        component={Link}
        href={to}
        key={to}
        underline="always"
      >
        {Icon && <Icon fontSize="inherit" />}
        {label}
      </StyledLink>
    );
  };

  return (
    <>
      {isCollapsed && (
        <Menu
          anchorEl={anchorEl}
          aria-labelledby="breadcrumbs-menu-trigger"
          onClose={handleClose}
          open={open}
        >
          {collapsedItems.map(({ disabled, icon: Icon, label, to }) => (
            <StyledMenuItem
              disabled={disabled}
              key={to}
              onClick={handleClose}
              {...(disabled ? {} : { component: Link, href: to })}
            >
              {Icon && <Icon fontSize="inherit" />}
              {label}
            </StyledMenuItem>
          ))}
        </Menu>
      )}
      <StyledBreadcrumbs aria-label="breadcrumb">
        {isCollapsed
          ? [
              ...segments.slice(0, ITEMS_BEFORE_COLLAPSE).map(renderSegment),
              <IconButton
                color="inherit"
                id="breadcrumbs-menu-trigger"
                key="collapsed-trigger"
                onClick={handleOpen}
                size="small"
              >
                <MoreHoriz fontSize="inherit" />
              </IconButton>,
              ...segments.slice(afterStart).map(renderSegment),
            ]
          : segments.map(renderSegment)}
      </StyledBreadcrumbs>
    </>
  );
};

export default RouterBreadcrumbs;
