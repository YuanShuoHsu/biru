"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";

import { ORDER_MODE } from "@/constants/orderMode";

import { useLogout } from "@/hooks/useLogout";

import {
  Grid,
  Link as MuiLink,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useAuthStore } from "@/providers/auth-store-provider";
import { useI18nStore, type I18nDict } from "@/providers/i18n-store-provider";

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

const SectionSkeleton = () => (
  <Stack gap={1} width="100%">
    <Typography variant="subtitle2">
      <Skeleton width="50%" />
    </Typography>
    <Typography variant="body2">
      <Skeleton width="70%" />
    </Typography>
    <Typography variant="body2">
      <Skeleton width="90%" />
    </Typography>
    <Typography variant="body2">
      <Skeleton width="80%" />
    </Typography>
  </Stack>
);

const footerItemsMap = ({
  accountChildren,
  authChildren,
  dict,
  isAuthLoading,
  isSignedIn,
}: {
  accountChildren: MenuItem[];
  authChildren: MenuItem[];
  dict: I18nDict;
  isAuthLoading: boolean;
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
  isAuthLoading
    ? { slot: () => <SectionSkeleton /> }
    : {
        ...(isSignedIn
          ? {
              children: accountChildren,
              label: dict.account.label,
              to: "/account",
            }
          : {
              children: authChildren,
              label: dict.auth.label,
              to: "/auth",
            }),
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
  const { isAuthLoading, isSignedIn } = useAuthStore((state) => state);

  const { dict } = useI18nStore((state) => state);

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
    isAuthLoading,
    isSignedIn,
  });

  return (
    <>
      {footerItems.map(
        ({ children, label: parentLabel, slot: Slot, to: parentTo }, index) => (
          <StyledGrid key={parentLabel || index} size={{ xs: 6, md: 2 }}>
            {Slot ? (
              <Slot level={0} />
            ) : (
              <>
                <Typography color="text.primary" variant="subtitle2">
                  {parentLabel}
                </Typography>
                {children?.map(
                  ({ label: childLabel, onClick, to: childTo }) => (
                    <MuiLink
                      color="text.secondary"
                      component={onClick ? "button" : NextLink}
                      href={
                        onClick ? undefined : `/${lang}${parentTo}${childTo}`
                      }
                      key={onClick ? childLabel : childTo}
                      onClick={onClick}
                      underline="hover"
                      variant="body2"
                    >
                      {childLabel}
                    </MuiLink>
                  ),
                )}
              </>
            )}
          </StyledGrid>
        ),
      )}
    </>
  );
};

export default LinkSection;
