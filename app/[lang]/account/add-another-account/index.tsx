// vibe coding 未來要修正

"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";

import type { Locale } from "@/app/[lang]/dictionaries";

import FormCard from "@/components/FormCard";

import { useLogout } from "@/hooks/useLogout";

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
import { useI18nStore } from "@/providers/i18n-store-provider";

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
  lang: Locale;
  redirectTo?: string;
}

const AddAnotherAccount = ({ lang, redirectTo }: AddAnotherAccountProps) => {
  const { isAuthLoading, isSignedIn, profile } = useAuthStore((state) => state);
  const { dict } = useI18nStore((state) => state);
  const { handleLogout, isMutatingLogout } = useLogout();
  const router = useRouter();

  const safeRedirectTo =
    redirectTo && redirectTo !== `/${lang}/account/add-another-account`
      ? redirectTo
      : `/${lang}/account/my-account`;

  const signInHref = handleQueryParam(`/${lang}/auth/sign-in`, {
    [QueryParamKey.RedirectTo]: safeRedirectTo,
  });

  const handleCancel = () => router.push(`/${lang}/account/my-account`);

  const handleSignOutAndContinue = async () => {
    await handleLogout();
    router.push(signInHref);
  };

  const name = getDisplayName(lang, profile);
  const avatarText = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <FormCard>
      <StyledCardHeader
        title={
          <Stack gap={0.5} textAlign="center">
            <Typography color="primary" fontWeight="bold" variant="h6">
              {dict.account.addAnotherAccount.title}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {dict.account.addAnotherAccount.subtitle}
            </Typography>
          </Stack>
        }
      />
      <StyledCardContent>
        {isAuthLoading && <LinearProgress />}
        {!isAuthLoading && isSignedIn && profile ? (
          <>
            <Typography color="text.secondary" variant="body2">
              {dict.account.addAnotherAccount.signedInNotice}
            </Typography>
            <Divider />
            <Stack alignItems="center" direction="row" gap={2}>
              <Avatar alt={name} src={profile.image || undefined}>
                {avatarText}
              </Avatar>
              <Stack>
                <Typography variant="body2" color="text.secondary">
                  {dict.account.addAnotherAccount.currentAccount}
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
              {dict.account.addAnotherAccount.signedOutNotice}
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
              {dict.account.addAnotherAccount.actions.signOutContinue}
            </Button>
            <Button fullWidth onClick={handleCancel} variant="text">
              {dict.account.addAnotherAccount.actions.cancel}
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
              {dict.account.addAnotherAccount.actions.goToSignIn}
            </Button>
            <Button fullWidth onClick={handleCancel} variant="text">
              {dict.account.addAnotherAccount.actions.cancel}
            </Button>
          </>
        )}
      </StyledCardActions>
    </FormCard>
  );
};

export default AddAnotherAccount;
