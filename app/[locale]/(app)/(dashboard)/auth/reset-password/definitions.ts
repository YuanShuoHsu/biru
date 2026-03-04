import { useTranslations } from "next-intl";
import * as z from "zod";

export const useResetPasswordFormSchema = () => {
  const tValidation = useTranslations("validation");

  return z
    .object({
      email: z.string().optional(),
      newPassword: z
        .string()
        .min(8, { error: tValidation("password.minLength") })
        .regex(/[a-zA-Z]/, { error: tValidation("password.letter") })
        .regex(/[0-9]/, { error: tValidation("password.number") })
        .trim(),
      confirmNewPassword: z
        .string()
        .min(1, { error: tValidation("confirmPassword.required") })
        .trim(),
    })
    .refine(
      ({ newPassword, confirmNewPassword }) =>
        newPassword === confirmNewPassword,
      {
        path: ["confirmNewPassword"],
        message: tValidation("confirmPassword.mismatch"),
      },
    );
};
