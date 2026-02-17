"use client";

import NextLink from "next/link";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";

import type { Locale } from "@/app/[lang]/dictionaries";

import FormCard from "@/components/FormCard";

import useCountdown from "@/hooks/useCountdown";

import { authClient, getErrorMessage } from "@/lib/auth-client";

import {
  MarkEmailRead,
  MarkEmailUnread,
  ReportGmailerrorred,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

import { useI18nStore } from "@/providers/i18n-store-provider";

import { interpolate } from "@/utils/i18n";
import { handleQueryParam, QueryParamKey } from "@/utils/queryParams";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingBottom: 0,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: "error" | "primary" }>(({ color, theme }) => {
  const mainColor = theme.palette[color].main;

  return {
    width: theme.spacing(7),
    height: theme.spacing(7),
    backgroundColor: alpha(mainColor, 0.2),
    color: mainColor,
  };
});

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
}));

interface AuthVerifyEmailProps {
  email: string;
  errorMessage: string;
  lang: Locale;
  redirectTo?: string;
  token: string;
}

const AuthVerifyEmail = ({
  email,
  errorMessage,
  lang,
  redirectTo,
  token,
}: AuthVerifyEmailProps) => {
  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useForm();

  const { dict } = useI18nStore((state) => state);

  const { countdown, isCountingDown, startCountdown } = useCountdown({
    key: "biru-resend-email",
  });

  const onSubmit = handleSubmit(async () => {
    const { error } = await authClient.sendVerificationEmail({
      email,
      ...(redirectTo && { callbackURL: redirectTo }),
      fetchOptions: {
        headers: {
          "Accept-Language": lang,
        },
      },
    });

    if (error?.code) {
      const message = getErrorMessage(error.code, lang);
      enqueueSnackbar(message, { variant: "error" });

      return;
    }

    startCountdown();
  });

  const isFailed = Boolean(errorMessage && token);
  const isVerified = Boolean(!errorMessage && token);

  const status = isFailed ? "failed" : isVerified ? "verified" : "default";

  const signInHref = handleQueryParam(`/${lang}/auth/sign-in`, {
    [QueryParamKey.RedirectTo]: redirectTo,
  });

  const contents = {
    default: {
      actions: (
        <>
          <Button
            disabled={isSubmitting || isCountingDown}
            fullWidth
            loading={isSubmitting}
            loadingPosition="start"
            size="large"
            type="submit"
            variant="contained"
          >
            {isCountingDown
              ? interpolate(dict.auth.verifyEmail.countdown, {
                  seconds: countdown,
                  text: dict.auth.verifyEmail.resend,
                })
              : dict.auth.verifyEmail.resend}
          </Button>
          <Button
            component={NextLink}
            fullWidth
            href={signInHref}
            size="large"
            variant="outlined"
          >
            {dict.auth.verifyEmail.backToSignIn}
          </Button>
          <Divider flexItem />
          <Stack flexDirection="row" alignItems="center" gap={0.5}>
            <Typography variant="body2">
              {dict.auth.verifyEmail.wrongEmail}
            </Typography>
            <MuiLink
              component={NextLink}
              href={handleQueryParam(`/${lang}/auth/sign-up`, {
                [QueryParamKey.RedirectTo]: redirectTo,
              })}
              underline="hover"
              variant="body2"
            >
              {dict.auth.signUp.label}
            </MuiLink>
          </Stack>
        </>
      ),
      body: (
        <Stack spacing={1} alignItems="center">
          <Typography textAlign="center">{email}</Typography>
          <Typography
            color="text.secondary"
            textAlign="center"
            variant="caption"
          >
            {dict.auth.verifyEmail.confirmationText}
          </Typography>
        </Stack>
      ),
      icon: MarkEmailUnread,
      title: (
        <Typography
          color="primary"
          fontWeight="bold"
          textAlign="center"
          variant="h6"
        >
          {dict.auth.verifyEmail.title}
        </Typography>
      ),
    },
    failed: {
      actions: (
        <Button
          component={NextLink}
          fullWidth
          href={signInHref}
          size="large"
          variant="contained"
        >
          {dict.auth.verifyEmail.backToSignIn}
        </Button>
      ),
      body: (
        <Stack spacing={1} alignItems="center">
          <Typography textAlign="center">{email}</Typography>
          <Typography
            color="text.secondary"
            textAlign="center"
            variant="caption"
          >
            {errorMessage}
          </Typography>
        </Stack>
      ),
      icon: ReportGmailerrorred,
      title: (
        <Typography
          color="error"
          fontWeight="bold"
          textAlign="center"
          variant="h6"
        >
          {dict.auth.verifyEmail.failedTitle}
        </Typography>
      ),
    },
    verified: {
      actions: (
        <Button
          component={NextLink}
          fullWidth
          href={signInHref}
          size="large"
          variant="contained"
        >
          {dict.auth.verifyEmail.backToSignIn}
        </Button>
      ),
      body: (
        <Stack spacing={1} alignItems="center">
          <Typography textAlign="center">{email}</Typography>
          <Typography
            color="text.secondary"
            textAlign="center"
            variant="caption"
          >
            {dict.auth.verifyEmail.signInText}
          </Typography>
        </Stack>
      ),
      icon: MarkEmailRead,
      title: (
        <Typography
          color="primary"
          fontWeight="bold"
          textAlign="center"
          variant="h6"
        >
          {dict.auth.verifyEmail.verifiedTitle}
        </Typography>
      ),
    },
  };

  const content = contents[status];
  const Icon = content.icon;

  return (
    <FormCard component="form" onSubmit={onSubmit}>
      <StyledCardHeader title={content.title} />
      <StyledCardContent>
        <StyledAvatar color={isFailed ? "error" : "primary"}>
          <Icon fontSize="large" />
        </StyledAvatar>
        {content.body}
      </StyledCardContent>
      <StyledCardActions disableSpacing>{content.actions}</StyledCardActions>
    </FormCard>
  );
};

export default AuthVerifyEmail;
