// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-in-page/
// https://mui.com/store/sign-in/

"use client";

import NextLink from "next/link";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

import type { Locale } from "@/app/[lang]/dictionaries";

import FormCard from "@/components/FormCard";

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

interface AuthForgotPasswordProps {
  lang: Locale;
  redirectTo?: string;
}

const AuthForgotPassword = ({ lang, redirectTo }: AuthForgotPasswordProps) => {
  const [form, setForm] = useState({
    email: "",
  });

  const { dict } = useI18nStore((state) => state);

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
            {dict.auth.forgotPassword.label}
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
      </StyledCardContent>
      <StyledCardActions disableSpacing>
        <Button fullWidth size="large" type="submit" variant="contained">
          {dict.auth.sendPasswordResetLink}
        </Button>
        <Typography variant="body2">
          {dict.auth.rememberedPassword}{" "}
          <MuiLink
            component={NextLink}
            href={handleQueryParam(`/${lang}/auth/sign-in`, {
              [QueryParamKey.RedirectTo]: redirectTo,
            })}
          >
            {dict.auth.signIn.label}
          </MuiLink>
        </Typography>
      </StyledCardActions>
    </FormCard>
  );
};

export default AuthForgotPassword;
