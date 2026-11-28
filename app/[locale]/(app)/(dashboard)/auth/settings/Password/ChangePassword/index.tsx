"use client";

import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSWRConfig } from "swr";

import {
  type ChangePasswordForm,
  useChangePasswordFormSchema,
} from "./definitions";

import FormBox from "@/components/FormBox";
import PasswordRuleList from "@/components/PasswordRuleList";

import { zodResolver } from "@hookform/resolvers/zod";

import { usePasswordValidation } from "@/hooks/usePasswordValidation";

import { authClient } from "@/lib/auth-client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";

import { useDialogStore } from "@/providers/dialog-store-provider";

import { sessionsKey } from "../../Sessions";

import {
  handleMouseDownPassword,
  handleMouseUpPassword,
} from "@/utils/password";

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const { closeDialog, setDialog } = useDialogStore((state) => state);

  const changePasswordFormSchema = useChangePasswordFormSchema();

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ChangePasswordForm>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      revokeOtherSessions: false,
    },
    resolver: zodResolver(changePasswordFormSchema),
  });

  const [
    currentPassword,
    newPassword,
    confirmNewPassword,
    revokeOtherSessions,
  ] = useWatch({
    control,
    name: [
      "currentPassword",
      "newPassword",
      "confirmNewPassword",
      "revokeOtherSessions",
    ],
  });

  const {
    confirmPasswordRules,
    hasConfirmPassword,
    hasPassword,
    isConfirmPasswordError,
    isPasswordError,
    passwordRules,
  } = usePasswordValidation(newPassword, confirmNewPassword, currentPassword);

  const { enqueueSnackbar } = useSnackbar();

  const { mutate } = useSWRConfig();

  const tAuth = useTranslations("auth");

  const handleClickShowPassword =
    (key: "currentPassword" | "newPassword" | "confirmNewPassword") => () =>
      setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));

  const onSubmit = handleSubmit(
    async ({
      currentPassword,
      newPassword,
      revokeOtherSessions,
    }: ChangePasswordForm) => {
      setDialog({ confirmLoading: true });

      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions,
        fetchOptions: {
          onError: ({ error: { message } }) => {
            enqueueSnackbar(message, {
              variant: "error",
            });
          },
          onSuccess: async () => {
            if (revokeOtherSessions) await mutate(sessionsKey);

            closeDialog();

            enqueueSnackbar(tAuth("settings.password.success"), {
              variant: "success",
            });
          },
        },
      });

      setDialog({ confirmLoading: false });
    },
  );

  return (
    <FormBox id="change-password-form" onSubmit={onSubmit}>
      <TextField
        autoComplete="current-password"
        error={!!errors.currentPassword}
        fullWidth
        helperText={errors.currentPassword?.message}
        label={tAuth("settings.password.currentLabel")}
        placeholder={tAuth("settings.password.currentPlaceholder")}
        required
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="start">
                <IconButton
                  aria-label={
                    showPassword.currentPassword
                      ? tAuth("hidePassword")
                      : tAuth("showPassword")
                  }
                  edge="end"
                  onClick={handleClickShowPassword("currentPassword")}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                >
                  {showPassword.currentPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        type={showPassword.currentPassword ? "text" : "password"}
        {...register("currentPassword")}
      />
      <TextField
        autoComplete="new-password"
        error={isPasswordError}
        fullWidth
        helperText={
          <PasswordRuleList hasValue={hasPassword} rules={passwordRules} />
        }
        label={tAuth("newPassword.label")}
        placeholder={tAuth("newPassword.placeholder")}
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
        helperText={
          <PasswordRuleList
            hasValue={hasConfirmPassword}
            rules={confirmPasswordRules}
          />
        }
        label={tAuth("confirmNewPassword.label")}
        placeholder={tAuth("confirmNewPassword.placeholder")}
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
      <FormControlLabel
        control={
          <Checkbox
            checked={revokeOtherSessions}
            size="small"
            {...register("revokeOtherSessions")}
          />
        }
        label={tAuth("settings.password.revokeOtherSessions")}
        slotProps={{ typography: { variant: "body2" } }}
      />
    </FormBox>
  );
};

export default ChangePassword;
