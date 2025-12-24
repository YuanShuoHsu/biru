"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";

import { ORDER_MODE } from "@/constants/orderMode";
import { useI18n, type I18nDict } from "@/context/i18n";

import {
  getAccountLinkItems,
  getMemberAuthLinkItems,
  getProfileMenuItems,
} from "@/utils/auth";
import { Grid, Link as MuiLink, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useAuthStore } from "@/stores/useAuthStore";

import type { RouteParams } from "@/types/routeParams";

const StyledGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  alignItems: "flex-start",
}));

interface FooterItem {
  children?: FooterItem[];
  label: string;
  to: string;
}

const footerItemsMap = ({
  dict,
  isSignedIn,
}: {
  dict: I18nDict;
  isSignedIn: boolean;
}): FooterItem[] => [
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
  {
    children: !isSignedIn
      ? getMemberAuthLinkItems(dict).map(({ label, to }) => ({
          label,
          to,
        }))
      : [...getProfileMenuItems(dict), ...getAccountLinkItems(dict)].map(
          ({ label, to }) => ({
            label,
            to,
          }),
        ),
    label: dict.member.label,
    to: "/member",
  },
  {
    children: [
      {
        label: dict.company.about.label,
        to: `/about`,
      },
      {
        label: dict.company.legal.terms.label,
        to: `/terms?redirect=${encodeURIComponent("/")}`,
      },
      {
        label: dict.company.legal.privacy.label,
        to: `/privacy?redirect=${encodeURIComponent("/")}`,
      },
    ],
    label: dict.company.label,
    to: "/company",
  },
];

const LinkSection = () => {
  const { isSignedIn } = useAuthStore();

  const dict = useI18n();

  const { lang } = useParams<RouteParams>();

  const items = footerItemsMap({ dict, isSignedIn });

  return (
    <>
      {items.map(({ children, label: parentLabel, to: parentTo }) => (
        <StyledGrid key={parentLabel} size={{ xs: 6, md: 2 }}>
          <Typography color="text.primary" variant="subtitle2">
            {parentLabel}
          </Typography>
          {children?.map(({ label: childLabel, to: childTo }) => (
            <MuiLink
              key={childTo}
              color="text.secondary"
              component={NextLink}
              href={`/${lang}${parentTo}${childTo}`}
              underline="hover"
              variant="body2"
            >
              {childLabel}
            </MuiLink>
          ))}
        </StyledGrid>
      ))}
    </>
  );
};

export default LinkSection;
