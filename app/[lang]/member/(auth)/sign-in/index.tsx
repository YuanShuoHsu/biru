// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-in-page/
// https://mui.com/store/sign-in/

"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import React, { startTransition, useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";

import FormCard from "@/components/FormCard";
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

import { fetchProfile } from "@/utils/auth";
import { handleRedirectParams } from "@/utils/redirect";
import { sendRequest } from "@/utils/fetcher";

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
  redirect?: string;
}

const MemberAuthSignIn = ({ lang, redirect }: MemberAuthSignInProps) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const { clearAuth, setAccessToken, setIsAuthLoading, setProfile } =
    useAuthStore();

  const router = useRouter();

  const dict = useI18n();

  const { isMutating: isMutatingAccessToken, trigger: triggerAccessToken } =
    useSWRMutation<AuthResponseDto, Error, string, LoginDto>(
      "/api/auth/login",
      sendRequest({
        credentials: "include",
      }),
    );

  const { isMutating: isMutatingProfile, trigger: triggerProfile } =
    useSWRMutation<UserResponseDto, Error, string, string>(
      "/api/auth/profile",
      (_, { arg }) => fetchProfile(arg),
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

    setIsAuthLoading(true);

    try {
      const { access_token } = await triggerAccessToken(form);
      setAccessToken(access_token);

      const profile = await triggerProfile(access_token);
      setProfile(profile);

      router.replace(redirect || `/${lang}`);
    } catch {
      clearAuth();
    } finally {
      setIsAuthLoading(false);
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
          // helperText={state?.errors?.email}
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
            href={handleRedirectParams(`/${lang}/member/forgot-password`, redirect)}
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
            href={handleRedirectParams(`/${lang}/member/sign-up`, redirect)}
          >
            {dict.member.auth.signUp.label}
          </MuiLink>
        </Typography>
      </StyledCardActions>
    </FormCard>
  );
};

export default MemberAuthSignIn;
