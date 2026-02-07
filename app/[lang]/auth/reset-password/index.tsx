// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-in-page/
// https://mui.com/store/sign-in/

"use client";

import NextLink from "next/link";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

import type { Locale } from "@/app/[lang]/dictionaries";

import FormCard from "@/components/FormCard";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useI18nStore } from "@/providers/i18n-store-provider";

import { getErrorMessage } from "@/utils/errors";
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
  gap: theme.spacing(2),
}));

type ResetPasswordField = "newPassword" | "confirmNewPassword";

interface AuthResetPasswordProps {
  lang: Locale;
  redirectTo?: string;
}

const AuthResetPassword = ({ lang, redirectTo }: AuthResetPasswordProps) => {
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPassword, setShowPassword] = useState<
    Record<ResetPasswordField, boolean>
  >({
    newPassword: false,
    confirmNewPassword: false,
  });

  const { dict } = useI18nStore((state) => state);

  const handleClickShowPassword = (key: ResetPasswordField) => () =>
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => event.preventDefault();

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  const handleChange = ({
    target: { checked, name, type, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // const { data } = await trigger(form);
      // console.log(data);
      // router.push(`/${lang}/orders`);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
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
            {dict.auth.resetPassword.label}
          </Typography>
        }
      />
      <StyledCardContent>
        <TextField
          autoComplete="email"
          fullWidth
          label={dict.auth.email.label}
          name="email"
          onChange={handleChange}
          placeholder={dict.auth.email.placeholder}
          required
          type="email"
          value={form.email}
        />
        <TextField
          autoComplete="new-password"
          fullWidth
          label={dict.auth.newPassword}
          name="newPassword"
          onChange={handleChange}
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label={
                      showPassword.newPassword
                        ? dict.auth.hideNewPassword
                        : dict.auth.showNewPassword
                    }
                    onClick={handleClickShowPassword("newPassword")}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword.newPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          type={showPassword.newPassword ? "text" : "password"}
          value={form.newPassword}
        />
        <TextField
          autoComplete="new-password"
          fullWidth
          label={dict.auth.confirmNewPassword}
          name="confirmNewPassword"
          onChange={handleChange}
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label={
                      showPassword.confirmNewPassword
                        ? dict.auth.hideConfirmNewPassword
                        : dict.auth.showConfirmNewPassword
                    }
                    onClick={handleClickShowPassword("confirmNewPassword")}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword.confirmNewPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          type={showPassword.confirmNewPassword ? "text" : "password"}
          value={form.confirmNewPassword}
        />
      </StyledCardContent>
      <StyledCardActions disableSpacing>
        <Button fullWidth size="large" type="submit" variant="contained">
          {dict.auth.resetPassword.label}
        </Button>
        <Typography variant="body2">
          {dict.auth.noAccount}{" "}
          <MuiLink
            component={NextLink}
            href={handleQueryParam(`/${lang}/auth/sign-up`, {
              [QueryParamKey.RedirectTo]: redirectTo,
            })}
          >
            {dict.auth.signUp.label}
          </MuiLink>
        </Typography>
      </StyledCardActions>
    </FormCard>
  );
};

export default AuthResetPassword;
