// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-in-page/
// https://mui.com/store/sign-in/

"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

// import { signup } from "./actions/auth";

import { useI18n } from "@/context/i18n";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardProps,
  Container,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// import type { CreateAuthDto } from "@/types/auth/login/createAuthDto";

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const StyledCard = styled(Card)<CardProps<"form">>({
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

// const sendRequest = async (url: string, { arg }: { arg: CreateAuthDto }) =>
//   fetch(url, {
//     method: "POST",
//     body: JSON.stringify(arg),
//   }).then((res) => res.json());

const ResetPassword = () => {
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

  // const handleSubmit = async (event: React.FormEvent<HTMLDivElement>) => {
  //   event.preventDefault();

  //   try {
  //     const { data } = await trigger(form);
  //     console.log(data);
  //     router.push(`/${lang}/orders`);
  //   } catch (error) {
  //     enqueueSnackbar(String(error), { variant: "error" });
  //   }
  // };

  //   const [state, action, pending] = useActionState(signup, undefined);

  return (
    <StyledContainer maxWidth="sm" disableGutters>
      <StyledCard component="form">
        {/* action={action} */}
        <StyledCardHeader
          title={
            <Typography
              color="primary"
              fontWeight="bold"
              textAlign="center"
              variant="h6"
            >
              {dict.auth.resetPassword}
            </Typography>
          }
        />
        <StyledCardContent>
          <TextField
            // error={!!state?.errors?.email}
            fullWidth
            // helperText={state?.errors?.email}
            label={dict.auth.email}
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
            // error={!!state?.errors?.newPassword}
            fullWidth
            // 這邊可能會需要修正
            // helperText={
            //   state?.errors?.newPassword?.length
            //     ? `Password must: ${state.errors.newPassword.join(", ")}`
            //     : ""
            // }
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
          <Button
            // disabled={isMutating}
            fullWidth
            // loading={isMutating}
            size="large"
            type="submit"
            variant="contained"
          >
            {dict.auth.resetPassword}
          </Button>
          <Typography variant="body2">
            {dict.auth.noAccount}{" "}
            <MuiLink component={NextLink} href={`/${lang}/member/sign-up`}>
              {dict.auth.signUp}
            </MuiLink>
          </Typography>
        </StyledCardActions>
      </StyledCard>
    </StyledContainer>
  );
};

export default ResetPassword;
