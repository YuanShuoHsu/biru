"use client";

import NextLink from "next/link";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

import { MarkEmailRead } from "@mui/icons-material";
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
import { styled } from "@mui/material/styles";

import type { Locale } from "@/app/[lang]/dictionaries";

import FormCard from "@/components/FormCard";
import { useI18nStore } from "@/providers/i18n-store-provider";

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
  alignItems: "center",
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
  lang: Locale;
  redirect?: string;
}

const AuthVerifyEmail = ({ email, lang, redirect }: AuthVerifyEmailProps) => {
  const { handleSubmit } = useForm();

  const { dict } = useI18nStore((state) => state);

  const { isMutating: isMutatingResend, trigger: triggerResend } =
    useSWRMutation<unknown, Error, string, { email: string }>(
      "/api/auth/resend-verification",
      sendRequest({
        credentials: "include",
      }),
    );

  const onSubmit = handleSubmit(async () => {
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
    } finally {
    }
  });

  return (
    <FormCard component="form" onSubmit={onSubmit}>
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
        <Avatar
          sx={{
            bgcolor: "primary.light",
            color: "primary.main",
            height: 64,
            width: 64,
          }}
        >
          <MarkEmailRead sx={{ fontSize: 32 }} />
        </Avatar>
        <Stack spacing={1} alignItems="center">
          <Typography textAlign="center">
            {interpolate(dict.auth.verifyEmail.subtitle, {
              email: email || "",
            })}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
          >
            {dict.auth.verifyEmail.checkSpam}
          </Typography>
        </Stack>
      </StyledCardContent>
      <StyledCardActions disableSpacing>
        <Button
          disabled={isMutatingResend || !email}
          fullWidth
          loading={isMutatingResend}
          loadingPosition="start"
          size="large"
          type="submit"
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
      </StyledCardActions>
    </FormCard>
  );
};

export default AuthVerifyEmail;
