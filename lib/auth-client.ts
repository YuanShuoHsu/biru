import {
  adminClient,
  inferAdditionalFields,
  multiSessionClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { LocaleEnum } from "@/enums/Locale";

import { type Locale, routing } from "@/i18n/routing";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_NEXT_URL,
  plugins: [
    adminClient(),
    inferAdditionalFields({
      user: {
        bio: {
          type: "string",
          required: false,
        },
        birthDate: {
          type: "date",
          required: false,
        },
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
          type: [...routing.locales],
          required: true,
          defaultValue: routing.defaultLocale,
        },
        lastName: {
          type: "string",
          required: false,
        },
      },
    }),
    multiSessionClient(),
    organizationClient({
      teams: { enabled: true },
      schema: {
        organization: {
          additionalFields: {
            // https://schema.org/PostalAddress
            addressCountry: {
              type: "string",
              required: false,
            },
            addressLocality: { type: "string", required: false },
            addressRegion: { type: "string", required: false },
            extendedAddress: { type: "string", required: false },
            postOfficeBoxNumber: { type: "string", required: false },
            postalCode: { type: "string", required: false },
            streetAddress: { type: "string", required: false },

            // https://schema.org/LocalBusiness
            hasMap: { type: "string", required: false },
            openingHours: { type: "string", required: false },
            telephone: { type: "string", required: false },

            // 點數設定：每累積 1 點所需消費金額；null = 未啟用點數
            amountPerPoint: { type: "number", required: false },
            // 點數效期（年）；null = 永久有效
            pointsValidityYears: { type: "number", required: false },
          },
        },
      },
    }),
  ],
});

type ErrorTypes = Partial<
  Record<keyof typeof authClient.$ERROR_CODES, Record<Locale, string>>
>;

const customErrorCodes: Record<string, Record<Locale, string>> = {
  EMAIL_IS_ALREADY_VERIFIED: {
    [LocaleEnum.ZhTW]: "此信箱已完成驗證，請直接登入",
    [LocaleEnum.En]: "Email already verified. Please sign in.",
    [LocaleEnum.Ja]:
      "このメールアドレスは既に認証済みです。ログインしてください",
    [LocaleEnum.Ko]: "이미 인증된 이메일입니다. 로그인해 주세요",
    [LocaleEnum.ZhCN]: "此邮箱已完成验证，请直接登录",
  },
  EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION: {
    [LocaleEnum.ZhTW]: "請先驗證信箱後再接受邀請",
    [LocaleEnum.En]: "Email verification required before accepting invitation.",
    [LocaleEnum.Ja]: "招待を受け入れる前にメール認証が必要です",
    [LocaleEnum.Ko]: "초대를 수락하기 전에 이메일 인증이 필요합니다",
    [LocaleEnum.ZhCN]: "请先验证邮箱后再接受邀请",
  },
  FAILED_TO_UNLINK_LAST_ACCOUNT: {
    [LocaleEnum.ZhTW]: "無法解除最後一個登入方式",
    [LocaleEnum.En]: "Cannot unlink the last login method.",
    [LocaleEnum.Ja]: "最後のログイン方法は解除できません",
    [LocaleEnum.Ko]: "마지막 로그인 방법은 연결 해제할 수 없습니다",
    [LocaleEnum.ZhCN]: "无法解除最后一个登录方式",
  },
  INVITATION_NOT_FOUND: {
    [LocaleEnum.ZhTW]: "邀請連結無效或已過期",
    [LocaleEnum.En]: "Invitation not found or has expired.",
    [LocaleEnum.Ja]: "招待が見つからないか、有効期限が切れています",
    [LocaleEnum.Ko]: "초대를 찾을 수 없거나 만료되었습니다",
    [LocaleEnum.ZhCN]: "邀请链接无效或已过期",
  },
  UNAUTHORIZED: {
    [LocaleEnum.ZhTW]: "請先登入",
    [LocaleEnum.En]: "Please sign in first",
    [LocaleEnum.Ja]: "先にログインしてください",
    [LocaleEnum.Ko]: "먼저 로그인해 주세요",
    [LocaleEnum.ZhCN]: "请先登录",
  },
  YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: {
    [LocaleEnum.ZhTW]: "此邀請不是發給您的",
    [LocaleEnum.En]: "You are not the recipient of this invitation.",
    [LocaleEnum.Ja]: "この招待はあなた宛ではありません",
    [LocaleEnum.Ko]: "이 초대는 귀하를 위한 것이 아닙니다",
    [LocaleEnum.ZhCN]: "此邀请不是发给您的",
  },
};

const errorCodes = {
  INVALID_EMAIL_OR_PASSWORD: {
    [LocaleEnum.ZhTW]: "電子郵件或密碼錯誤，請重新輸入",
    [LocaleEnum.En]: "Invalid email or password. Please try again.",
    [LocaleEnum.Ja]:
      "メールアドレスまたはパスワードが間違っています。再入力してください",
    [LocaleEnum.Ko]:
      "이메일 또는 비밀번호가 올바르지 않습니다. 다시 입력해 주세요",
    [LocaleEnum.ZhCN]: "电子邮件或密码错误，请重新输入",
  },
  INVALID_PASSWORD: {
    [LocaleEnum.ZhTW]: "目前密碼錯誤，請重新輸入",
    [LocaleEnum.En]: "Invalid password. Please try again.",
    [LocaleEnum.Ja]: "現在のパスワードが間違っています。再入力してください",
    [LocaleEnum.Ko]: "현재 비밀번호가 올바르지 않습니다. 다시 입력해 주세요",
    [LocaleEnum.ZhCN]: "目前密码错误，请重新输入",
  },
  INVALID_TOKEN: {
    [LocaleEnum.ZhTW]: "驗證連結無效或已過期，請重新寄送",
    [LocaleEnum.En]: "Invalid or expired verification link. Please resend.",
    [LocaleEnum.Ja]: "認証リンクが無効または期限切れです。再送してください",
    [LocaleEnum.Ko]: "유효하지 않거나 만료된 인증 링크입니다. 다시 보내주세요",
    [LocaleEnum.ZhCN]: "验证链接无效或已过期，请重新发送",
  },
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
    [LocaleEnum.ZhTW]: "此帳號已被註冊，請使用其他信箱",
    [LocaleEnum.En]: "User already registered. Please use another email.",
    [LocaleEnum.Ja]:
      "このユーザーは既に登録されています。別のメールアドレスを使用してください",
    [LocaleEnum.Ko]: "이미 등록된 사용자입니다. 다른 이메일을 사용해 주세요",
    [LocaleEnum.ZhCN]: "此账号已被注册，请使用其他邮箱",
  },
} satisfies ErrorTypes;

export const getErrorMessage = (code: string, locale: Locale) => {
  if (code in errorCodes)
    return errorCodes[code as keyof typeof errorCodes][locale];
  if (code in customErrorCodes) return customErrorCodes[code][locale];

  return "";
};
