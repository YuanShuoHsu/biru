"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";

import { ORDER_MODE } from "@/constants/orderMode";
import { useI18n, type I18nDict } from "@/context/i18n";

import { useLogout } from "@/hooks/useLogout";

import { Grid, Link as MuiLink, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useAuthStore } from "@/providers/auth-store-provider";

import type { MenuItem } from "@/types/menuItem";
import type { RouteParams } from "@/types/routeParams";

import {
  getAccountMenuItems,
  getLogoutMenuItem,
  getProfileMenuItems,
} from "@/utils/account";
import { getAuthMenuItems } from "@/utils/auth";

const StyledGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  alignItems: "flex-start",
}));

const footerItemsMap = ({
  accountChildren,
  authChildren,
  dict,
  isSignedIn,
}: {
  accountChildren: MenuItem[];
  authChildren: MenuItem[];
  dict: I18nDict;
  isSignedIn: boolean;
}): MenuItem[] => [
  {
    children: [
      {
        label: dict.order.mode.pickup.label,
        to: `/${ORDER_MODE.Pickup}`,
      },
    ],
    label: dict.order.label,
    to: "/order",
  },
  isSignedIn
    ? {
        children: accountChildren,
        label: dict.account.label,
        to: "/account",
      }
    : {
        children: authChildren,
        label: dict.auth.label,
        to: "/auth",
      },
  {
    children: [
      {
        label: dict.company.about.label,
        to: `/about`,
      },
      {
        label: dict.company.legal.terms.label,
        to: `/terms`,
      },
      {
        label: dict.company.legal.privacy.label,
        to: `/privacy`,
      },
    ],
    label: dict.company.label,
    to: "/company",
  },
];

const LinkSection = () => {
  const { isSignedIn } = useAuthStore((state) => state);

  const dict = useI18n();

  const { handleLogout, isMutatingLogout } = useLogout();

  const { lang } = useParams<RouteParams>();

  const authChildren = getAuthMenuItems(dict).map(({ label, to }) => ({
    label,
    to,
  }));

  const accountChildren = [
    ...getProfileMenuItems(dict),
    ...getAccountMenuItems(dict),
    getLogoutMenuItem(dict, { isMutatingLogout, onLogout: handleLogout }),
  ];

  const footerItems = footerItemsMap({
    accountChildren,
    authChildren,
    dict,
    isSignedIn,
  });

  return (
    <>
      {footerItems.map(({ children, label: parentLabel, to: parentTo }) => (
        <StyledGrid key={parentLabel} size={{ xs: 6, md: 2 }}>
          <Typography color="text.primary" variant="subtitle2">
            {parentLabel}
          </Typography>
          {children?.map(({ label: childLabel, onClick, to: childTo }) => {
            if (onClick) {
              return (
                <MuiLink
                  color="text.secondary"
                  component="button"
                  key={childLabel}
                  onClick={onClick}
                  underline="hover"
                  variant="body2"
                >
                  {childLabel}
                </MuiLink>
              );
            }

            return (
              <MuiLink
                color="text.secondary"
                component={NextLink}
                href={`/${lang}${parentTo}${childTo}`}
                key={childTo}
                underline="hover"
                variant="body2"
              >
                {childLabel}
              </MuiLink>
            );
          })}
        </StyledGrid>
      ))}
    </>
  );
};

export default LinkSection;
