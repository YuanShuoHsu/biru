// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-in-page/
// https://mui.com/store/sign-in/

"use client";

import NextLink from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import useSWRMutation from "swr/mutation";

import GoogleButton from "@/components/GoogleButton";

import { useI18n } from "@/context/i18n";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardProps,
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

import type { AuthResponseDto } from "@/types/auth/auth-response.dto";
import type { LoginDto } from "@/types/auth/login.dto";

import { getErrorMessage } from "@/utils/errors";
import { fetcher, sendRequest } from "@/utils/fetcher";

const FormCard = React.forwardRef<HTMLFormElement, CardProps<"form">>(
  (props, ref) => <Card ref={ref} component="form" {...props} />,
);
FormCard.displayName = "FormCard";

export const StyledCard = styled(FormCard)({
  width: "100%",
});

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

const MemberAuthSignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);

  const { lang } = useParams();

  const router = useRouter();

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const redirectURL = redirect?.startsWith("/") ? redirect : `/${lang}`;

  const dict = useI18n();

  const { enqueueSnackbar } = useSnackbar();

  const { isMutating, trigger } = useSWRMutation<
    AuthResponseDto,
    Error,
    string,
    LoginDto
  >(
    "/api/auth/login",
    sendRequest({
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }),
  );

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
      console.log("form", form);
      const { access_token } = await trigger(form);
      console.log("data", access_token);

      const data = await fetcher("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        credentials: "include",
      });

      router.push(redirectURL);
      router.refresh();
      console.log(data, "this");
    } catch (error) {
      console.log(error);
      console.log(String(error));
      console.log(getErrorMessage(error));
      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
    } finally {
    }
  };

  return (
    <StyledCard component="form" onSubmit={handleSubmit}>
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
            href={`/${lang}/member/forgot-password`}
            variant="body2"
          >
            {dict.member.auth.forgotPassword.label}
          </MuiLink>
        </Stack>
      </StyledCardContent>
      <StyledCardActions disableSpacing>
        <Button
          disabled={isMutating}
          fullWidth
          loading={isMutating}
          size="large"
          type="submit"
          variant="contained"
        >
          {dict.member.auth.signIn.label}
        </Button>
        <Typography variant="body2">
          {dict.member.auth.noAccount}{" "}
          <MuiLink component={NextLink} href={`/${lang}/member/sign-up`}>
            {dict.member.auth.signUp.label}
          </MuiLink>
        </Typography>
      </StyledCardActions>
    </StyledCard>
  );
};

export default MemberAuthSignIn;
