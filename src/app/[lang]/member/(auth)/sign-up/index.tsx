// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-up-page/
// https://mui.com/store/sign-up/

"use client";

import NextLink from "next/link";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

import GoogleButton from "@/components/GoogleButton";

import { useI18n } from "@/context/i18n";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { getErrorMessage } from "@/utils/errors";

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

interface MemberAuthSignUpProps {
  lang: string;
  redirect?: string | string[];
}

const MemberAuthSignUp = ({ lang, redirect }: MemberAuthSignUpProps) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
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

  const dict = useI18n();

  const langNameDirection: "row" | "row-reverse" =
    lang === "en" ? "row" : "row-reverse";

  const handleClickShowPassword = () => setShowPassword((show) => !show);

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
            {dict.member.auth.signUp.label}
          </Typography>
        }
      />
      <StyledCardContent>
        <GoogleButton action="signUp" href="" />
        <Divider>{dict.member.auth.or}</Divider>
        <Stack direction={langNameDirection} spacing={2}>
          <TextField
            autoComplete="given-name"
            fullWidth
            label={dict.member.auth.firstName}
            name="firstName"
            onChange={handleChange}
            required
            value={form.firstName}
          />
          <TextField
            autoComplete="family-name"
            fullWidth
            label={dict.member.auth.lastName}
            name="lastName"
            onChange={handleChange}
            required
            value={form.lastName}
          />
        </Stack>
        <TextField
          autoComplete="email"
          fullWidth
          label={dict.member.auth.email}
          name="email"
          onChange={handleChange}
          required
          type="email"
          value={form.email}
        />
        <TextField
          autoComplete="current-password"
          fullWidth
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
      </StyledCardContent>
      <StyledCardActions disableSpacing>
        <Button fullWidth size="large" type="submit" variant="contained">
          {dict.member.auth.signUp.label}
        </Button>
        <Typography variant="caption" color="text.secondary" align="center">
          By clicking «{dict.member.auth.signUp.label}», you agree to Biru
          Coffee&rsquo;s
          <Box component="br" />
          <MuiLink
            component={NextLink}
            href={handleRedirectParams(`/${lang}/member/terms`)}
          >
            Terms of Service
          </MuiLink>{" "}
          and{" "}
          <MuiLink
            component={NextLink}
            href={handleRedirectParams(`/${lang}/member/privacy`)}
          >
            Privacy Policy
          </MuiLink>
          .
        </Typography>
        <Divider flexItem />
        <Stack flexDirection="row" alignItems="center" gap={1}>
          <Typography variant="body2">{dict.member.auth.hasAccount}</Typography>
          <MuiLink
            component={NextLink}
            href={handleRedirectParams(`/${lang}/member/sign-in`)}
            variant="body2"
          >
            {dict.member.auth.signIn.label}
          </MuiLink>
        </Stack>
      </StyledCardActions>
    </FormCard>
  );
};

export default MemberAuthSignUp;
