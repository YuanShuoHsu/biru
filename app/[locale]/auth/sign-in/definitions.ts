// https://nextjs.org/docs/app/guides/authentication

import type { useTranslations } from "next-intl";
import * as z from "zod";

export const createSigninFormSchema = (
  tValidation: ReturnType<typeof useTranslations<"validation">>,
) =>
  z.object({
    email: z.email({ error: tValidation("email.invalid") }).trim(),
    password: z
      .string()
      .min(8, { error: tValidation("password.minLength") })
      .regex(/[a-zA-Z]/, { error: tValidation("password.letter") })
      .regex(/[0-9]/, { error: tValidation("password.number") })
      .trim(),
    rememberMe: z.boolean(),
  });

export type FormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
        rememberMe?: string[];
      };
      message?: string;
    }
  | undefined;
