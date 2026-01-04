// vibe coding 未來要修正

"use client";

import NextLink from "next/link";
import { useMemo } from "react";

import type { Locale } from "@/app/[lang]/dictionaries";

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

import { useAuthStore } from "@/providers/auth-store-provider";

import type { UserResponseDto } from "@/types/users/user-response.dto";

import { getDisplayName } from "@/utils/auth";
import { interpolate } from "@/utils/i18n";
import { handleQueryParam, QueryParamKey } from "@/utils/queryParams";

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
  lang: Locale;
  currentURL: string;
}

const MyAccount = ({ lang, currentURL }: MyAccountProps) => {
  const dict = useI18n();
  const { profile, isAuthLoading, isSignedIn } = useAuthStore((state) => state);
  const { handleLogout, isMutatingLogout } = useLogout();

  const { mode, setMode } = useColorScheme();
  const isModeLoading = !mode;
  const isDarkMode = mode === "dark";

  const formatDate = useMemo(
    () => (value?: string | null) => {
      if (!value) return null;
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return new Intl.DateTimeFormat(lang, {
        dateStyle: "medium",
      }).format(date);
    },
    [lang],
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
        verified
          ? dict.account.profile.verified
          : dict.account.profile.unverified
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
        <CardHeader title={dict.account.myAccount.title} />
        <CardContent>
          <Stack gap={2}>
            <Typography variant="h6">
              {dict.account.myAccount.signInCta}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {dict.account.myAccount.empty}
            </Typography>
            <Button
              component={NextLink}
              href={handleQueryParam(`/${lang}/auth/sign-in`, {
                [QueryParamKey.Redirect]: currentURL,
              })}
              startIcon={<Login />}
              variant="contained"
            >
              {dict.auth.signIn.label}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const memberSince = formatDate(profile.createdAt);
  const updatedAt = formatDate(profile.updatedAt);

  const name =
    getDisplayName(lang, profile) || dict.account.profile.placeholderName;
  const initial = name.charAt(0).toUpperCase();

  const verifyEmailHref = handleQueryParam(`/${lang}/auth/verify-email`, {
    [QueryParamKey.Email]: profile.email,
    [QueryParamKey.Redirect]: currentURL,
  });

  const forgotPasswordHref = handleQueryParam(`/${lang}/auth/forgot-password`, {
    [QueryParamKey.Redirect]: currentURL,
  });

  const settingsHref = `/${lang}/account/account-settings`;
  const profileHref = `/${lang}/account/profile`;

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
                  {dict.account.myAccount.title}
                </Typography>
                <Typography fontWeight={700} variant="h5">
                  {name}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {dict.account.myAccount.subtitle}
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {memberSince && (
                    <Chip
                      color="primary"
                      label={interpolate(dict.account.profile.memberSince, {
                        date: memberSince,
                      })}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {updatedAt && (
                    <Chip
                      color="default"
                      label={interpolate(dict.account.profile.lastUpdated, {
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
                  {dict.account.accountSettings.label}
                </Button>
                <Button
                  component={NextLink}
                  href={profileHref}
                  size="small"
                  startIcon={<Person />}
                  variant="outlined"
                >
                  {dict.account.accountMenu.profile}
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
              <CardHeader title={dict.account.myAccount.sections.overview} />
              <CardContent>
                <Stack gap={2}>
                  <InfoRow
                    icon={MailOutline}
                    label={dict.auth.email.label}
                    status={verificationChip(profile.emailVerified)}
                    value={profile.email || dict.common.empty}
                  />
                  <Divider flexItem />
                  <InfoRow
                    icon={PhoneIphone}
                    label={dict.auth.phone}
                    status={verificationChip(profile.phoneVerified)}
                    value={profile.phone || dict.common.empty}
                  />
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title={dict.account.myAccount.sections.security} />
              <CardContent>
                <Stack gap={1.5}>
                  {!profile.emailVerified && (
                    <Button
                      component={NextLink}
                      href={verifyEmailHref}
                      startIcon={<Security />}
                      variant="outlined"
                    >
                      {dict.account.myAccount.actions.verifyEmail}
                    </Button>
                  )}
                  <Button
                    component={NextLink}
                    href={forgotPasswordHref}
                    startIcon={<LockReset />}
                    variant="outlined"
                  >
                    {dict.account.myAccount.actions.resetPassword}
                  </Button>
                  <Button
                    color="error"
                    disabled={isMutatingLogout}
                    loading={isMutatingLogout}
                    onClick={handleLogout}
                    startIcon={<Logout />}
                    variant="contained"
                  >
                    {dict.auth.signOut.label}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack gap={2}>
            <Card>
              <CardHeader
                title={dict.account.myAccount.sections.quickActions}
              />
              <CardContent>
                <Stack gap={1.5}>
                  <Button
                    component={NextLink}
                    href={profileHref}
                    startIcon={<Person />}
                    variant="outlined"
                  >
                    {dict.account.myAccount.actions.profile}
                  </Button>
                  <Button
                    component={NextLink}
                    href={settingsHref}
                    startIcon={<Settings />}
                    variant="outlined"
                  >
                    {dict.account.myAccount.actions.settings}
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title={dict.account.myAccount.sections.appearance} />
              <CardContent>
                <Stack
                  alignItems="center"
                  direction="row"
                  justifyContent="space-between"
                  gap={2}
                >
                  <Stack minWidth={0}>
                    <Typography fontWeight={600} variant="body2">
                      {dict.account.myAccount.colorMode.label}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      {dict.account.myAccount.colorMode.helper}
                    </Typography>
                  </Stack>
                  <Stack alignItems="center" direction="row" gap={1}>
                    <Style fontSize="small" />
                    <Switch
                      checked={isDarkMode}
                      color="primary"
                      disabled={isModeLoading}
                      inputProps={{
                        "aria-label": dict.account.myAccount.colorMode.label,
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
              <CardHeader title={dict.account.myAccount.sections.support} />
              <CardContent>
                <Stack gap={1.5}>
                  <Button
                    component={NextLink}
                    href={`/${lang}/company/terms`}
                    startIcon={<Gavel />}
                    variant="outlined"
                  >
                    {dict.account.myAccount.actions.terms}
                  </Button>
                  <Button
                    component={NextLink}
                    href={`/${lang}/company/privacy`}
                    startIcon={<Policy />}
                    variant="outlined"
                  >
                    {dict.account.myAccount.actions.privacy}
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
