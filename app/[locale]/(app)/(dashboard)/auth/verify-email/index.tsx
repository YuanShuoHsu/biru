"use client";

import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";

import FormCard from "@/components/FormCard";

import { query } from "@/constants/query";

import useCountdown from "@/hooks/useCountdown";

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
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

import { getHref } from "@/utils/href";

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

const VERIFY_STATUS = {
  DEFAULT: "default",
  FAILED: "failed",
  VERIFIED: "verified",
} as const;

type VerifyStatus = (typeof VERIFY_STATUS)[keyof typeof VERIFY_STATUS];

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
  const isFailed = Boolean(errorMessage && token);
  const isVerified = Boolean(!errorMessage && token);
  const status: VerifyStatus = isFailed
    ? VERIFY_STATUS.FAILED
    : isVerified
      ? VERIFY_STATUS.VERIFIED
      : VERIFY_STATUS.DEFAULT;

  const { countdown, isCountingDown, startCountdown } = useCountdown({
    autoStart: status === VERIFY_STATUS.DEFAULT,
    key: "biru-resend-email",
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useForm();

  const tAuth = useTranslations("auth");

  const signInHref = getHref("/auth/sign-in", {
    [query.redirectTo]: redirectTo,
  });
  const signUpHref = getHref("/auth/sign-up", {
    [query.redirectTo]: redirectTo,
  });

  const onSubmit = handleSubmit(async () => {
    const { error } = await authClient.sendVerificationEmail({
      callbackURL: redirectTo,
      email,
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

  const configs: Record<
    VerifyStatus,
    {
      actions: React.ReactNode;
      color: "error" | "primary";
      icon: React.ElementType;
      subtitle: React.ReactNode;
      title: React.ReactNode;
    }
  > = {
    [VERIFY_STATUS.DEFAULT]: {
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
            {isCountingDown && countdown > 0
              ? tAuth("verifyEmail.countdown", {
                  seconds: countdown,
                  text: tAuth("verifyEmail.resend"),
                })
              : tAuth("verifyEmail.resend")}
          </Button>
          <Button fullWidth href={signInHref} size="large" variant="outlined">
            {tAuth("verifyEmail.backToSignIn")}
          </Button>
          <Divider flexItem />
          <Stack alignItems="center" flexDirection="row" gap={0.5}>
            <Typography variant="body2">
              {tAuth("verifyEmail.wrongEmail")}
            </Typography>
            <Link href={signUpHref} underline="hover" variant="body2">
              {tAuth("signUp.label")}
            </Link>
          </Stack>
        </>
      ),
      color: "primary",
      icon: MarkEmailUnread,
      subtitle: tAuth("verifyEmail.confirmationText"),
      title: tAuth("verifyEmail.title"),
    },
    [VERIFY_STATUS.FAILED]: {
      actions: (
        <Button fullWidth href={signInHref} size="large" variant="contained">
          {tAuth("verifyEmail.backToSignIn")}
        </Button>
      ),
      color: "error",
      icon: ReportGmailerrorred,
      subtitle: errorMessage,
      title: tAuth("verifyEmail.failedTitle"),
    },
    [VERIFY_STATUS.VERIFIED]: {
      actions: (
        <Button fullWidth href={signInHref} size="large" variant="contained">
          {tAuth("verifyEmail.backToSignIn")}
        </Button>
      ),
      color: "primary",
      icon: MarkEmailRead,
      subtitle: tAuth("verifyEmail.signInText"),
      title: tAuth("verifyEmail.verifiedTitle"),
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <FormCard component="form" onSubmit={onSubmit}>
      <StyledCardHeader
        title={
          <Typography
            color={config.color}
            fontWeight="bold"
            textAlign="center"
            variant="h6"
          >
            {config.title}
          </Typography>
        }
      />
      <StyledCardContent>
        <StyledAvatar color={config.color}>
          <Icon fontSize="large" />
        </StyledAvatar>
        <Stack alignItems="center" spacing={1}>
          <Typography textAlign="center">{email}</Typography>
          <Typography
            color="text.secondary"
            textAlign="center"
            variant="caption"
          >
            {config.subtitle}
          </Typography>
        </Stack>
      </StyledCardContent>
      <StyledCardActions disableSpacing>{config.actions}</StyledCardActions>
    </FormCard>
  );
};

export default AuthVerifyEmail;
