// https://nextjs.org/docs/app/guides/authentication

import * as z from "zod";

export const SigninFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { error: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
    .regex(/[0-9]/, { error: "Contain at least one number." })
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
