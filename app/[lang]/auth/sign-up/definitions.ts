// https://nextjs.org/docs/app/guides/authentication

import dayjs from "dayjs";
import type { CountryCode } from "libphonenumber-js";
import * as z from "zod";

import { GENDER_VALUES } from "@/constants/gender";

import type { I18nDict } from "@/providers/i18n-store-provider";

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
      gender: z
        .union([z.enum(GENDER_VALUES), z.literal("")])
        .refine((value) => value !== "", {
          message: dict.validation.gender.required,
        }),
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
      country: z
        .object({
          code: z.custom<CountryCode>(),
          label: z.string(),
          phone: z.string(),
          firstLetter: z.string(),
          suggested: z.boolean().optional(),
        })
        .refine(({ code }) => code.length > 0, {
          message: dict.validation.countryCode.required,
        }),
      phoneNumber: z
        .string()
        .min(1, { error: dict.validation.phone.required })
        .trim(),
      isSubscribed: z.boolean(),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      path: ["confirmPassword"],
      message: dict.validation.confirmPassword.mismatch,
    })
    .refine(
      ({ country, phoneNumber }) => {
        const phoneLength = toDigits(phoneNumber).length;

        const { placeholder } = getPhoneFormatting(country.code);
        const expectedLength = toDigits(placeholder).length;

        return phoneLength === expectedLength;
      },
      { path: ["phoneNumber"], message: dict.validation.phone.invalid },
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
        phoneNumber?: string[];
        isSubscribed?: string[];
      };
      message?: string;
    }
  | undefined;
