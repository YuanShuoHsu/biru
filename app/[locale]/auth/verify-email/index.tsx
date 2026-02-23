"use client";

import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";

import FormCard from "@/components/FormCard";

import useCountdown from "@/hooks/useCountdown";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

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
  locale: Locale;
  redirectTo?: string;
  token: string;
}

const AuthVerifyEmail = ({
  email,
  errorMessage,
  locale,
  redirectTo,
  token,
}: AuthVerifyEmailProps) => {
  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useForm();

  const tAuth = useTranslations("auth");

  const { countdown, isCountingDown, startCountdown } = useCountdown({
    key: "biru-resend-email",
  });

  const onSubmit = handleSubmit(async () => {
    const { error } = await authClient.sendVerificationEmail({
      email,
      ...(redirectTo && { callbackURL: redirectTo }),
      fetchOptions: {
        headers: {
          "Accept-Language": locale,
        },
      },
    });

    if (error?.code) {
      const message = getErrorMessage(error.code, locale);
      enqueueSnackbar(message, { variant: "error" });

      return;
    }

    startCountdown();
  });

  const isFailed = Boolean(errorMessage && token);
  const isVerified = Boolean(!errorMessage && token);

  const status = isFailed ? "failed" : isVerified ? "verified" : "default";

  const signInHref = handleQueryParam("/auth/sign-in", {
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
              ? tAuth("verifyEmail.countdown", {
                  seconds: countdown,
                  text: tAuth("verifyEmail.resend"),
                })
              : tAuth("verifyEmail.resend")}
          </Button>
          <Button
            component={Link}
            fullWidth
            href={signInHref}
            size="large"
            variant="outlined"
          >
            {tAuth("verifyEmail.backToSignIn")}
          </Button>
          <Divider flexItem />
          <Stack flexDirection="row" alignItems="center" gap={0.5}>
            <Typography variant="body2">
              {tAuth("verifyEmail.wrongEmail")}
            </Typography>
            <MuiLink
              component={Link}
              href={handleQueryParam("/auth/sign-up", {
                [QueryParamKey.RedirectTo]: redirectTo,
              })}
              underline="hover"
              variant="body2"
            >
              {tAuth("signUp.label")}
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
            {tAuth("verifyEmail.confirmationText")}
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
          {tAuth("verifyEmail.title")}
        </Typography>
      ),
    },
    failed: {
      actions: (
        <Button
          component={Link}
          fullWidth
          href={signInHref}
          size="large"
          variant="contained"
        >
          {tAuth("verifyEmail.backToSignIn")}
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
          {tAuth("verifyEmail.failedTitle")}
        </Typography>
      ),
    },
    verified: {
      actions: (
        <Button
          component={Link}
          fullWidth
          href={signInHref}
          size="large"
          variant="contained"
        >
          {tAuth("verifyEmail.backToSignIn")}
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
            {tAuth("verifyEmail.signInText")}
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
          {tAuth("verifyEmail.verifiedTitle")}
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
