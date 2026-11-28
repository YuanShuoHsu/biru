"use client";

import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  type ExportUserDataForm,
  useExportUserDataFormSchema,
} from "./definitions";

import FormBox from "@/components/FormBox";

import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  DialogContentText,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";

import { useDialogStore } from "@/providers/dialog-store-provider";

import {
  handleMouseDownPassword,
  handleMouseUpPassword,
} from "@/utils/password";

interface ExportUserDataProps {
  hasCredential: boolean;
}

const ExportUserData = ({ hasCredential }: ExportUserDataProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const { closeDialog, setDialog } = useDialogStore((state) => state);

  const exportUserDataFormSchema = useExportUserDataFormSchema(hasCredential);

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ExportUserDataForm>({
    defaultValues: { password: "" },
    resolver: zodResolver(exportUserDataFormSchema),
  });

  const { enqueueSnackbar } = useSnackbar();

  const tAuth = useTranslations("auth");

  const onSubmit = handleSubmit(async ({ password }: ExportUserDataForm) => {
    setDialog({ confirmLoading: true });

    const { data, error } = await authClient.$fetch("/export-user-data", {
      body: hasCredential ? { password } : {},
      method: "POST",
    });

    setDialog({ confirmLoading: false });

    if (error) {
      enqueueSnackbar(error.message, { variant: "error" });

      return;
    }

    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "user-data.json";
    link.click();
    URL.revokeObjectURL(url);

    closeDialog();

    enqueueSnackbar(tAuth("settings.privacy.success"), { variant: "success" });
  });

  return (
    <FormBox id="export-user-data-form" onSubmit={onSubmit}>
      <DialogContentText>
        {hasCredential
          ? tAuth("settings.privacy.passwordHint")
          : tAuth("settings.privacy.freshSessionHint")}
      </DialogContentText>
      {hasCredential && (
        <TextField
          autoComplete="current-password"
          error={!!errors.password}
          fullWidth
          helperText={errors.password?.message}
          label={tAuth("settings.password.currentLabel")}
          placeholder={tAuth("settings.password.currentPlaceholder")}
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label={
                      showPassword
                        ? tAuth("hidePassword")
                        : tAuth("showPassword")
                    }
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          type={showPassword ? "text" : "password"}
          {...register("password")}
        />
      )}
    </FormBox>
  );
};

export default ExportUserData;
