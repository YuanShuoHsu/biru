"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";

import { ORDER_MODE } from "@/constants/orderMode";
import { useI18n, type I18nDict } from "@/context/i18n";
import { useAuthStore } from "@/stores/useAuthStore";
import type { RouteParams } from "@/types/routeParams";
import {
  getAccountLinkItems,
  getMemberAuthLinkItems,
  getProfileMenuItems,
} from "@/utils/auth";
import { Grid, Link as MuiLink, styled, Typography } from "@mui/material";

interface FooterLink {
  href: string;
  label: string;
}

interface FooterLinkSectionData {
  title: string;
  links: FooterLink[];
}

const createFooterLinkSections = ({
  lang,
  dict,
  isSignedIn,
}: {
  lang: string;
  dict: I18nDict;
  isSignedIn: boolean;
}): FooterLinkSectionData[] => [
  {
    links: [
      {
        href: `/${lang}/order/${ORDER_MODE.Pickup}`,
        label: dict.order.mode.pickup.label,
      },
    ],
    title: dict.home.footer.sections.order.title,
  },
  {
    links: !isSignedIn
      ? getMemberAuthLinkItems(dict, `/${lang}`).map(({ label, to }) => ({
          href: `/${lang}/member${to}`,
          label,
        }))
      : [...getProfileMenuItems(dict), ...getAccountLinkItems(dict)].map(
          ({ label, to }) => ({
            href: `/${lang}/member${to}`,
            label,
          }),
        ),
    title: dict.home.footer.sections.member.title,
  },
  {
    links: [
      {
        href: `/${lang}/member/terms?redirect=${encodeURIComponent(
          `/${lang}`,
        )}`,
        label: dict.home.footer.sections.legal.terms,
      },
      {
        href: `/${lang}/member/privacy?redirect=${encodeURIComponent(
          `/${lang}`,
        )}`,
        label: dict.home.footer.sections.legal.privacy,
      },
    ],
    title: dict.home.footer.sections.legal.title,
  },
];

const StyledGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  alignItems: "flex-start",
}));

const LinkSection = () => {
  const dict = useI18n();
  const { lang } = useParams<RouteParams>();

  const { isSignedIn } = useAuthStore();

  const linkSections = createFooterLinkSections({ lang, dict, isSignedIn });

  return (
    <>
      {linkSections.map(({ links, title }) => (
        <StyledGrid key={title} size={{ xs: 6, md: 2 }}>
          <Typography color="text.primary" variant="subtitle2">
            {title}
          </Typography>
          {links.map(({ href, label }) => (
            <MuiLink
              key={href}
              color="text.secondary"
              component={NextLink}
              href={href}
              underline="hover"
              variant="body2"
            >
              {label}
            </MuiLink>
          ))}
        </StyledGrid>
      ))}
    </>
  );
};

export default LinkSection;
