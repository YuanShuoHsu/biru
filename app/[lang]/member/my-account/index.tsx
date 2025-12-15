// vibe coding 未來要修正

"use client";

import NextLink from "next/link";
import { useMemo } from "react";

import { useI18n } from "@/context/i18n";

import {
  CheckCircle,
  ErrorOutline,
  Gavel,
  LockReset,
  Login,
  Logout,
  MailOutline,
  Person,
  PhoneIphone,
  Policy,
  Security,
  Settings,
  Style,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Skeleton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

import { useLogout } from "@/hooks/useLogout";

import { useAuthStore } from "@/stores/useAuthStore";

import type { LocaleCode } from "@/types/locale";
import type { UserResponseDto } from "@/types/users/user-response.dto";

import { getDisplayName } from "@/utils/auth";
import { interpolate } from "@/utils/i18n";

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  status?: React.ReactNode;
  value: string;
}

const InfoRow = ({ icon: Icon, label, status, value }: InfoRowProps) => (
  <Stack
    alignItems={{ xs: "flex-start", sm: "center" }}
    direction={{ xs: "column", sm: "row" }}
    gap={2}
  >
    <Box
      alignItems="center"
      bgcolor="action.hover"
      display="flex"
      height={44}
      justifyContent="center"
      sx={{ borderRadius: 2, aspectRatio: "1 / 1" }}
    >
      <Icon />
    </Box>
    <Stack flexGrow={1} gap={0.5} width="100%">
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
      <Stack
        alignItems={{ xs: "flex-start", sm: "center" }}
        direction={{ xs: "column", sm: "row" }}
        gap={1}
        justifyContent="space-between"
        width="100%"
      >
        <Typography fontWeight={600} variant="body1">
          {value}
        </Typography>
        {status}
      </Stack>
    </Stack>
  </Stack>
);

const formatRole = (role?: UserResponseDto["role"]) =>
  role ? role.charAt(0) + role.slice(1).toLowerCase() : "User";

interface MyAccountProps {
  lang: string;
  currentURL: string;
}

