// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-in-page/
// https://mui.com/store/sign-in/

"use client";

import { useLocale, useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { type BaseSyntheticEvent, useCallback } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useForgotPasswordFormSchema } from "./definitions";

import FormCard from "@/components/FormCard";

import { query } from "@/constants/query";

import { zodResolver } from "@hookform/resolvers/zod";

import { authClient, getErrorMessage } from "@/lib/auth-client";

import {
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useCountdownStore } from "@/providers/countdown-store-provider";

import { getHref } from "@/utils/href";

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

interface AuthForgotPasswordProps {
  redirectTo?: string;
}

const AuthForgotPassword = ({ redirectTo }: AuthForgotPasswordProps) => {
  const { items, startCountdown } = useCountdownStore((state) => state);
  const countdown = items["forgot-password"];
  const isCountingDown = countdown > 0;

  const forgotPasswordFormSchema = useForgotPasswordFormSchema();
  type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<ForgotPasswordFormData>({
    defaultValues: { email: "" },
    resolver: zodResolver(forgotPasswordFormSchema),
  });

  const locale = useLocale();

  const tAuth = useTranslations("auth");
  const sendPasswordResetLink = tAuth("sendPasswordResetLink");

  const signInHref = getHref("/auth/sign-in", {
    [query.redirectTo]: redirectTo,
  });

  const onSubmitHandler = useCallback(
    async ({ email }: ForgotPasswordFormData) => {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo,
        fetchOptions: {
          headers: { "Accept-Language": locale },
        },
      });

      if (error?.code) {
        enqueueSnackbar(getErrorMessage(error.code, locale), {
          variant: "error",
        });

        return;
      }

      startCountdown("forgot-password");
    },
    [locale, redirectTo, startCountdown],
  );

  const onSubmit = (event: BaseSyntheticEvent) =>
    handleSubmit(onSubmitHandler)(event);

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
            {tAuth("forgotPassword.label")}
          </Typography>
        }
      />
      <StyledCardContent>
        <TextField
          autoComplete="email"
          error={!!errors.email}
          fullWidth
          helperText={errors.email?.message}
          label={tAuth("email.label")}
          placeholder={tAuth("email.placeholder")}
          required
          type="email"
          {...register("email")}
        />
      </StyledCardContent>
      <StyledCardActions disableSpacing>
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
            ? tAuth("forgotPassword.countdown", {
                actions: sendPasswordResetLink,
                seconds: countdown,
              })
            : sendPasswordResetLink}
        </Button>
        <Stack flexDirection="row" alignItems="center" gap={0.5}>
          <Typography variant="body2">{tAuth("rememberedPassword")}</Typography>
          <Link href={signInHref} underline="hover" variant="body2">
            {tAuth("signIn.label")}
          </Link>
        </Stack>
      </StyledCardActions>
    </FormCard>
  );
};

export default AuthForgotPassword;
