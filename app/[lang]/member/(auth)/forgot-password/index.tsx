// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-in-page/
// https://mui.com/store/sign-in/

"use client";

import NextLink from "next/link";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

import FormCard from "@/components/FormCard";

import { useI18n } from "@/context/i18n";

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

interface MemberAuthForgotPasswordProps {
  lang: string;
  redirect?: string;
}

const MemberAuthForgotPassword = ({
  lang,
  redirect,
}: MemberAuthForgotPasswordProps) => {
  const [form, setForm] = useState({
    email: "",
  });

  const dict = useI18n();

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
            {dict.member.auth.forgotPassword.label}
          </Typography>
        }
      />
      <StyledCardContent>
        <TextField
          autoComplete="email"
          fullWidth
          label={dict.member.auth.email.label}
          name="email"
          onChange={handleChange}
          placeholder={dict.member.auth.email.placeholder}
          required
          type="email"
          value={form.email}
        />
      </StyledCardContent>
      <StyledCardActions disableSpacing>
        <Button fullWidth size="large" type="submit" variant="contained">
          {dict.member.auth.sendPasswordResetLink}
        </Button>
        <Typography variant="body2">
          {dict.member.auth.rememberedPassword}{" "}
          <MuiLink
            component={NextLink}
            href={handleQueryParam(
              `/${lang}/member/sign-in`,
              QueryParamKey.Redirect,
              redirect,
            )}
          >
            {dict.member.auth.signIn.label}
          </MuiLink>
        </Typography>
      </StyledCardActions>
    </FormCard>
  );
};

export default MemberAuthForgotPassword;
