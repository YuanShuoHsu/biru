// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-in-page/
// https://mui.com/store/sign-in/

"use client";

import Cookies from "js-cookie";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import * as z from "zod";

import { createSigninFormSchema } from "./definitions";

import type { Locale } from "@/app/[lang]/dictionaries";

import FormCard from "@/components/FormCard";
import GoogleButton from "@/components/GoogleButton";

import { zodResolver } from "@hookform/resolvers/zod";

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

import { useAuthStore } from "@/providers/auth-store-provider";
import { useI18nStore } from "@/providers/i18n-store-provider";

import type { AuthResponseDto } from "@/types/auth/auth-response.dto";
import type { LoginDto } from "@/types/auth/login.dto";
import type { UserResponseDto } from "@/types/users/user-response.dto";

import { REMEMBER_ME } from "@/constants/sign-in";
import { fetchProfile } from "@/utils/auth";
import { FetchError, sendRequest } from "@/utils/fetcher";
import { handleQueryParam, QueryParamKey } from "@/utils/queryParams";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingBottom: 0,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
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

interface AuthSignInProps {
  lang: Locale;
  redirect?: string;
  rememberMe: boolean;
}

const AuthSignIn = ({ lang, redirect, rememberMe }: AuthSignInProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const { clearAuth, setAccessToken, setIsAuthLoading, setProfile } =
    useAuthStore((state) => state);

  const { dict } = useI18nStore((state) => state);
  const signinFormSchema = createSigninFormSchema(dict);

  type SigninFormData = z.infer<typeof signinFormSchema>;

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SigninFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe,
    },
    resolver: zodResolver(signinFormSchema),
  });

  const router = useRouter();

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

  const { trigger: triggerResend } = useSWRMutation<
    void,
    Error,
    string,
    { identifier: string; redirect?: string }
  >(
    "/api/mails/resend",
    sendRequest({
      credentials: "include",
    }),
  );

  const isSubmitting = isMutatingAccessToken || isMutatingProfile;

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => event.preventDefault();
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  const handleRememberMeChange =
    (onChange: (value: boolean) => void) =>
    ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
      Cookies.set(REMEMBER_ME, String(checked), { expires: 365 });
      onChange(checked);
    };

  const onSubmit = handleSubmit(async (data) => {
    setIsAuthLoading(true);

    try {
      const { access_token } = await triggerAccessToken(data);
      setAccessToken(access_token);

      const profile = await triggerProfile(access_token);
      setProfile(profile);

      enqueueSnackbar(dict.auth.signIn.success, { variant: "success" });
      router.replace(redirect || `/${lang}`);
    } catch (err) {
      const error = err as FetchError;
      if (error.status === 403 && error.info?.id) {
        const identifier = error.info.id;

        await triggerResend({
          identifier,
          ...(redirect && { redirect }),
        });

        router.replace(
          handleQueryParam(`/${lang}/auth/verify-email`, {
            [QueryParamKey.Email]: data.email,
            [QueryParamKey.Identifier]: identifier,
            [QueryParamKey.Redirect]: redirect,
          }),
        );

        return;
      }

      clearAuth();
    } finally {
      setIsAuthLoading(false);
    }
  });

  return (
    <FormCard component="form" onSubmit={onSubmit}>
      <StyledCardHeader
        title={
          <Typography
            color="primary"
            fontWeight="bold"
            textAlign="center"
            variant="h6"
          >
            {dict.auth.signIn.label}
          </Typography>
        }
      />
      <StyledCardContent>
        <GoogleButton action="signIn" lang={lang} redirect={redirect} />
        <Divider flexItem>{dict.auth.or}</Divider>
        <TextField
          autoComplete="email"
          error={!!errors.email}
          fullWidth
          helperText={errors.email?.message}
          label={dict.auth.email.label}
          placeholder={dict.auth.email.placeholder}
          required
          type="email"
          {...register("email")}
        />
        <TextField
          autoComplete="current-password"
          error={!!errors.password}
          fullWidth
          helperText={errors.password?.message}
          label={dict.auth.password.label}
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label={
                      showPassword
                        ? dict.auth.hidePassword
                        : dict.auth.showPassword
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
          placeholder={dict.auth.password.placeholder}
          {...register("password")}
        />
        <Stack
          width="100%"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
        >
          <FormControlLabel
            control={
              <Controller
                control={control}
                name="rememberMe"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    checked={value}
                    onChange={handleRememberMeChange(onChange)}
                    size="small"
                  />
                )}
              />
            }
            label={
              <Typography variant="body2">{dict.auth.rememberMe}</Typography>
            }
          />
          <MuiLink
            component={NextLink}
            href={handleQueryParam(`/${lang}/auth/forgot-password`, {
              [QueryParamKey.Redirect]: redirect,
            })}
            underline="hover"
            variant="body2"
          >
            {dict.auth.forgotPassword.label}
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
          {dict.auth.signIn.label}
        </Button>
        <Divider flexItem />
        <Stack flexDirection="row" alignItems="center" gap={0.5}>
          <Typography variant="body2">{dict.auth.noAccount}</Typography>
          <MuiLink
            component={NextLink}
            href={handleQueryParam(`/${lang}/auth/sign-up`, {
              [QueryParamKey.Redirect]: redirect,
            })}
            underline="hover"
            variant="body2"
          >
            {dict.auth.signUp.label}
          </MuiLink>
        </Stack>
      </StyledCardActions>
    </FormCard>
  );
};

export default AuthSignIn;
