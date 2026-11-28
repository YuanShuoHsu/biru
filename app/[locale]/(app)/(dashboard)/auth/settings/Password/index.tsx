"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useState } from "react";

import ChangePassword from "./ChangePassword";

import ErrorAlert from "@/components/ErrorAlert";
import FormCard, { StyledCardHeader } from "@/components/FormCard";

import useListAccounts from "@/hooks/useListAccounts";
import { useSession } from "@/hooks/useSession";

import { authClient } from "@/lib/auth-client";

import { Key, Mail } from "@mui/icons-material";
import { Button, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useDialogStore } from "@/providers/dialog-store-provider";

const StyledTypography = styled(Typography)({
  fontWeight: "bold",
});

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});

const Password = () => {
  const [loading, setLoading] = useState(false);

  const session = useSession();
  const { setDialog } = useDialogStore((state) => state);

  const { data: accounts, error, mutate } = useListAccounts();

  const locale = useLocale();

  const { enqueueSnackbar } = useSnackbar();

  const hasCredential = accounts?.some(
    ({ providerId }) => providerId === "credential",
  );

  const tAuth = useTranslations("auth");

  const handleChangePasswordDialog = () =>
    setDialog({
      confirmText: tAuth("settings.password.update"),
      content: <ChangePassword />,
      formId: "change-password-form",
      open: true,
      title: tAuth("settings.password.changeLabel"),
    });

  const handleSendResetLink = async () => {
    if (!session?.user.email) return;

    await authClient.requestPasswordReset(
      {
        email: session.user.email,
        redirectTo: `${process.env.NEXT_PUBLIC_NEXT_URL}/${locale}/auth/reset-password`,
      },
      {
        onError: ({ error: { message } }) => {
          setLoading(false);

          enqueueSnackbar(message, { variant: "error" });
        },
        onRequest: () => setLoading(true),
        onSuccess: () => {
          setLoading(false);

          enqueueSnackbar(tAuth("settings.password.sendResetLinkSuccess"), {
            variant: "success",
          });
        },
      },
    );
  };

  return (
    <FormCard>
      <StyledCardHeader
        avatar={<Key color="primary" />}
        subheader={
          hasCredential
            ? tAuth("settings.password.subtitle")
            : tAuth("settings.password.noPassword.subtitle")
        }
        title={
          <StyledTypography color="primary" variant="h6">
            {tAuth("settings.password.label")}
          </StyledTypography>
        }
      />
      <StyledCardContent>
        {error ? (
          <ErrorAlert onRetry={() => mutate()} />
        ) : hasCredential ? (
          <Button
            onClick={handleChangePasswordDialog}
            size="small"
            startIcon={<Key />}
            variant="outlined"
          >
            {tAuth("settings.password.changeLabel")}
          </Button>
        ) : (
          <Button
            loading={loading}
            loadingPosition="start"
            onClick={handleSendResetLink}
            size="small"
            startIcon={<Mail />}
            variant="outlined"
          >
            {tAuth("settings.password.sendResetLink")}
          </Button>
        )}
      </StyledCardContent>
    </FormCard>
  );
};

export default Password;
