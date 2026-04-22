"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { type BaseSyntheticEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  type ChangePasswordForm,
  useChangePasswordFormSchema,
} from "./definitions";

import { zodResolver } from "@hookform/resolvers/zod";

import { authClient, getErrorMessage } from "@/lib/auth-client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmNewPassword: false,
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const changePasswordFormSchema = useChangePasswordFormSchema();
  const passwordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const locale = useLocale();

  const { enqueueSnackbar } = useSnackbar();

  const tAuth = useTranslations("auth");

  const handleClickShowPassword =
    (key: "newPassword" | "confirmNewPassword") => () =>
      setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));

  const onPasswordSubmitHandler = async (values: ChangePasswordForm) => {
    setIsSavingPassword(true);
    await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      fetchOptions: {
        onError: ({ error }) => {
          setIsSavingPassword(false);
          enqueueSnackbar(getErrorMessage(error.code, locale), {
            variant: "error",
          });
        },
        onSuccess: () => {
          setIsSavingPassword(false);
          passwordForm.reset();
          enqueueSnackbar(tAuth("settings.password.saveSuccess"), {
            variant: "success",
          });
        },
      },
    });
  };

  const onPasswordSubmit = (event: BaseSyntheticEvent) =>
    passwordForm.handleSubmit(onPasswordSubmitHandler)(event);

  return (
    <Box>
      <Typography fontWeight={600} mb={1.5} variant="subtitle2">
        {tAuth("settings.password.changeLabel")}
      </Typography>
      <Card component="form" onSubmit={onPasswordSubmit}>
        <CardContent>
          <Stack gap={2}>
            <Controller
              control={passwordForm.control}
              name="currentPassword"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  autoComplete="current-password"
                  error={!!fieldState.error}
                  fullWidth
                  helperText={fieldState.error?.message}
                  label={tAuth("settings.password.currentLabel")}
                  placeholder={tAuth("settings.password.currentPlaceholder")}
                  size="small"
                  type="password"
                />
              )}
            />
            <Controller
              control={passwordForm.control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  autoComplete="new-password"
                  error={!!fieldState.error}
                  fullWidth
                  helperText={fieldState.error?.message}
                  label={tAuth("newPassword.label")}
                  placeholder={tAuth("newPassword.placeholder")}
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword.newPassword
                                ? tAuth("hideNewPassword")
                                : tAuth("showNewPassword")
                            }
                            edge="end"
                            onClick={handleClickShowPassword("newPassword")}
                            size="small"
                          >
                            {showPassword.newPassword ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  type={showPassword.newPassword ? "text" : "password"}
                />
              )}
            />
            <Controller
              control={passwordForm.control}
              name="confirmNewPassword"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  autoComplete="new-password"
                  error={!!fieldState.error}
                  fullWidth
                  helperText={fieldState.error?.message}
                  label={tAuth("confirmNewPassword.label")}
                  placeholder={tAuth("confirmNewPassword.placeholder")}
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword.confirmNewPassword
                                ? tAuth("hideConfirmNewPassword")
                                : tAuth("showConfirmNewPassword")
                            }
                            edge="end"
                            onClick={handleClickShowPassword(
                              "confirmNewPassword",
                            )}
                            size="small"
                          >
                            {showPassword.confirmNewPassword ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  type={showPassword.confirmNewPassword ? "text" : "password"}
                />
              )}
            />
            <Stack alignItems="flex-end">
              <Button
                loading={isSavingPassword}
                size="small"
                type="submit"
                variant="contained"
              >
                {tAuth("settings.password.update")}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePassword;