const MyAccount = ({ lang, currentURL }: MyAccountProps) => {
  const dict = useI18n();
  const { profile, isAuthLoading, isSignedIn } = useAuthStore();
  const { handleLogout, isMutatingLogout } = useLogout();

  const langCode = lang as LocaleCode;

  const { mode, setMode } = useColorScheme();
  const isModeLoading = !mode;
  const isDarkMode = mode === "dark";

  const formatDate = useMemo(
    () => (value?: string | null) => {
      if (!value) return null;
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return new Intl.DateTimeFormat(langCode, {
        dateStyle: "medium",
      }).format(date);
    },
    [langCode],
  );

  const verificationChip = (verified?: boolean) => (
    <Chip
      color={verified ? "success" : "warning"}
      icon={
        verified ? (
          <CheckCircle fontSize="small" />
        ) : (
          <ErrorOutline fontSize="small" />
        )
      }
      label={
        verified ? dict.member.profile.verified : dict.member.profile.unverified
      }
      size="small"
      variant={verified ? "filled" : "outlined"}
    />
  );

  if (isAuthLoading) {
    return (
      <Stack gap={3}>
        <LinearProgress />
        <Card>
          <CardContent>
            <Stack gap={2}>
              <Skeleton height={24} width="45%" />
              <Skeleton height={16} width="65%" />
              <Skeleton height={56} width="100%" />
            </Stack>
          </CardContent>
        </Card>
        <Grid columnSpacing={2} container rowSpacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent>
                <Stack gap={2}>
                  <Skeleton height={20} width="40%" />
                  <Skeleton height={56} width="100%" />
                  <Skeleton height={56} width="100%" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card>
              <CardContent>
                <Stack gap={2}>
                  <Skeleton height={20} width="55%" />
                  <Skeleton height={44} width="100%" />
                  <Skeleton height={44} width="100%" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    );
  }

  if (!isSignedIn || !profile) {
    return (
      <Card>
        <CardHeader title={dict.member.myAccount.title} />
        <CardContent>
          <Stack gap={2}>
            <Typography variant="h6">
              {dict.member.myAccount.signInCta}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {dict.member.myAccount.empty}
            </Typography>
            <Button
              component={NextLink}
              href={`/${langCode}/member/sign-in?redirect=${encodeURIComponent(currentURL)}`}
              startIcon={<Login />}
              variant="contained"
            >
              {dict.member.auth.signIn.label}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const memberSince = formatDate(profile.createdAt);
  const updatedAt = formatDate(profile.updatedAt);

  const name =
    getDisplayName(langCode, profile) || dict.member.profile.placeholderName;
  const initial = name.charAt(0).toUpperCase();

  const verifyEmailHref = `/${langCode}/member/verify-email?email=${encodeURIComponent(
    profile.email,
  )}&redirect=${encodeURIComponent(currentURL)}`;

  const forgotPasswordHref = `/${langCode}/member/forgot-password?redirect=${encodeURIComponent(
    currentURL,
  )}`;

  const settingsHref = `/${langCode}/member/account-settings`;
  const profileHref = `/${langCode}/member/profile`;

  const handleToggleColorMode = () => {
    if (isModeLoading) return;
    setMode(isDarkMode ? "light" : "dark");
  };

  return (
    <Stack gap={3}>
      <Card
        sx={(theme) => ({
          overflow: "hidden",
          position: "relative",
          border: `1px solid ${theme.vars.palette.divider}`,
        })}
      >
        <Box
          sx={(theme) => ({
            position: "absolute",
            inset: 0,
            background: `linear-gradient(120deg, rgba(${theme.vars.palette.primary.mainChannel} / 0.12), rgba(${theme.vars.palette.secondary.mainChannel ?? theme.vars.palette.primary.mainChannel} / 0.16))`,
            filter: "blur(12px)",
            transform: "scale(1.05)",
          })}
        />
        <CardContent sx={{ position: "relative" }}>
          <Stack
            alignItems="flex-start"
            direction={{ xs: "column", md: "row" }}
            gap={3}
            justifyContent="space-between"
          >
            <Stack alignItems="center" direction="row" gap={2}>
              <Avatar
                alt={name}
                src={profile.image}
                sx={(theme) => ({
                  width: theme.spacing(7),
                  height: theme.spacing(7),
                  border: `2px solid ${theme.vars.palette.primary.main}`,
                  bgcolor: theme.vars.palette.background.paper,
                  color: theme.vars.palette.primary.main,
                })}
              >
                {initial}
              </Avatar>
              <Stack gap={0.5}>
                <Typography color="primary" fontWeight={700} variant="overline">
                  {dict.member.myAccount.title}
                </Typography>
                <Typography fontWeight={700} variant="h5">
                  {name}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {dict.member.myAccount.subtitle}
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {memberSince && (
                    <Chip
                      color="primary"
                      label={interpolate(dict.member.profile.memberSince, {
                        date: memberSince,
                      })}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {updatedAt && (
                    <Chip
                      color="default"
                      label={interpolate(dict.member.profile.lastUpdated, {
                        date: updatedAt,
                      })}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  <Chip
                    color="default"
                    label={formatRole(profile.role)}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Stack>
            </Stack>

            <Stack
              alignItems="flex-end"
              gap={1}
              minWidth={{ xs: "100%", md: 320 }}
            >
              <Stack
                direction="row"
                flexWrap="wrap"
                gap={1}
                justifyContent="flex-end"
              >
                {verificationChip(profile.emailVerified)}
                {verificationChip(profile.phoneVerified)}
              </Stack>
              <Stack
                direction="row"
                flexWrap="wrap"
                gap={1}
                justifyContent="flex-end"
              >
                <Button
                  component={NextLink}
                  href={settingsHref}
                  size="small"
                  startIcon={<Settings />}
                  variant="contained"
                >
                  {dict.member.accountSettings.label}
                </Button>
                <Button
                  component={NextLink}
                  href={profileHref}
                  size="small"
                  startIcon={<Person />}
                  variant="outlined"
                >
                  {dict.member.accountMenu.profile}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid columnSpacing={2} container rowSpacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack gap={2}>
            <Card>
              <CardHeader title={dict.member.myAccount.sections.overview} />
              <CardContent>
                <Stack gap={2}>
                  <InfoRow
                    icon={MailOutline}
                    label={dict.member.auth.email}
                    status={verificationChip(profile.emailVerified)}
                    value={profile.email || dict.common.empty}
                  />
                  <Divider flexItem />
                  <InfoRow
                    icon={PhoneIphone}
                    label={dict.member.auth.phone}
                    status={verificationChip(profile.phoneVerified)}
                    value={profile.phone || dict.common.empty}
                  />
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title={dict.member.myAccount.sections.security} />
              <CardContent>
                <Stack gap={1.5}>
                  {!profile.emailVerified && (
                    <Button
                      component={NextLink}
                      href={verifyEmailHref}
                      startIcon={<Security />}
                      variant="outlined"
                    >
                      {dict.member.myAccount.actions.verifyEmail}
                    </Button>
                  )}
                  <Button
                    component={NextLink}
                    href={forgotPasswordHref}
                    startIcon={<LockReset />}
                    variant="outlined"
                  >
                    {dict.member.myAccount.actions.resetPassword}
                  </Button>
                  <Button
                    color="error"
                    disabled={isMutatingLogout}
                    loading={isMutatingLogout}
                    onClick={handleLogout}
                    startIcon={<Logout />}
                    variant="contained"
                  >
                    {dict.member.auth.signOut.label}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack gap={2}>
            <Card>
              <CardHeader title={dict.member.myAccount.sections.quickActions} />
              <CardContent>
                <Stack gap={1.5}>
                  <Button
                    component={NextLink}
                    href={profileHref}
                    startIcon={<Person />}
                    variant="outlined"
                  >
                    {dict.member.myAccount.actions.profile}
                  </Button>
                  <Button
                    component={NextLink}
                    href={settingsHref}
                    startIcon={<Settings />}
                    variant="outlined"
                  >
                    {dict.member.myAccount.actions.settings}
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title={dict.member.myAccount.sections.appearance} />
              <CardContent>
                <Stack
                  alignItems="center"
                  direction="row"
                  justifyContent="space-between"
                  gap={2}
                >
                  <Stack minWidth={0}>
                    <Typography fontWeight={600} variant="body2">
                      {dict.member.myAccount.colorMode.label}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      {dict.member.myAccount.colorMode.helper}
                    </Typography>
                  </Stack>
                  <Stack alignItems="center" direction="row" gap={1}>
                    <Style fontSize="small" />
                    <Switch
                      checked={isDarkMode}
                      color="primary"
                      disabled={isModeLoading}
                      inputProps={{
                        "aria-label": dict.member.myAccount.colorMode.label,
                      }}
                      onChange={handleToggleColorMode}
                      size="small"
                    />
                  </Stack>
                </Stack>
                <Typography color="text.secondary" mt={1} variant="caption">
                  {isModeLoading
                    ? dict.common.loading
                    : isDarkMode
                      ? dict.appBar.darkMode
                      : dict.appBar.lightMode}
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title={dict.member.myAccount.sections.support} />
              <CardContent>
                <Stack gap={1.5}>
                  <Button
                    component={NextLink}
                    href={`/${langCode}/member/terms`}
                    startIcon={<Gavel />}
                    variant="outlined"
                  >
                    {dict.member.myAccount.actions.terms}
                  </Button>
                  <Button
                    component={NextLink}
                    href={`/${langCode}/member/privacy`}
                    startIcon={<Policy />}
                    variant="outlined"
                  >
                    {dict.member.myAccount.actions.privacy}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default MyAccount;
