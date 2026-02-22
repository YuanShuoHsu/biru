// vibe coding 未來要修正

"use client";

import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import FormCard from "@/components/FormCard";

import { useLogout } from "@/hooks/useLogout";

import type { Locale } from "@/i18n/routing";

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
  gap: theme.spacing(1),
}));

interface AddAnotherAccountProps {
  locale: Locale;
  redirectTo?: string;
}

const AddAnotherAccount = ({ locale, redirectTo }: AddAnotherAccountProps) => {
  const { isAuthLoading, isSignedIn, profile } = useAuthStore((state) => state);
  const { handleLogout, isMutatingLogout } = useLogout();
  const router = useRouter();

  const tAccount = useTranslations("account");

  const safeRedirectTo =
    redirectTo && redirectTo !== `/${locale}/account/add-another-account`
      ? redirectTo
      : `/${locale}/account/my-account`;

  const signInHref = handleQueryParam(`/${locale}/auth/sign-in`, {
    [QueryParamKey.RedirectTo]: safeRedirectTo,
  });

  const handleCancel = () => router.push(`/${locale}/account/my-account`);

  const handleSignOutAndContinue = async () => {
    await handleLogout();
    router.push(signInHref);
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
              component={NextLink}
              fullWidth
              href={signInHref}
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
