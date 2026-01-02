"use client";

import NextLink from "next/link";
import { enqueueSnackbar } from "notistack";
import useSWRMutation from "swr/mutation";

import FormCard from "@/components/FormCard";

import { useI18n } from "@/context/i18n";

import {
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { sendRequest } from "@/utils/fetcher";
import { interpolate } from "@/utils/i18n";
import { handleQueryParam, QueryParamKey } from "@/utils/queryParams";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingBottom: 0,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
}));

interface AuthVerifyEmailProps {
  email?: string;
  lang: string;
  redirect?: string;
}

const AuthVerifyEmail = ({ email, lang, redirect }: AuthVerifyEmailProps) => {
  const dict = useI18n();

  const { isMutating: isMutatingResend, trigger: triggerResend } =
    useSWRMutation<unknown, Error, string, { email: string }>(
      "/api/auth/resend-verification",
      sendRequest({
        credentials: "include",
      }),
    );

  const handleResend = async () => {
    if (!email) {
      enqueueSnackbar(dict.auth.verifyEmail.enterEmail, {
        variant: "warning",
      });
      return;
    }

    try {
      await triggerResend({ email });
      enqueueSnackbar(dict.auth.verifyEmail.resendSuccess, {
        variant: "success",
      });
    } catch {
      return;
    }
  };

  return (
    <FormCard>
      <StyledCardHeader
        title={
          <Typography
            color="primary"
            fontWeight="bold"
            textAlign="center"
            variant="h6"
          >
            {dict.auth.verifyEmail.title}
          </Typography>
        }
      />
      <StyledCardContent>
        <Typography textAlign="center">
          {interpolate(dict.auth.verifyEmail.subtitle, {
            email,
          })}
        </Typography>
        <Typography color="text.secondary" textAlign="center" variant="body2">
          {dict.auth.verifyEmail.checkSpam}
        </Typography>
      </StyledCardContent>
      <StyledCardActions disableSpacing>
        <Button
          disabled={isMutatingResend || !email}
          fullWidth
          onClick={handleResend}
          size="large"
          variant="contained"
        >
          {dict.auth.verifyEmail.resend}
        </Button>
        <Button
          component={NextLink}
          fullWidth
          href={handleQueryParam(`/${lang}/auth/sign-in`, {
            [QueryParamKey.Redirect]: redirect,
          })}
          size="large"
          variant="outlined"
        >
          {dict.auth.verifyEmail.backToSignIn}
        </Button>
        <Typography color="text.secondary" textAlign="center" variant="body2">
          <MuiLink
            component={NextLink}
            href={handleQueryParam(`/${lang}/auth/sign-up`, {
              [QueryParamKey.Redirect]: redirect,
            })}
          >
            {dict.auth.signUp.label}
          </MuiLink>
        </Typography>
      </StyledCardActions>
    </FormCard>
  );
};

export default AuthVerifyEmail;
