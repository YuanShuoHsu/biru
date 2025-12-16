// https://nextjs.org/docs/app/guides/authentication

import dayjs from "dayjs";
import * as z from "zod";

import { GENDER_VALUES } from "@/constants/gender";
import { getPhoneFormatting, toDigits } from "@/utils/countries";

const today = dayjs();
const minDate = dayjs("1900-01-01");

type BirthDateError = "invalidDate" | "maxDate" | "minDate";

const birthDateMessageMap: Record<BirthDateError, string> = {
  invalidDate: "Birth date is not valid.",
  maxDate: "Please select a birth date on or before today.",
  minDate: "Please select a birth date on or after 1900-01-01.",
};

const addBirthDateIssue = (ctx: z.RefinementCtx, type: BirthDateError) => {
  ctx.addIssue({
    code: "custom",
    message: birthDateMessageMap[type],
  });
};

export const SignupFormSchema = z
  .object({
    lastName: z.string().trim().optional(),
    firstName: z
      .string()
      .min(1, { error: "First name must be at least 1 character long." })
      .trim(),
    birthDate: z
      .string()
      .min(1, { error: "Birth date is required." })
      .superRefine((value, ctx) => {
        const date = dayjs(value);

        if (!date.isValid()) addBirthDateIssue(ctx, "invalidDate");
        if (date.isAfter(today)) addBirthDateIssue(ctx, "maxDate");
        if (date.isBefore(minDate)) addBirthDateIssue(ctx, "minDate");
      }),
    gender: z.enum(GENDER_VALUES, { error: "Gender is required." }),
    email: z.email({ error: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(8, { error: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
      .regex(/[0-9]/, { error: "Contain at least one number." })
      .trim(),
    confirmPassword: z
      .string()
      .min(1, { error: "Confirm password is required." })
      .trim(),
    countryCode: z.string().min(1, { error: "Country code is required." }),
    phone: z.string().min(1, { error: "Phone is required." }).trim(),
    emailUpdates: z.boolean(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  })
  .refine(
    ({ countryCode, phone }) => {
      const phoneLength = toDigits(phone).length;

      const { placeholder } = getPhoneFormatting(countryCode);
      const expectedLength = toDigits(placeholder).length;

      return phoneLength === expectedLength;
    },
    { path: ["phone"], message: "Phone number is not valid." },
  );

export type FormState =
  | {
      errors?: {
        lastName?: string[];
        firstName?: string[];
        birthDate?: string[];
        gender?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        countryCode?: string[];
        phone?: string[];
        emailUpdates?: string[];
      };
      message?: string;
    }
  | undefined;
