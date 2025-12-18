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
import { handleRedirectParams } from "@/utils/redirect";

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

interface MemberAuthVerifyEmailProps {
  email?: string;
  lang: string;
  redirect?: string;
}

const MemberAuthVerifyEmail = ({
  email,
  lang,
  redirect,
}: MemberAuthVerifyEmailProps) => {
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
      enqueueSnackbar(dict.member.auth.verifyEmail.enterEmail, {
        variant: "warning",
      });
      return;
    }

    try {
      await triggerResend({ email });
      enqueueSnackbar(dict.member.auth.verifyEmail.resendSuccess, {
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
            {dict.member.auth.verifyEmail.title}
          </Typography>
        }
      />
      <StyledCardContent>
        <Typography textAlign="center">
          {interpolate(dict.member.auth.verifyEmail.subtitle, {
            email,
          })}
        </Typography>
        <Typography color="text.secondary" textAlign="center" variant="body2">
          {dict.member.auth.verifyEmail.checkSpam}
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
          {dict.member.auth.verifyEmail.resend}
        </Button>
        <Button
          component={NextLink}
          fullWidth
          href={handleRedirectParams(`/${lang}/member/sign-in`, redirect)}
          size="large"
          variant="outlined"
        >
          {dict.member.auth.verifyEmail.backToSignIn}
        </Button>
        <Typography color="text.secondary" textAlign="center" variant="body2">
          <MuiLink
            component={NextLink}
            href={handleRedirectParams(`/${lang}/member/sign-up`, redirect)}
          >
            {dict.member.auth.signUp.label}
          </MuiLink>
        </Typography>
      </StyledCardActions>
    </FormCard>
  );
};

export default MemberAuthVerifyEmail;
