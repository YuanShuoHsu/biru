"use client";

import NextLink from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

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

import type { Locale } from "@/app/[lang]/dictionaries";

import FormCard from "@/components/FormCard";

import { COUNTDOWN_DURATION } from "@/constants/verifyEmail";

import { useI18nStore } from "@/providers/i18n-store-provider";

import { sendRequest } from "@/utils/fetcher";
import { interpolate } from "@/utils/i18n";
import { handleQueryParam, QueryParamKey } from "@/utils/queryParams";
import {
  clearCountdown,
  getCountdown,
  startCountdown,
} from "@/utils/verifyEmail";

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
  shouldForwardProp: (prop) => prop !== "errorMessage",
})<{ errorMessage?: string }>(({ errorMessage, theme }) => {
  const color = errorMessage
    ? theme.palette.error.main
    : theme.palette.primary.main;

  return {
    backgroundColor: alpha(color, 0.2),
    color,
    height: theme.spacing(7),
    width: theme.spacing(7),
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
  id: string;
  lang: Locale;
  redirect?: string;
  token: string;
}

const AuthVerifyEmail = ({
  email,
  errorMessage,
  id,
  lang,
  redirect,
  token,
}: AuthVerifyEmailProps) => {
  const [countdown, setCountdown] = useState(0);

  const { handleSubmit } = useForm();

  const { dict } = useI18nStore((state) => state);

  const { isMutating: isMutatingResend, trigger: triggerResend } =
    useSWRMutation<
      void,
      Error,
      string,
      { email: string; id: string; redirect?: string }
    >(
      "/api/mail/resend",
      sendRequest({
        credentials: "include",
      }),
    );

  const updateCountdown = useCallback(() => {
    const remaining = getCountdown();

    if (remaining > 0) {
      setCountdown(remaining);
    } else {
      setCountdown(0);
      clearCountdown();
    }
  }, []);

  useEffect(() => {
    updateCountdown();
  }, [updateCountdown]);

  const isCountingDown = countdown > 0;

  useEffect(() => {
    if (!isCountingDown) return;

    const timer = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountingDown, updateCountdown]);

  const onSubmit = handleSubmit(async () => {
    try {
      startCountdown(COUNTDOWN_DURATION);
      setCountdown(COUNTDOWN_DURATION);

      await triggerResend({ email, id, ...(redirect && { redirect }) });
    } catch {
    } finally {
    }
  });

  const isFailed = Boolean(errorMessage && token);
  const isVerified = Boolean(!errorMessage && token);

  const status = isFailed ? "failed" : isVerified ? "verified" : "default";

  const signInHref = handleQueryParam(`/${lang}/auth/sign-in`, {
    [QueryParamKey.Redirect]: redirect,
  });

  const contents = {
    default: {
      actions: (
        <>
          <Button
            disabled={isMutatingResend || isCountingDown}
            fullWidth
            loading={isMutatingResend}
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
                [QueryParamKey.Redirect]: redirect,
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
          <Typography textAlign="center">
            {interpolate(dict.auth.verifyEmail.subtitle, {
              email,
            })}
          </Typography>
          <Typography
            color="text.secondary"
            textAlign="center"
            variant="caption"
          >
            {dict.auth.verifyEmail.checkSpam}
          </Typography>
        </Stack>
      ),
      icon: <MarkEmailUnread fontSize="large" />,
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
          {dict.auth.verifyEmail.failedSubtitle}
          <Typography
            color="text.secondary"
            textAlign="center"
            variant="caption"
          >
            {errorMessage}
          </Typography>
        </Stack>
      ),
      icon: <ReportGmailerrorred fontSize="large" />,
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
        <Typography textAlign="center">
          {dict.auth.verifyEmail.verifiedSubtitle}
        </Typography>
      ),
      icon: <MarkEmailRead fontSize="large" />,
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

  return (
    <FormCard component="form" onSubmit={onSubmit}>
      <StyledCardHeader title={content.title} />
      <StyledCardContent>
        <StyledAvatar errorMessage={errorMessage}>{content.icon}</StyledAvatar>
        {content.body}
      </StyledCardContent>
      <StyledCardActions disableSpacing>{content.actions}</StyledCardActions>
    </FormCard>
  );
};

export default AuthVerifyEmail;
