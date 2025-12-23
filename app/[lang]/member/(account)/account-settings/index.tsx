// vibe coding 未來要修正

"use client";

import NextLink from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";

import { REMEMBER_ME } from "@/constants/sign-in";

import { useI18n } from "@/context/i18n";

import {
  AccountCircle,
  CheckCircle,
  DeleteForever,
  ErrorOutline,
  Gavel,
  LockReset,
  Logout,
  MailOutline,
  Person,
  PhoneIphone,
  Policy,
  Security,
  Settings,
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

import { useLogout } from "@/hooks/useLogout";

import { useAuthStore } from "@/stores/useAuthStore";

import type { LocaleCode } from "@/types/locale";
import type { UserResponseDto } from "@/types/users/user-response.dto";

import { getDisplayName } from "@/utils/auth";
import { interpolate } from "@/utils/i18n";

interface SettingRowProps {
  icon: React.ElementType;
  label: string;
  status?: React.ReactNode;
  value: string;
}

const SettingRow = ({ icon: Icon, label, status, value }: SettingRowProps) => (
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

interface AccountSettingsProps {
  lang: string;
  currentURL: string;
}

const AccountSettings = ({ lang, currentURL }: AccountSettingsProps) => {
  const [rememberMeByDefault, setRememberMeByDefault] = useState(true);

  const langCode = lang as LocaleCode;

  const { profile, isAuthLoading, isSignedIn } = useAuthStore();
  const dict = useI18n();
  const { handleLogout, isMutatingLogout } = useLogout();

  useEffect(() => {
    const stored = localStorage.getItem(REMEMBER_ME);
    const nextValue = stored === null ? true : stored === "true";

    if (stored === null) localStorage.setItem(REMEMBER_ME, "true");

    startTransition(() => {
      setRememberMeByDefault(nextValue);
    });
  }, []);

  const handleToggleRememberMe = () =>
    setRememberMeByDefault((prev) => {
      const next = !prev;
      localStorage.setItem(REMEMBER_ME, String(next));
      return next;
    });

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

  const memberSince = formatDate(profile?.createdAt);
  const updatedAt = formatDate(profile?.updatedAt);

  const name = useMemo(
    () =>
      getDisplayName(langCode, profile) || dict.member.profile.placeholderName,
    [dict.member.profile.placeholderName, langCode, profile],
  );

  const initial = name.charAt(0).toUpperCase();

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
              <Skeleton height={16} width="70%" />
              <Skeleton height={52} width="100%" />
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
        <CardHeader title={dict.member.accountSettings.title} />
        <CardContent>
          <Stack gap={2}>
            <Typography variant="h6">
              {dict.member.accountSettings.signInCta}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {dict.member.accountSettings.empty}
            </Typography>
            <Button
              component={NextLink}
              href={`/${langCode}/member/sign-in?redirect=${encodeURIComponent(currentURL)}`}
              startIcon={<Settings />}
              variant="contained"
            >
              {dict.member.auth.signIn.label}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const verifyEmailHref = `/${langCode}/member/verify-email?email=${encodeURIComponent(
    profile.email,
  )}&redirect=${encodeURIComponent(currentURL)}`;

  const forgotPasswordHref = `/${langCode}/member/forgot-password?redirect=${encodeURIComponent(
    currentURL,
  )}`;

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
                  {dict.member.accountSettings.title}
                </Typography>
                <Typography fontWeight={700} variant="h5">
                  {name}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {dict.member.accountSettings.subtitle}
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
                </Stack>
              </Stack>
            </Stack>
            <Stack
              alignItems="flex-end"
              gap={1}
              minWidth={{ xs: "100%", md: 260 }}
            >
              <Stack
                direction="row"
                flexWrap="wrap"
                gap={1}
                justifyContent="flex-end"
              >
                {verificationChip(profile.emailVerified)}
                {verificationChip(profile.phoneVerified)}
                <Chip
                  color="default"
                  label={formatRole(profile.role)}
                  size="small"
                  variant="outlined"
                />
              </Stack>
              {!profile.emailVerified && (
                <Button
                  component={NextLink}
                  href={verifyEmailHref}
                  size="small"
                  startIcon={<Security />}
                  variant="outlined"
                >
                  {dict.member.auth.verifyEmail.resend}
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Grid columnSpacing={2} container rowSpacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack gap={2}>
            <Card>
              <CardHeader
                title={dict.member.accountSettings.sections.account}
              />
              <CardContent>
                <Stack gap={2}>
                  <SettingRow
                    icon={Person}
                    label={dict.member.accountSettings.fields.name}
                    value={name}
                  />
                  <Divider flexItem />
                  <SettingRow
                    icon={MailOutline}
                    label={dict.member.auth.email.label}
                    status={verificationChip(profile.emailVerified)}
                    value={profile.email || dict.common.empty}
                  />
                  <Divider flexItem />
                  <SettingRow
                    icon={PhoneIphone}
                    label={dict.member.auth.phone}
                    status={verificationChip(profile.phoneVerified)}
                    value={profile.phone || dict.common.empty}
                  />
                </Stack>

                <Stack
                  direction="row"
                  flexWrap="wrap"
                  gap={1}
                  justifyContent="flex-end"
                  mt={2}
                >
                  <Chip
                    color="default"
                    icon={<Security fontSize="small" />}
                    label={formatRole(profile.role)}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Button
                  component={NextLink}
                  href={`/${langCode}/member/profile`}
                  startIcon={<AccountCircle />}
                  variant="outlined"
                >
                  {dict.member.accountSettings.actions.viewProfile}
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                title={dict.member.accountSettings.sections.security}
              />
              <CardContent>
                <Stack gap={1.5}>
                  <Button
                    component={NextLink}
                    href={forgotPasswordHref}
                    startIcon={<LockReset />}
                    variant="outlined"
                  >
                    {dict.member.auth.forgotPassword.label}
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
                <Typography color="text.secondary" mt={2} variant="caption">
                  {dict.member.accountSettings.securityNotice}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack gap={2}>
            <Card>
              <CardHeader title={dict.member.accountSettings.sections.device} />
              <CardContent>
                <Stack
                  alignItems="center"
                  direction="row"
                  justifyContent="space-between"
                  gap={2}
                >
                  <Stack minWidth={0}>
                    <Typography fontWeight={600} variant="body2">
                      {dict.member.accountSettings.rememberMe.label}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      {dict.member.accountSettings.rememberMe.helper}
                    </Typography>
                  </Stack>
                  <Switch
                    checked={rememberMeByDefault}
                    color="primary"
                    inputProps={{
                      "aria-label":
                        dict.member.accountSettings.rememberMe.label,
                    }}
                    onChange={handleToggleRememberMe}
                    size="small"
                  />
                </Stack>
                <Typography color="text.secondary" mt={2} variant="caption">
                  {dict.member.accountSettings.deviceNotice}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                title={dict.member.accountSettings.sections.support}
              />
              <CardContent>
                <Stack gap={1.5}>
                  <Button
                    component={NextLink}
                    href={`/${langCode}/member/terms`}
                    startIcon={<Gavel />}
                    variant="outlined"
                  >
                    {dict.member.accountSettings.actions.terms}
                  </Button>
                  <Button
                    component={NextLink}
                    href={`/${langCode}/member/privacy`}
                    startIcon={<Policy />}
                    variant="outlined"
                  >
                    {dict.member.accountSettings.actions.privacy}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardHeader title={dict.member.accountSettings.sections.danger} />
              <CardContent>
                <Stack gap={1}>
                  <Typography fontWeight={600} variant="body2">
                    {dict.member.accountSettings.danger.title}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {dict.member.accountSettings.danger.subtitle}
                  </Typography>
                  <Button
                    color="error"
                    disabled
                    startIcon={<DeleteForever />}
                    variant="outlined"
                  >
                    {dict.member.accountSettings.danger.action}
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

export default AccountSettings;
