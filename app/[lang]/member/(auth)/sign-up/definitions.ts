// https://nextjs.org/docs/app/guides/authentication

import dayjs from "dayjs";
import * as z from "zod";

import { GENDER_VALUES } from "@/constants/gender";
import type { I18nDict } from "@/context/i18n";

import { getPhoneFormatting, toDigits } from "@/utils/countries";

const today = dayjs();
const minDate = dayjs("1900-01-01");

type BirthDateError = "invalidDate" | "maxDate" | "minDate";

export const createSignupFormSchema = (dict: I18nDict) => {
  const birthDateMessageMap: Record<BirthDateError, string> = {
    invalidDate: dict.validation.birthDate.invalid,
    maxDate: dict.validation.birthDate.maxDate,
    minDate: dict.validation.birthDate.minDate,
  };

  const addBirthDateIssue = (ctx: z.RefinementCtx, type: BirthDateError) => {
    ctx.addIssue({
      code: "custom",
      message: birthDateMessageMap[type],
    });
  };

  return z
    .object({
      lastName: z.string().trim().optional(),
      firstName: z
        .string()
        .min(1, { error: dict.validation.firstName.minLength })
        .trim(),
      birthDate: z
        .string()
        .min(1, { error: dict.validation.birthDate.required })
        .superRefine((value, ctx) => {
          const date = dayjs(value);

          if (!date.isValid()) addBirthDateIssue(ctx, "invalidDate");
          if (date.isAfter(today)) addBirthDateIssue(ctx, "maxDate");
          if (date.isBefore(minDate)) addBirthDateIssue(ctx, "minDate");
        }),
      gender: z.enum(GENDER_VALUES, { error: dict.validation.gender.required }),
      email: z.email({ error: dict.validation.email.invalid }).trim(),
      password: z
        .string()
        .min(8, { error: dict.validation.password.minLength })
        .regex(/[a-zA-Z]/, { error: dict.validation.password.letter })
        .regex(/[0-9]/, { error: dict.validation.password.number })
        .trim(),
      confirmPassword: z
        .string()
        .min(1, { error: dict.validation.confirmPassword.required })
        .trim(),
      countryCode: z
        .string()
        .min(1, { error: dict.validation.countryCode.required }),
      phone: z
        .string()
        .min(1, { error: dict.validation.phone.required })
        .trim(),
      emailUpdates: z.boolean(),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      path: ["confirmPassword"],
      message: dict.validation.confirmPassword.mismatch,
    })
    .refine(
      ({ countryCode, phone }) => {
        const phoneLength = toDigits(phone).length;

        const { placeholder } = getPhoneFormatting(countryCode);
        const expectedLength = toDigits(placeholder).length;

        return phoneLength === expectedLength;
      },
      { path: ["phone"], message: dict.validation.phone.invalid },
    );
};

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
