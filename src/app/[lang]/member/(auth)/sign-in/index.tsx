// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-in-page/
// https://mui.com/store/sign-in/

"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import React, { startTransition, useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";

import GoogleButton from "@/components/GoogleButton";

import { REMEMBER_ME } from "@/constants/sign-in";

import { useI18n } from "@/context/i18n";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useAuthStore } from "@/stores/useAuthStore";

import type { AuthResponseDto } from "@/types/auth/auth-response.dto";
import type { LoginDto } from "@/types/auth/login.dto";
import type { UserResponseDto } from "@/types/users/user-response.dto";

import { fetcher, sendRequest } from "@/utils/fetcher";

import FormCard from "../FormCard";

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
  gap: theme.spacing(2),
}));

interface MemberAuthSignInProps {
  lang: string;
  redirect?: string | string[];
}

const MemberAuthSignIn = ({ lang, redirect }: MemberAuthSignInProps) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const redirectParam =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;
  const handleRedirectParams = (path: string) =>
    redirectParam
      ? `${path}?redirect=${encodeURIComponent(redirectParam)}`
      : path;

  const { clearAuth, setAccessToken, setProfile } = useAuthStore();

  const router = useRouter();

  const dict = useI18n();

  const { isMutating: isMutatingAccessToken, trigger: triggerAccessToken } =
    useSWRMutation<AuthResponseDto, Error, string, LoginDto>(
      "/api/auth/login",
      sendRequest({
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }),
    );

  const { isMutating: isMutatingProfile, trigger: triggerProfile } =
    useSWRMutation<UserResponseDto, Error, string, string>(
      "/api/auth/profile",
      (url, { arg: accessToken }) =>
        fetcher<UserResponseDto>(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }),
    );

  const isSubmitting = isMutatingAccessToken || isMutatingProfile;

  useEffect(() => {
    const stored = localStorage.getItem(REMEMBER_ME);
    const nextValue = stored === null ? true : stored === "true";

    if (stored === null) localStorage.setItem(REMEMBER_ME, "true");

    startTransition(() => {
      setForm((prev) =>
        prev.rememberMe === nextValue
          ? prev
          : { ...prev, rememberMe: nextValue },
      );
    });
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => event.preventDefault();

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  const handleChange = ({
    target: { checked, name, type, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = type === "checkbox" ? checked : value;

    setForm((prev) => {
      if (name === "rememberMe" && type === "checkbox")
        localStorage.setItem(REMEMBER_ME, String(nextValue));

      return { ...prev, [name]: nextValue };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { access_token } = await triggerAccessToken(form);
      setAccessToken(access_token);

      const profile = await triggerProfile(access_token);
      setProfile(profile);

      // 這裡好像應該要用 replace？等 access token 完成後，可以到用戶頁面時，再來確認實際效果
      router.push(redirectParam || `/${lang}`);
    } catch (error) {
      clearAuth();
    }
  };

  return (
    <FormCard component="form" onSubmit={handleSubmit}>
      <StyledCardHeader
        title={
          <Typography
            color="primary"
            fontWeight="bold"
            textAlign="center"
            variant="h6"
          >
            {dict.member.auth.signIn.label}
          </Typography>
        }
      />
      <StyledCardContent>
        <GoogleButton action="signIn" href="" />
        <Divider>{dict.member.auth.or}</Divider>
        <TextField
          autoComplete="username"
          // error={!!state?.errors?.email}
          fullWidth
          // helperText={state?.errors?.email}
          label={dict.member.auth.email}
          name="email"
          onChange={handleChange}
          required
          type="email"
          value={form.email}
        />
        <TextField
          autoComplete="current-password"
          // error={!!state?.errors?.password}
          fullWidth
          // 這邊可能會需要修正
          // helperText={
          //   state?.errors?.password?.length
          //     ? `Password must: ${state.errors.password.join(", ")}`
          //     : ""
          // }
          label={dict.member.auth.password}
          name="password"
          onChange={handleChange}
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label={
                      showPassword
                        ? dict.member.auth.hidePassword
                        : dict.member.auth.showPassword
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          type={showPassword ? "text" : "password"}
          value={form.password}
        />
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={form.rememberMe}
                name="rememberMe"
                onChange={handleChange}
                size="small"
              />
            }
            label={
              <Typography variant="body2">
                {dict.member.auth.rememberMe}
              </Typography>
            }
          />
          <MuiLink
            component={NextLink}
            href={handleRedirectParams(`/${lang}/member/forgot-password`)}
            variant="body2"
          >
            {dict.member.auth.forgotPassword.label}
          </MuiLink>
        </Stack>
      </StyledCardContent>
      <StyledCardActions disableSpacing>
        <Button
          disabled={isSubmitting}
          fullWidth
          loading={isSubmitting}
          size="large"
          type="submit"
          variant="contained"
        >
          {dict.member.auth.signIn.label}
        </Button>
        <Typography variant="body2">
          {dict.member.auth.noAccount}{" "}
          <MuiLink
            component={NextLink}
            href={handleRedirectParams(`/${lang}/member/sign-up`)}
          >
            {dict.member.auth.signUp.label}
          </MuiLink>
        </Typography>
      </StyledCardActions>
    </FormCard>
  );
};

export default MemberAuthSignIn;
