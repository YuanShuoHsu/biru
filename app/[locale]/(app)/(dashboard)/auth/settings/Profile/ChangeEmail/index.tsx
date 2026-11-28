"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";

import { type EmailForm, useEmailFormSchema } from "./definitions";

import FormBox from "@/components/FormBox";

import { useSession } from "@/hooks/useSession";

import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";

import { TextField } from "@mui/material";

import { useDialogStore } from "@/providers/dialog-store-provider";

const ChangeEmail = () => {
  const session = useSession();
  const { closeDialog, setDialog } = useDialogStore((state) => state);

  const emailFormSchema = useEmailFormSchema();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<EmailForm>({
    defaultValues: { email: session?.user.email || "" },
    resolver: zodResolver(emailFormSchema),
  });

  const locale = useLocale();

  const { enqueueSnackbar } = useSnackbar();

  const tAuth = useTranslations("auth");

  const onSubmit = handleSubmit(async ({ email }: EmailForm) => {
    setDialog({ confirmLoading: true });

    await authClient.changeEmail({
      newEmail: email,
      callbackURL: `${process.env.NEXT_PUBLIC_NEXT_URL}/${locale}/auth/settings`,
      fetchOptions: {
        onError: ({ error: { message } }) => {
          enqueueSnackbar(message, {
            variant: "error",
          });
        },
        onSuccess: () => {
          closeDialog();

          enqueueSnackbar(tAuth("settings.email.success"), {
            variant: "success",
          });
        },
      },
    });

    setDialog({ confirmLoading: false });
  });

  return (
    <FormBox id="change-email-form" onSubmit={onSubmit}>
      <TextField
        autoComplete="email"
        error={!!errors.email}
        fullWidth
        helperText={errors.email?.message || tAuth("settings.email.hint")}
        label={tAuth("email.label")}
        placeholder={tAuth("email.placeholder")}
        required
        type="email"
        {...register("email")}
      />
    </FormBox>
  );
};

export default ChangeEmail;
