// https://mui.com/templates/

"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

import BrandMark from "@/components/BrandMark";

import { ORDER_MODE } from "@/constants/orderMode";

import { useI18n } from "@/context/i18n";

import { Facebook, Instagram, YouTube } from "@mui/icons-material";
import {
  Box,
  type BoxProps,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Link as MuiLink,
  Stack,
  SvgIcon,
  type SvgIconProps,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { RouteParams } from "@/types/routeParams";

import { getErrorMessage } from "@/utils/errors";
import { sendRequest } from "@/utils/fetcher";
import { interpolate } from "@/utils/i18n";

const isLikelyEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.vars.palette.background.paper,
  borderTop: `1px solid ${theme.vars.palette.divider}`,
  transition: theme.transitions.create("background-color"),
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const LineIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M12 2C6.49 2 2 5.68 2 10.2c0 2.78 1.74 5.25 4.39 6.73-.12.43-.79 2.86-.82 3.1-.04.33.18.33.37.23.15-.08 2.33-1.53 3.28-2.18.25-.17.46-.25.78-.21.66.08 1.33.13 2 .13 5.51 0 10-3.68 10-8.2C22 5.68 17.51 2 12 2zm4.56 8.93c0 .5-.4.9-.9.9H8.34c-.5 0-.9-.4-.9-.9V7.85c0-.5.4-.9.9-.9h7.32c.5 0 .9.4.9.9v3.08z" />
  </SvgIcon>
);

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/",
    icon: Instagram,
    label: "Instagram",
  },
  {
    href: "https://www.facebook.com/",
    icon: Facebook,
    label: "Facebook",
  },
  {
    href: "https://line.me/",
    icon: LineIcon,
    label: "LINE",
  },
  {
    href: "https://www.youtube.com/",
    icon: YouTube,
    label: "YouTube",
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  const dict = useI18n();

  const { lang } = useParams<RouteParams>();

  const { enqueueSnackbar } = useSnackbar();

  const { isMutating, trigger } = useSWRMutation<
    unknown,
    Error,
    string,
    { email: string }
  >("/api/newsletter", sendRequest());

  const copyrightLine = interpolate(dict.footer.copyright, {
    year: new Date().getFullYear(),
    brand: dict.footer.brand,
  });

  // 未來要修正
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isMutating) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !isLikelyEmail(trimmedEmail)) {
      enqueueSnackbar(dict.footer.newsletter.invalidEmail, {
        variant: "warning",
      });
      return;
    }

    try {
      await trigger({ email: trimmedEmail });

      setEmail("");
      enqueueSnackbar(dict.footer.newsletter.success, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
    }
  };

  return (
    <StyledBox component="footer">
      <StyledContainer disableGutters maxWidth="lg">
        <Grid container spacing={2}>
          <StyledGrid size={{ xs: 12, md: 6 }}>
            <BrandMark color="text.primary" />
            <Typography color="text.primary" variant="subtitle2">
              {dict.footer.newsletter.title}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {dict.footer.newsletter.subtitle}
            </Typography>
            <Box
              component="form"
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={1}
              onSubmit={handleSubmit}
            >
              <TextField
                autoComplete="email"
                label={dict.footer.newsletter.emailLabel}
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@email.com"
                required
                size="small"
                type="email"
                value={email}
              />
              <Button
                disabled={isMutating}
                // fullWidth
                loading={isMutating}
                loadingPosition="start"
                size="small"
                type="submit"
                variant="outlined"
              >
                {dict.footer.newsletter.action}
              </Button>
            </Box>
          </StyledGrid>
          <StyledGrid size={{ xs: 6, md: 2 }}>
            <Typography color="text.primary" variant="subtitle2">
              {dict.footer.sections.order.title}
            </Typography>
            <MuiLink
              color="text.secondary"
              component={NextLink}
              href={`/${lang}/order/${ORDER_MODE.Pickup}`}
              underline="hover"
              variant="body2"
            >
              {dict.order.mode.pickup.label}
            </MuiLink>
            <MuiLink
              color="text.secondary"
              component={NextLink}
              href={`/${lang}#dine-in`}
              underline="hover"
              variant="body2"
            >
              {dict.order.mode.dineIn.label}
            </MuiLink>
            <MuiLink
              color="text.secondary"
              component={NextLink}
              href={`/${lang}#start`}
              underline="hover"
              variant="body2"
            >
              {dict.footer.sections.order.quickStart}
            </MuiLink>
          </StyledGrid>
          <StyledGrid size={{ xs: 6, md: 2 }}>
            <Typography color="text.primary" variant="subtitle2">
              {dict.footer.sections.member.title}
            </Typography>
            <MuiLink
              color="text.secondary"
              component={NextLink}
              href={`/${lang}/member/sign-in?redirect=${encodeURIComponent(
                `/${lang}`,
              )}`}
              underline="hover"
              variant="body2"
            >
              {dict.member.auth.signIn.label}
            </MuiLink>
            <MuiLink
              color="text.secondary"
              component={NextLink}
              href={`/${lang}/member/my-account`}
              underline="hover"
              variant="body2"
            >
              {dict.member.myAccount.title}
            </MuiLink>
          </StyledGrid>
          <StyledGrid size={{ xs: 6, md: 2 }}>
            <Typography color="text.primary" variant="subtitle2">
              {dict.footer.sections.legal.title}
            </Typography>
            <MuiLink
              color="text.secondary"
              component={NextLink}
              href={`/${lang}/member/terms`}
              underline="hover"
              variant="body2"
            >
              {dict.footer.sections.legal.terms}
            </MuiLink>
            <MuiLink
              color="text.secondary"
              component={NextLink}
              href={`/${lang}/member/privacy`}
              underline="hover"
              variant="body2"
            >
              {dict.footer.sections.legal.privacy}
            </MuiLink>
          </StyledGrid>
        </Grid>
        <Divider />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={1}
        >
          <Typography color="text.secondary" variant="caption">
            {copyrightLine}
          </Typography>
          <Stack direction="row" gap={1}>
            {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
              <IconButton
                key={label}
                aria-label={label}
                component="a"
                href={href}
                rel="noopener"
                size="small"
                target="_blank"
                title={label}
              >
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </Stack>
        </Stack>
      </StyledContainer>
    </StyledBox>
  );
};

export default Footer;
