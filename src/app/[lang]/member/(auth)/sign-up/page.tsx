// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-up-page/
// https://mui.com/store/sign-up/

"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

// import { signup } from "./actions/auth";

import { useI18n } from "@/context/i18n";

import GoogleButton from "@/components/GoogleButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardProps,
  Divider,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// import type { CreateAuthDto } from "@/types/auth/login/createAuthDto";

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

const MemberAuthSignUp = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  // const router = useRouter();

  const { lang } = useParams();
  const langNameDirection: "row" | "row-reverse" =
    lang === "en" ? "row" : "row-reverse";

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
            {dict.member.auth.signUp.label}
          </Typography>
        }
      />
      <StyledCardContent>
        <GoogleButton action="signUp" href="" />
        <Divider>{dict.member.auth.or}</Divider>
        <Stack direction={langNameDirection} spacing={2}>
          <TextField
            fullWidth
            label={dict.member.auth.firstName}
            name="firstName"
            onChange={handleChange}
            required
            value={form.firstName}
          />
          <TextField
            fullWidth
            label={dict.member.auth.lastName}
            name="lastName"
            onChange={handleChange}
            required
            value={form.lastName}
          />
        </Stack>
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
          {dict.member.auth.signUp.label}
        </Button>
        <Typography variant="caption" color="text.secondary" align="center">
          By clicking «{dict.member.auth.signUp.label}», you agree to Biru
          Coffee&rsquo;s
          <Box component="br" />
          <MuiLink component={NextLink} href={`/${lang}/member/terms`}>
            Terms of Service
          </MuiLink>{" "}
          and{" "}
          <MuiLink component={NextLink} href={`/${lang}/member/privacy`}>
            Privacy Policy
          </MuiLink>
          .
        </Typography>
        <Divider flexItem />
        <Stack flexDirection="row" alignItems="center" gap={1}>
          <Typography variant="body2">{dict.member.auth.hasAccount}</Typography>
          <MuiLink
            component={NextLink}
            href={`/${lang}/member/sign-in`}
            variant="body2"
          >
            {dict.member.auth.signIn.label}
          </MuiLink>
        </Stack>
      </StyledCardActions>
    </StyledCard>
  );
};

export default MemberAuthSignUp;
