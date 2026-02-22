"use client";

import { useTranslations } from "next-intl";
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

import type { MenuItem } from "@/types/menuItem";
import type { RouteParams } from "@/types/routeParams";

import { getAccountMenuItems, getProfileMenuItems } from "@/utils/account";
import { getAuthMenuItems, getLogoutMenuItem } from "@/utils/auth";

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

const useFooterItems = (): MenuItem[] => {
  const { isAuthLoading, isSignedIn } = useAuthStore((state) => state);

  const { handleLogout, isMutatingLogout } = useLogout();

  const tOrder = useTranslations("order");
  const tAuth = useTranslations("auth");
  const tAccount = useTranslations("account");
  const tCompany = useTranslations("company");

  const authChildren = getAuthMenuItems(tAuth).map(({ label, to }) => ({
    label,
    to,
  }));

  const accountChildren = [
    ...getProfileMenuItems(tAccount),
    ...getAccountMenuItems(tAccount),
    getLogoutMenuItem(tAuth, { isMutatingLogout, onLogout: handleLogout }),
  ];

  return [
    {
      children: [
        {
          label: tOrder("mode.pickup.label"),
          to: `/${ORDER_MODE.Pickup}`,
        },
      ],
      label: tOrder("label"),
      to: "/order",
    },
    isAuthLoading
      ? { slot: () => <SectionSkeleton /> }
      : {
          ...(isSignedIn
            ? {
                children: accountChildren,
                label: tAccount("label"),
                to: "/account",
              }
            : {
                children: authChildren,
                label: tAuth("label"),
                to: "/auth",
              }),
        },
    {
      children: [
        {
          label: tCompany("about.label"),
          to: `/about`,
        },
        {
          label: tCompany("legal.terms.label"),
          to: `/terms`,
        },
        {
          label: tCompany("legal.privacy.label"),
          to: `/privacy`,
        },
      ],
      label: tCompany("label"),
      to: "/company",
    },
  ];
};

const LinkSection = () => {
  const { locale } = useParams<RouteParams>();
  const footerItems = useFooterItems();

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
                        onClick ? undefined : `/${locale}${parentTo}${childTo}`
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
