"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useState } from "react";

import FormCard, {
  StyledCardContent,
  StyledCardHeader,
  StyledStackedListItem,
  StyledListItemText,
} from "@/components/FormCard";

import { useLogout } from "@/hooks/useLogout";
import { useSession } from "@/hooks/useSession";

import { authClient } from "@/lib/auth-client";

import { Logout } from "@mui/icons-material";
import { Button, DialogContentText, Divider, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useDialogStore } from "@/providers/dialog-store-provider";

const StyledFormCard = styled(FormCard)(({ theme }) => ({
  borderColor: theme.vars.palette.error.main,
}));

const StyledTypography = styled(Typography)({
  fontWeight: "bold",
});

const Danger = () => {
  const [loading, setLoading] = useState(false);

  const session = useSession();
  const { setDialog } = useDialogStore((state) => state);

  const { handleLogoutDialog } = useLogout();

  const locale = useLocale();

  const { enqueueSnackbar } = useSnackbar();

  const tAuth = useTranslations("auth");

  const handleDeleteConfirm = async () => {
    await authClient.deleteUser({
      callbackURL: `${process.env.NEXT_PUBLIC_NEXT_URL}/${locale}/auth/sign-in`,
      fetchOptions: {
        onRequest: () => setLoading(true),
        onError: ({ error: { message } }) => {
          setLoading(false);

          enqueueSnackbar(message, { variant: "error" });
        },
        onSuccess: () => {
          setLoading(false);

          enqueueSnackbar(tAuth("settings.danger.success"), {
            variant: "success",
          });
        },
      },
    });
  };

  const handleDeleteDialog = () =>
    setDialog({
      content: (
        <DialogContentText>
          {tAuth.rich("settings.danger.confirmContentText", {
            bold: (chunks) => <strong>{chunks}</strong>,
            email: session?.user.email || "",
          })}
        </DialogContentText>
      ),
      onConfirm: handleDeleteConfirm,
      open: true,
      title: tAuth("settings.danger.title"),
    });

  return (
    <StyledFormCard variant="outlined">
      <StyledCardHeader
        subheader={tAuth("settings.danger.description")}
        title={
          <StyledTypography color="error" variant="h6">
            {tAuth("settings.danger.label")}
          </StyledTypography>
        }
      />
      <StyledCardContent>
        <StyledStackedListItem
          disablePadding
          secondaryAction={
            <Button
              color="error"
              onClick={handleLogoutDialog}
              size="small"
              startIcon={<Logout />}
              variant="outlined"
            >
              {tAuth("signOut.label")}
            </Button>
          }
        >
          <StyledListItemText
            primary={tAuth("signOut.label")}
            secondary={tAuth("settings.danger.signOutSubtitle")}
            slotProps={{ secondary: { variant: "caption" } }}
          />
        </StyledStackedListItem>
        <Divider flexItem />
        <StyledStackedListItem
          disablePadding
          secondaryAction={
            <Button
              color="error"
              loading={loading}
              onClick={handleDeleteDialog}
              size="small"
              variant="contained"
            >
              {tAuth("settings.danger.action")}
            </Button>
          }
        >
          <StyledListItemText
            primary={tAuth("settings.danger.title")}
            secondary={tAuth("settings.danger.subtitle")}
            slotProps={{ secondary: { variant: "caption" } }}
          />
        </StyledStackedListItem>
      </StyledCardContent>
    </StyledFormCard>
  );
};

export default Danger;
