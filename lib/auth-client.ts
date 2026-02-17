import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { role } from "@/constants/role";

import { LocaleEnum } from "@/enums/Locale";

import { i18n } from "@/i18n-config";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_NEXT_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        emailSubscribed: {
          type: "boolean",
          required: true,
          defaultValue: true,
        },
        firstName: {
          type: "string",
          required: true,
        },
        lang: {
          type: [...i18n.locales],
          required: true,
          defaultValue: i18n.defaultLocale,
        },
        lastName: {
          type: "string",
          required: false,
        },
        role: {
          type: [...role.roles],
          required: true,
          defaultValue: role.defaultRole,
          input: false,
        },
      },
    }),
  ],
});

type ErrorTypes = Partial<
  Record<keyof typeof authClient.$ERROR_CODES, Record<LocaleEnum, string>>
>;

const errorCodes = {
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
    [LocaleEnum.ZhTW]: "此帳號已被註冊，請使用其他信箱",
    [LocaleEnum.En]: "User already registered. Please use another email.",
    [LocaleEnum.Ja]:
      "このユーザーは既に登録されています。別のメールアドレスを使用してください",
    [LocaleEnum.Ko]: "이미 등록된 사용자입니다. 다른 이메일을 사용해 주세요",
    [LocaleEnum.ZhCN]: "此账号已被注册，请使用其他邮箱",
  },
} satisfies ErrorTypes;

export const getErrorMessage = (code: string, lang: LocaleEnum) => {
  if (code in errorCodes)
    return errorCodes[code as keyof typeof errorCodes][lang];

  return "";
};
