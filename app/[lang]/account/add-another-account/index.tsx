// vibe coding 未來要修正

"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";

import type { Locale } from "@/app/[lang]/dictionaries";

import FormCard from "@/components/FormCard";

import { useI18n } from "@/context/i18n";

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
  redirect?: string;
}

const AddAnotherAccount = ({ lang, redirect }: AddAnotherAccountProps) => {
  const dict = useI18n();
  const router = useRouter();

  const { isAuthLoading, isSignedIn, profile } = useAuthStore((state) => state);
  const { handleLogout, isMutatingLogout } = useLogout();

  const safeRedirect =
    redirect && redirect !== `/${lang}/account/add-another-account`
      ? redirect
      : `/${lang}/account/my-account`;

  const signInHref = handleQueryParam(`/${lang}/auth/sign-in`, {
    [QueryParamKey.Redirect]: safeRedirect,
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
              <Avatar alt={name} src={profile.image}>
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
