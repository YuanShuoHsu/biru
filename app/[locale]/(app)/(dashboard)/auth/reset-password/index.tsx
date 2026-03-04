// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-in-page/
// https://mui.com/store/sign-in/

"use client";

import { useLocale, useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import { useResetPasswordFormSchema } from "./definitions";

import FormCard from "@/components/FormCard";

import { query } from "@/constants/query";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "@/i18n/navigation";

import { authClient, getErrorMessage } from "@/lib/auth-client";

import {
  CheckCircleOutline,
  LockReset,
  RadioButtonUnchecked,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

import { getHref } from "@/utils/href";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingBottom: 0,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => {
  const mainColor = theme.palette.primary.main;

  return {
    width: theme.spacing(7),
    height: theme.spacing(7),
    backgroundColor: alpha(mainColor, 0.2),
    color: mainColor,
  };
});

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
}));

interface PasswordRule {
  key: string;
  passed: boolean;
  label: string;
}

interface AuthResetPasswordProps {
  email: string;
  redirectTo?: string;
  token: string;
}

const AuthResetPassword = ({
  email,
  redirectTo,
  token,
}: AuthResetPasswordProps) => {
  const [showPassword, setShowPassword] = useState<
    Record<"newPassword" | "confirmNewPassword", boolean>
  >({
    newPassword: false,
    confirmNewPassword: false,
  });

  const locale = useLocale();

  const router = useRouter();

  const tAuth = useTranslations("auth");
  const tValidation = useTranslations("validation");

  const resetPasswordFormSchema = useResetPasswordFormSchema();
  type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    register,
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const [newPassword, confirmNewPassword] = useWatch({
    control,
    name: ["newPassword", "confirmNewPassword"],
  });

  const hasPassword = newPassword.length > 0;
  const hasConfirmPassword = confirmNewPassword.length > 0;
  const passwordsMatch =
    hasPassword && hasConfirmPassword && newPassword === confirmNewPassword;

  const passwordRules: PasswordRule[] = [
    {
      key: "minLength",
      passed: newPassword.length >= 8,
      label: tValidation("password.minLength"),
    },
    {
      key: "letter",
      passed: /[a-zA-Z]/.test(newPassword),
      label: tValidation("password.letter"),
    },
    {
      key: "number",
      passed: /\d/.test(newPassword),
      label: tValidation("password.number"),
    },
  ];

  const isPasswordError =
    hasPassword && passwordRules.some(({ passed }) => !passed);

  const confirmPasswordRules: PasswordRule[] = [
    {
      key: "match",
      passed: passwordsMatch,
      label: tValidation("password.match"),
    },
  ];

  const isConfirmPasswordError =
    hasConfirmPassword && !confirmPasswordRules[0].passed;

  const renderPasswordRules = (rules: PasswordRule[], hasValue: boolean) => (
    <List dense disablePadding>
      {rules.map(({ key, label, passed }) => {
        const color = hasValue
          ? passed
            ? "primary.main"
            : "error.main"
          : "text.secondary";

        return (
          <ListItem disablePadding key={key}>
            <ListItemIcon sx={{ color, minWidth: 28 }}>
              {passed ? (
                <CheckCircleOutline fontSize="small" />
              ) : (
                <RadioButtonUnchecked fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={label}
              slotProps={{ primary: { color, variant: "caption" } }}
            />
          </ListItem>
        );
      })}
    </List>
  );

  const handleClickShowPassword =
    (key: "newPassword" | "confirmNewPassword") => () =>
      setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => event.preventDefault();

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  const onSubmit = handleSubmit(
    async ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      confirmNewPassword: _,
      ...data
    }: ResetPasswordFormData) => {
      if (!token) return;

      const { error } = await authClient.resetPassword({
        ...data,
        token,
        fetchOptions: {
          headers: {
            "Accept-Language": locale,
          },
        },
      });

      if (error?.code) {
        const message = getErrorMessage(error.code, locale);
        enqueueSnackbar(message, { variant: "error" });

        return;
      }

      enqueueSnackbar(tAuth("resetPassword.success"), { variant: "success" });
      router.replace(
        getHref("/auth/sign-in", { [query.redirectTo]: redirectTo }),
      );
    },
  );

  return (
    <FormCard component="form" onSubmit={onSubmit}>
      <StyledCardHeader
        title={
          <Typography
            color="primary"
            fontWeight="bold"
            textAlign="center"
            variant="h6"
          >
            {tAuth("resetPassword.label")}
          </Typography>
        }
      />
      <StyledCardContent>
        <StyledAvatar>
          <LockReset fontSize="large" />
        </StyledAvatar>
        <Stack alignItems="center" spacing={1}>
          <Typography textAlign="center">{email}</Typography>
          <Typography
            color="text.secondary"
            textAlign="center"
            variant="caption"
          >
            {tAuth("resetPassword.subtitle")}
          </Typography>
        </Stack>
        <TextField
          autoComplete="new-password"
          error={isPasswordError}
          fullWidth
          helperText={renderPasswordRules(passwordRules, hasPassword)}
          label={tAuth("newPassword")}
          required
          slotProps={{
            formHelperText: { component: "div" },
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label={
                      showPassword.newPassword
                        ? tAuth("hideNewPassword")
                        : tAuth("showNewPassword")
                    }
                    edge="end"
                    onClick={handleClickShowPassword("newPassword")}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
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
          {...register("newPassword")}
        />
        <TextField
          autoComplete="new-password"
          error={isConfirmPasswordError}
          fullWidth
          helperText={renderPasswordRules(
            confirmPasswordRules,
            hasConfirmPassword,
          )}
          label={tAuth("confirmNewPassword")}
          required
          slotProps={{
            formHelperText: { component: "div" },
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label={
                      showPassword.confirmNewPassword
                        ? tAuth("hideConfirmNewPassword")
                        : tAuth("showConfirmNewPassword")
                    }
                    edge="end"
                    onClick={handleClickShowPassword("confirmNewPassword")}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
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
          {...register("confirmNewPassword")}
        />
      </StyledCardContent>
      <StyledCardActions disableSpacing>
        <Button
          disabled={isSubmitting}
          fullWidth
          loading={isSubmitting}
          loadingPosition="start"
          size="large"
          type="submit"
          variant="contained"
        >
          {tAuth("resetPassword.label")}
        </Button>
        <Stack flexDirection="row" alignItems="center" gap={0.5}>
          <Typography variant="body2">{tAuth("rememberedPassword")}</Typography>
          <Link
            href={getHref("/auth/sign-in", { [query.redirectTo]: redirectTo })}
            underline="hover"
            variant="body2"
          >
            {tAuth("signIn.label")}
          </Link>
        </Stack>
      </StyledCardActions>
    </FormCard>
  );
};

export default AuthResetPassword;
