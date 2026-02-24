// vibe coding 未來要修正

"use client";

import { useLocale, useTranslations } from "next-intl";

import FormCard from "@/components/FormCard";

import { query } from "@/constants/query";

import { useLogout } from "@/hooks/useLogout";

import { useRouter } from "@/i18n/navigation";

import { Login, PersonAdd } from "@mui/icons-material";
import {
  Avatar,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useAuthStore } from "@/providers/auth-store-provider";

import { getDisplayName } from "@/utils/auth";
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
  gap: theme.spacing(1),
}));

interface AddAnotherAccountProps {
  redirectTo?: string;
}

const AddAnotherAccount = ({ redirectTo }: AddAnotherAccountProps) => {
  const { isAuthLoading, isSignedIn, profile } = useAuthStore((state) => state);
  const { handleLogout, isMutatingLogout } = useLogout();

  const locale = useLocale();
  const router = useRouter();

  const tAccount = useTranslations("account");

  const { href } = getHref("/auth/sign-in", {
    [query.redirectTo]: redirectTo,
  });

  const handleCancel = () => router.push("/account/my-account");

  const handleSignOutAndContinue = async () => {
    await handleLogout();
    router.push(href);
  };

  const name = getDisplayName(locale, profile);
  const avatarText = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <FormCard>
      <StyledCardHeader
        title={
          <Stack gap={0.5} textAlign="center">
            <Typography color="primary" fontWeight="bold" variant="h6">
              {tAccount("addAnotherAccount.title")}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {tAccount("addAnotherAccount.subtitle")}
            </Typography>
          </Stack>
        }
      />
      <StyledCardContent>
        {isAuthLoading && <LinearProgress />}
        {!isAuthLoading && isSignedIn && profile ? (
          <>
            <Typography color="text.secondary" variant="body2">
              {tAccount("addAnotherAccount.signedInNotice")}
            </Typography>
            <Divider />
            <Stack alignItems="center" direction="row" gap={2}>
              <Avatar alt={name} src={profile.image || undefined}>
                {avatarText}
              </Avatar>
              <Stack>
                <Typography variant="body2" color="text.secondary">
                  {tAccount("addAnotherAccount.currentAccount")}
                </Typography>
                <Typography fontWeight={600} variant="body1">
                  {name || profile.email || ""}
                </Typography>
              </Stack>
            </Stack>
          </>
        ) : (
          !isAuthLoading && (
            <Typography color="text.secondary" variant="body2">
              {tAccount("addAnotherAccount.signedOutNotice")}
            </Typography>
          )
        )}
      </StyledCardContent>
      <StyledCardActions disableSpacing>
        {!isAuthLoading && isSignedIn ? (
          <>
            <Button
              disabled={isMutatingLogout}
              fullWidth
              loading={isMutatingLogout}
              onClick={handleSignOutAndContinue}
              startIcon={<PersonAdd />}
              variant="contained"
            >
              {tAccount("addAnotherAccount.actions.signOutContinue")}
            </Button>
            <Button fullWidth onClick={handleCancel} variant="text">
              {tAccount("addAnotherAccount.actions.cancel")}
            </Button>
          </>
        ) : (
          <>
            <Button
              fullWidth
              href={href}
              startIcon={<Login />}
              variant="contained"
            >
              {tAccount("addAnotherAccount.actions.goToSignIn")}
            </Button>
            <Button fullWidth onClick={handleCancel} variant="text">
              {tAccount("addAnotherAccount.actions.cancel")}
            </Button>
          </>
        )}
      </StyledCardActions>
    </FormCard>
  );
};

export default AddAnotherAccount;
