// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-in-page/
// https://mui.com/store/sign-in/

"use client";

import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

import FormCard from "@/components/FormCard";

import type { Locale } from "@/i18n/routing";

import {
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

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

interface AuthForgotPasswordProps {
  locale: Locale;
  redirectTo?: string;
}

const AuthForgotPassword = ({ locale, redirectTo }: AuthForgotPasswordProps) => {
  const [form, setForm] = useState({
    email: "",
  });

  const tAuth = useTranslations("auth");

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // const { data } = await trigger(form);
      // console.log(data);
      // router.push(`/${locale}/orders`);
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
            {tAuth("forgotPassword.label")}
          </Typography>
        }
      />
      <StyledCardContent>
        <TextField
          autoComplete="email"
          fullWidth
          label={tAuth("email.label")}
          name="email"
          onChange={handleChange}
          placeholder={tAuth("email.placeholder")}
          required
          type="email"
          value={form.email}
        />
      </StyledCardContent>
      <StyledCardActions disableSpacing>
        <Button fullWidth size="large" type="submit" variant="contained">
          {tAuth("sendPasswordResetLink")}
        </Button>
        <Typography variant="body2">
          {tAuth("rememberedPassword")}{" "}
          <MuiLink
            component={NextLink}
            href={handleQueryParam(`/${locale}/auth/sign-in`, {
              [QueryParamKey.RedirectTo]: redirectTo,
            })}
          >
            {tAuth("signIn.label")}
          </MuiLink>
        </Typography>
      </StyledCardActions>
    </FormCard>
  );
};

export default AuthForgotPassword;
