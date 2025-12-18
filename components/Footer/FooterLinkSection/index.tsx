"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";

import { ORDER_MODE } from "@/constants/orderMode";
import { useI18n, type I18nDict } from "@/context/i18n";
import type { RouteParams } from "@/types/routeParams";
import { Grid, Link as MuiLink, styled, Typography } from "@mui/material";

interface FooterLink {
  href: string;
  label: string;
}

interface FooterLinkSectionData {
  title: string;
  links: FooterLink[];
}

export const createFooterLinkSections = ({
  lang,
  dict,
}: {
  lang: string;
  dict: I18nDict;
}): FooterLinkSectionData[] => [
  {
    links: [
      {
        href: `/${lang}/order/${ORDER_MODE.Pickup}`,
        label: dict.order.mode.pickup.label,
      },
    ],
    title: dict.footer.sections.order.title,
  },
  {
    links: [
      {
        href: `/${lang}/member/sign-in?redirect=${encodeURIComponent(
          `/${lang}`,
        )}`,
        label: dict.member.auth.signIn.label,
      },
      {
        href: `/${lang}/member/my-account`,
        label: dict.member.myAccount.title,
      },
    ],
    title: dict.footer.sections.member.title,
  },
  {
    links: [
      {
        href: `/${lang}/member/terms?redirect=${encodeURIComponent(
          `/${lang}`,
        )}`,
        label: dict.footer.sections.legal.terms,
      },
      {
        href: `/${lang}/member/privacy?redirect=${encodeURIComponent(
          `/${lang}`,
        )}`,
        label: dict.footer.sections.legal.privacy,
      },
    ],
    title: dict.footer.sections.legal.title,
  },
];

const StyledGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  alignItems: "flex-start",
}));

const FooterLinkSection = () => {
  const dict = useI18n();
  const { lang } = useParams<RouteParams>();

  const linkSections = createFooterLinkSections({ lang, dict });

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

export default FooterLinkSection;
