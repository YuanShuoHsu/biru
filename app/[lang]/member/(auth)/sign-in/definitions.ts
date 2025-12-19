// https://nextjs.org/docs/app/guides/authentication

import * as z from "zod";

import type { I18nDict } from "@/context/i18n";

export const createSigninFormSchema = (dict: I18nDict) =>
  z.object({
    email: z.email({ error: dict.validation.email.invalid }).trim(),
    password: z
      .string()
      .min(8, { error: dict.validation.password.minLength })
      .regex(/[a-zA-Z]/, { error: dict.validation.password.letter })
      .regex(/[0-9]/, { error: dict.validation.password.number })
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
