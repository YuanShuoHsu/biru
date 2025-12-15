// vibe coding 未來要修正

"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";

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

import { useAuthStore } from "@/stores/useAuthStore";

import type { LocaleCode } from "@/types/locale";

import { getDisplayName } from "@/utils/auth";

import FormCard from "../../(auth)/FormCard";

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
  lang: string;
  redirect?: string;
}

const AddAnotherAccount = ({ lang, redirect }: AddAnotherAccountProps) => {
  const dict = useI18n();
  const router = useRouter();

  const { isAuthLoading, isSignedIn, profile } = useAuthStore();
  const { handleLogout, isMutatingLogout } = useLogout();

  const langCode = lang as LocaleCode;

  const safeRedirect =
    redirect && redirect !== `/${langCode}/member/add-another-account`
      ? redirect
      : `/${langCode}/member/my-account`;

  const signInHref = `/${langCode}/member/sign-in?redirect=${encodeURIComponent(
    safeRedirect,
  )}`;

  const handleCancel = () => router.push(`/${langCode}/member/my-account`);

  const handleSignOutAndContinue = async () => {
    await handleLogout();
    router.push(signInHref);
  };

  const name = getDisplayName(langCode, profile);
  const avatarText = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <FormCard>
      <StyledCardHeader
        title={
          <Stack gap={0.5} textAlign="center">
            <Typography color="primary" fontWeight="bold" variant="h6">
              {dict.member.addAnotherAccount.title}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {dict.member.addAnotherAccount.subtitle}
            </Typography>
          </Stack>
        }
      />
      <StyledCardContent>
        {isAuthLoading && <LinearProgress />}
        {!isAuthLoading && isSignedIn && profile ? (
          <>
            <Typography color="text.secondary" variant="body2">
              {dict.member.addAnotherAccount.signedInNotice}
            </Typography>
            <Divider />
            <Stack alignItems="center" direction="row" gap={2}>
              <Avatar alt={name} src={profile.image}>
                {avatarText}
              </Avatar>
              <Stack>
                <Typography variant="body2" color="text.secondary">
                  {dict.member.addAnotherAccount.currentAccount}
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
              {dict.member.addAnotherAccount.signedOutNotice}
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
              {dict.member.addAnotherAccount.actions.signOutContinue}
            </Button>
            <Button fullWidth onClick={handleCancel} variant="text">
              {dict.member.addAnotherAccount.actions.cancel}
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
              {dict.member.addAnotherAccount.actions.goToSignIn}
            </Button>
            <Button fullWidth onClick={handleCancel} variant="text">
              {dict.member.addAnotherAccount.actions.cancel}
            </Button>
          </>
        )}
      </StyledCardActions>
    </FormCard>
  );
};

export default AddAnotherAccount;
