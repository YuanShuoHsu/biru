// https://nextjs.org/docs/app/getting-started/updating-data
// https://nextjs.org/docs/app/guides/forms
// https://zod.dev/error-formatting?id=zflattenerror

"use server";

import { z } from "zod";

import { createSignupFormSchema, type FormState } from "./definitions";

import { getDictionary } from "@/app/[lang]/dictionaries";

import { LocaleCode } from "@/types/locale";

export const signup = async (
  lang: string,
  _state: FormState,
  formData: FormData,
) => {
  const dict = await getDictionary(lang as LocaleCode);
  const signupFormSchema = createSignupFormSchema(dict);

  const validatedFields = signupFormSchema.safeParse({
    lastName: formData.get("lastName"),
    firstName: formData.get("firstName"),
    birthDate: formData.get("birthDate"),
    gender: formData.get("gender"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    countryCode: formData.get("countryCode"),
    phone: formData.get("phone"),
    emailUpdates: formData.get("emailUpdates") === "on",
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    return { errors: fieldErrors };
  }

  try {
    // await sendRequest({ credentials: "include" })("/api/auth/register", {
    //   arg: validatedFields.data,
    // });
    // return { success: true };
  } catch {
    // return { message: getErrorMessage(error), success: false };
  }
};
