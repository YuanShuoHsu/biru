// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-in-page/
// https://mui.com/store/sign-in/

"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

// import { signup } from "./actions/auth";

import { useI18n } from "@/context/i18n";

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

// import type { CreateAuthDto } from "@/types/auth/login/createAuthDto";

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

// const sendRequest = async (url: string, { arg }: { arg: CreateAuthDto }) =>
//   fetch(url, {
//     method: "POST",
//     body: JSON.stringify(arg),
//   }).then((res) => res.json());

const MemberAuthResetPassword = () => {
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmNewPassword: false,
  });

  const handleClickShowPassword = (key: keyof typeof showPassword) => () =>
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));

  // const router = useRouter();

  const { lang } = useParams();

  const dict = useI18n();

  // const { enqueueSnackbar } = useSnackbar();

  // const { isMutating, trigger } = useSWRMutation(
  //   "/api/auth/login",
  //   sendRequest,
  // );

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
      //     const { data } = await trigger(form);
      //     console.log(data);
      //     router.push(`/${lang}/orders`);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
    }
  };

  //   const [state, action, pending] = useActionState(signup, undefined);

  return (
    <FormCard component="form" onSubmit={handleSubmit}>
      {/* action={action} */}
      <StyledCardHeader
        title={
          <Typography
            color="primary"
            fontWeight="bold"
            textAlign="center"
            variant="h6"
          >
            {dict.member.auth.resetPassword.label}
          </Typography>
        }
      />
      <StyledCardContent>
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
          // error={!!state?.errors?.newPassword}
          fullWidth
          // 這邊可能會需要修正
          // helperText={
          //   state?.errors?.newPassword?.length
          //     ? `Password must: ${state.errors.newPassword.join(", ")}`
          //     : ""
          // }
          label={dict.member.auth.newPassword}
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
                        ? dict.member.auth.hideNewPassword
                        : dict.member.auth.showNewPassword
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
          // error={!!state?.errors?.newPassword}
          fullWidth
          // 這邊可能會需要修正
          // helperText={
          //   state?.errors?.newPassword?.length
          //     ? `Password must: ${state.errors.newPassword.join(", ")}`
          //     : ""
          // }
          label={dict.member.auth.confirmNewPassword}
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
                        ? dict.member.auth.hideConfirmNewPassword
                        : dict.member.auth.showConfirmNewPassword
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
        <Button
          // disabled={isMutating}
          fullWidth
          // loading={isMutating}
          size="large"
          type="submit"
          variant="contained"
        >
          {dict.member.auth.resetPassword.label}
        </Button>
        <Typography variant="body2">
          {dict.member.auth.noAccount}{" "}
          <MuiLink component={NextLink} href={`/${lang}/member/sign-up`}>
            {dict.member.auth.signUp.label}
          </MuiLink>
        </Typography>
      </StyledCardActions>
    </FormCard>
  );
};

export default MemberAuthResetPassword;
