// https://nextjs.org/docs/app/guides/authentication

// import {
//   type CountryCode,
//   isSupportedCountry,
//   isValidPhoneNumber,
// } from "libphonenumber-js";
import * as z from "zod";

import type { I18nDict } from "@/providers/i18n-store-provider";

// const today = dayjs();
// const minDate = dayjs("1900-01-01");

// type BirthDateError = "invalidDate" | "maxDate" | "minDate";

export const createSignupFormSchema = (dict: I18nDict) => {
  // const birthDateMessageMap: Record<BirthDateError, string> = {
  //   invalidDate: dict.validation.birthDate.invalid,
  //   maxDate: dict.validation.birthDate.maxDate,
  //   minDate: dict.validation.birthDate.minDate,
  // };

  // const addBirthDateIssue = (ctx: z.RefinementCtx, type: BirthDateError) => {
  //   ctx.addIssue({
  //     code: "custom",
  //     message: birthDateMessageMap[type],
  //   });
  // };

  return z
    .object({
      image: z.string().trim().optional(),
      lastName: z.string().trim().optional(),
      firstName: z
        .string()
        .min(1, { error: dict.validation.firstName.minLength })
        .trim(),
      // birthDate: z
      //   .string()
      //   .min(1, { error: dict.validation.birthDate.required })
      //   .trim()
      //   .superRefine((value, ctx) => {
      //     const date = dayjs(value);

      //     if (!date.isValid()) addBirthDateIssue(ctx, "invalidDate");
      //     if (date.isAfter(today)) addBirthDateIssue(ctx, "maxDate");
      //     if (date.isBefore(minDate)) addBirthDateIssue(ctx, "minDate");
      //   }),
      // gender: z
      //   .union([z.enum(GENDER_VALUES), z.literal("")])
      //   .refine((value) => value !== "", {
      //     message: dict.validation.gender.required,
      //   }),
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
      // country: z.object({
      //   code: z.custom<CountryCode>().superRefine((value, ctx) => {
      //     if (!value) {
      //       ctx.addIssue({
      //         code: "custom",
      //         message: dict.validation.countryCode.required,
      //       });
      //       return;
      //     }
      //     if (!isSupportedCountry(value)) {
      //       ctx.addIssue({
      //         code: "custom",
      //         message: dict.validation.countryCode.invalid,
      //       });
      //     }
      //   }),
      //   label: z.string(),
      //   phone: z.string(),
      //   firstLetter: z.string(),
      //   suggested: z.boolean().optional(),
      // }),
      // phoneNumber: z
      //   .string()
      //   .min(1, { error: dict.validation.phone.required })
      //   .trim(),
      isSubscribed: z.boolean(),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      path: ["confirmPassword"],
      message: dict.validation.confirmPassword.mismatch,
    });
  // .refine(
  //   ({ country, phoneNumber }) => {
  //     return isValidPhoneNumber(phoneNumber, country.code);
  //   },
  //   { path: ["phoneNumber"], message: dict.validation.phone.invalid },
  // );
};

export type FormState =
  | {
      errors?: {
        image?: string[];
        lastName?: string[];
        firstName?: string[];
        // birthDate?: string[];
        // gender?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        // country?: {
        //   code?: string[];
        // };
        // phoneNumber?: string[];
        isSubscribed?: string[];
      };
      message?: string;
    }
  | undefined;
