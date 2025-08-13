// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-in-page/
// https://mui.com/store/sign-in/

"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

// import { signup } from "./actions/auth";

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
  Container,
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

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  // const router = useRouter();

  const { lang } = useParams();

  const dict = useI18n();

  // const { enqueueSnackbar } = useSnackbar();

  // const { isMutating, trigger } = useSWRMutation(
  //   "/api/auth/login",
  //   sendRequest,
  // );

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
              {dict.auth.signIn}
            </Typography>
          }
        />
        <StyledCardContent>
          <GoogleButton action="signIn" href="" />
          <Divider>{dict.auth.or}</Divider>
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
            // error={!!state?.errors?.password}
            fullWidth
            // 這邊可能會需要修正
            // helperText={
            //   state?.errors?.password?.length
            //     ? `Password must: ${state.errors.password.join(", ")}`
            //     : ""
            // }
            label={dict.auth.password}
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
                  checked={form.remember}
                  name="remember"
                  onChange={handleChange}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">{dict.auth.remember}</Typography>
              }
            />
            <MuiLink
              component={NextLink}
              href={`/${lang}/forgot-password`}
              variant="body2"
            >
              {dict.auth.forgotPassword}
            </MuiLink>
          </Stack>
        </StyledCardContent>
        <StyledCardActions>
          <Button
            // disabled={isMutating}
            fullWidth
            // loading={isMutating}
            size="large"
            type="submit"
            variant="contained"
          >
            {dict.auth.signIn}
          </Button>
          <Stack flexDirection="row" alignItems="center" gap={1}>
            <Typography variant="body2">{dict.auth.noAccount}</Typography>
            <MuiLink
              component={NextLink}
              href={`/${lang}/sign-up`}
              variant="body2"
            >
              {dict.auth.signUp}
            </MuiLink>
          </Stack>
        </StyledCardActions>
      </StyledCard>
    </StyledContainer>
  );
};

export default SignIn;
