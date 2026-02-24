// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-in-page/
// https://mui.com/store/sign-in/

"use client";

import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import * as z from "zod";

import { createSigninFormSchema } from "./definitions";

import FormCard from "@/components/FormCard";
import GoogleButton from "@/components/GoogleButton";

import { query } from "@/constants/query";
import { REMEMBER_ME } from "@/constants/sign-in";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

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
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useAuthStore } from "@/providers/auth-store-provider";

import type { AuthResponseDto } from "@/types/auth/auth-response.dto";
import type { LoginDto } from "@/types/auth/login.dto";
import type { UserResponseDto } from "@/types/users/user-response.dto";

import { fetchProfile } from "@/utils/auth";
import { FetchError, sendRequest } from "@/utils/fetcher";

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
  locale: Locale;
  redirectTo?: string;
  rememberMe: boolean;
}

const AuthSignIn = ({ locale, redirectTo, rememberMe }: AuthSignInProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const { clearAuth, setAccessToken, setIsAuthLoading, setProfile } =
    useAuthStore((state) => state);

  const tAuth = useTranslations("auth");
  const tValidation = useTranslations("validation");
  const signinFormSchema = createSigninFormSchema(tValidation);

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
    { identifier: string; redirectTo?: string }
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

      enqueueSnackbar(tAuth("signIn.success"), { variant: "success" });
      router.replace(redirectTo || "/");
    } catch (err) {
      const error = err as FetchError;
      if (error.status === 403 && error.info?.id) {
        const identifier = error.info.id;

        await triggerResend({
          identifier,
          ...(redirectTo && { redirectTo }),
        });

        router.replace({
          pathname: "/auth/verify-email",
          query: {
            [query.email]: data.email,
            [query.redirectTo]: redirectTo,
          },
        });

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
            {tAuth("signIn.label")}
          </Typography>
        }
      />
      <StyledCardContent>
        <GoogleButton action="signIn" locale={locale} redirectTo={redirectTo} />
        <Divider flexItem>{tAuth("or")}</Divider>
        <TextField
          autoComplete="email"
          error={!!errors.email}
          fullWidth
          helperText={errors.email?.message}
          label={tAuth("email.label")}
          placeholder={tAuth("email.placeholder")}
          required
          type="email"
          {...register("email")}
        />
        <TextField
          autoComplete="current-password"
          error={!!errors.password}
          fullWidth
          helperText={errors.password?.message}
          label={tAuth("password.label")}
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label={
                      showPassword
                        ? tAuth("hidePassword")
                        : tAuth("showPassword")
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
          placeholder={tAuth("password.placeholder")}
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
              <Typography variant="body2">{tAuth("rememberMe")}</Typography>
            }
          />
          <Link
            href={{
              pathname: "/auth/forgot-password",
              query: { [query.redirectTo]: redirectTo },
            }}
            underline="hover"
            variant="body2"
          >
            {tAuth("forgotPassword.label")}
          </Link>
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
          {tAuth("signIn.label")}
        </Button>
        <Divider flexItem />
        <Stack flexDirection="row" alignItems="center" gap={0.5}>
          <Typography variant="body2">{tAuth("noAccount")}</Typography>
          <Link
            href={{
              pathname: "/auth/sign-up",
              query: { [query.redirectTo]: redirectTo },
            }}
            underline="hover"
            variant="body2"
          >
            {tAuth("signUp.label")}
          </Link>
        </Stack>
      </StyledCardActions>
    </FormCard>
  );
};

export default AuthSignIn;
