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
        phoneNumber: {
          type: "string",
          required: false,
        },
        phoneNumberVerified: {
          type: "boolean",
          required: true,
          defaultValue: false,
          input: false,
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

            currency: { type: "string", required: false },

            amountPerPoint: { type: "number", required: false },
            pointsEnabledAt: { type: "date", required: false },
            closedAt: { type: "date", required: false, input: false },
            pointsValidityYears: { type: "number", required: false },

            pickupLeadMinutes: { type: "number", required: false },
            pickupMaxAdvanceDays: { type: "number", required: false },
            pickupCutoffMinutes: { type: "number", required: false },
          },
        },
      },
    }),
  ],
});

type ErrorTypes = Partial<
  Record<
    | keyof typeof authClient.$ERROR_CODES
    | "access_denied"
    | "account_already_linked_to_different_user"
    | "email_does_not_match"
    | "invalid_code"
    | "unable_to_get_user_info"
    | "PHONE_NUMBER_ALREADY_EXISTS"
    | "UNAUTHORIZED"
    | "USER_HAS_EMPLOYMENT_RECORDS"
    | "USER_IS_SOLE_ORGANIZATION_OWNER",
    Record<Locale, string>
  >
>;

const errorCodes = {
  CREDENTIAL_ACCOUNT_NOT_FOUND: {
    [LocaleEnum.ZhTW]: "此帳號尚未設定密碼，請用「發送重設連結」設定密碼",
    [LocaleEnum.En]:
      "This account has no password yet. Use “Send reset link” to set one.",
    [LocaleEnum.Ja]:
      "このアカウントにはパスワードが設定されていません。「リセットリンクを送信」から設定してください",
    [LocaleEnum.Ko]:
      "이 계정에는 아직 비밀번호가 없습니다. ‘재설정 링크 발송’으로 설정해 주세요",
    [LocaleEnum.ZhCN]: "此账号尚未设置密码，请用“发送重置链接”设置密码",
  },
  EMAIL_ALREADY_VERIFIED: {
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
  INVALID_SESSION_TOKEN: {
    [LocaleEnum.ZhTW]: "此裝置的登入已失效，請重新登入",
    [LocaleEnum.En]: "This session is no longer valid. Please sign in again.",
    [LocaleEnum.Ja]:
      "このデバイスのログインは無効になっています。再度ログインしてください",
    [LocaleEnum.Ko]: "이 기기의 로그인이 만료되었습니다. 다시 로그인해 주세요",
    [LocaleEnum.ZhCN]: "此设备的登录已失效，请重新登录",
  },
  INVALID_TOKEN: {
    [LocaleEnum.ZhTW]: "驗證連結無效或已過期，請重新寄送",
    [LocaleEnum.En]: "Invalid or expired verification link. Please resend.",
    [LocaleEnum.Ja]: "認証リンクが無効または期限切れです。再送してください",
    [LocaleEnum.Ko]: "유효하지 않거나 만료된 인증 링크입니다. 다시 보내주세요",
    [LocaleEnum.ZhCN]: "验证链接无效或已过期，请重新发送",
  },
  INVALID_USER: {
    [LocaleEnum.ZhTW]: "此驗證連結不屬於目前登入的帳號，請先登出再開啟",
    [LocaleEnum.En]:
      "This verification link belongs to a different account. Please sign out and open it again.",
    [LocaleEnum.Ja]:
      "この認証リンクは別のアカウントのものです。ログアウトしてから開き直してください",
    [LocaleEnum.Ko]:
      "이 인증 링크는 다른 계정의 것입니다. 로그아웃한 후 다시 열어 주세요",
    [LocaleEnum.ZhCN]: "此验证链接不属于当前登录的账号，请先退出登录再打开",
  },
  INVITATION_NOT_FOUND: {
    [LocaleEnum.ZhTW]: "邀請連結無效或已過期",
    [LocaleEnum.En]: "Invitation not found or has expired.",
    [LocaleEnum.Ja]: "招待が見つからないか、有効期限が切れています",
    [LocaleEnum.Ko]: "초대를 찾을 수 없거나 만료되었습니다",
    [LocaleEnum.ZhCN]: "邀请链接无效或已过期",
  },
  PASSWORD_TOO_LONG: {
    [LocaleEnum.ZhTW]: "密碼過長，請縮短後再試",
    [LocaleEnum.En]: "Password is too long. Please use a shorter one.",
    [LocaleEnum.Ja]: "パスワードが長すぎます。短くしてください",
    [LocaleEnum.Ko]: "비밀번호가 너무 깁니다. 더 짧게 입력해 주세요",
    [LocaleEnum.ZhCN]: "密码过长，请缩短后再试",
  },
  PHONE_NUMBER_ALREADY_EXISTS: {
    [LocaleEnum.ZhTW]: "此電話號碼已被註冊",
    [LocaleEnum.En]: "This phone number is already registered.",
    [LocaleEnum.Ja]: "この電話番号は既に登録されています",
    [LocaleEnum.Ko]: "이 전화번호는 이미 등록되어 있습니다",
    [LocaleEnum.ZhCN]: "此电话号码已被注册",
  },
  TOKEN_EXPIRED: {
    [LocaleEnum.ZhTW]: "驗證連結已過期，請重新寄送",
    [LocaleEnum.En]: "Verification link has expired. Please resend.",
    [LocaleEnum.Ja]: "認証リンクの有効期限が切れています。再送してください",
    [LocaleEnum.Ko]: "인증 링크가 만료되었습니다. 다시 보내주세요",
    [LocaleEnum.ZhCN]: "验证链接已过期，请重新发送",
  },
  UNAUTHORIZED: {
    [LocaleEnum.ZhTW]: "請先登入",
    [LocaleEnum.En]: "Please sign in first",
    [LocaleEnum.Ja]: "先にログインしてください",
    [LocaleEnum.Ko]: "먼저 로그인해 주세요",
    [LocaleEnum.ZhCN]: "请先登录",
  },
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
    [LocaleEnum.ZhTW]: "此帳號已被註冊，請使用其他信箱",
    [LocaleEnum.En]: "User already registered. Please use another email.",
    [LocaleEnum.Ja]:
      "このユーザーは既に登録されています。別のメールアドレスを使用してください",
    [LocaleEnum.Ko]: "이미 등록된 사용자입니다. 다른 이메일을 사용해 주세요",
    [LocaleEnum.ZhCN]: "此账号已被注册，请使用其他邮箱",
  },
  USER_HAS_EMPLOYMENT_RECORDS: {
    [LocaleEnum.ZhTW]: "此帳號有出勤或薪資紀錄，依法須保存，無法刪除",
    [LocaleEnum.En]:
      "This account has attendance or payroll records that must be retained by law, so it can't be deleted.",
    [LocaleEnum.Ja]:
      "このアカウントには法律で保存が義務付けられた勤怠・給与の記録があるため、削除できません",
    [LocaleEnum.Ko]:
      "이 계정에는 법적으로 보관해야 하는 근태 또는 급여 기록이 있어 삭제할 수 없습니다",
    [LocaleEnum.ZhCN]: "此账号有考勤或薪资记录，依法须保存，无法删除",
  },
  USER_IS_SOLE_ORGANIZATION_OWNER: {
    [LocaleEnum.ZhTW]:
      "此帳號是店家唯一的擁有者，請先將擁有者身分移轉給其他成員再刪除",
    [LocaleEnum.En]:
      "This account is the only owner of a store. Transfer ownership to another member before deleting it.",
    [LocaleEnum.Ja]:
      "このアカウントは店舗の唯一のオーナーです。削除する前にオーナー権限を他のメンバーに移してください",
    [LocaleEnum.Ko]:
      "이 계정은 매장의 유일한 소유자입니다. 삭제하기 전에 다른 멤버에게 소유권을 이전하세요",
    [LocaleEnum.ZhCN]:
      "此账号是店家唯一的拥有者，请先将拥有者身份转移给其他成员再删除",
  },
  YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: {
    [LocaleEnum.ZhTW]: "此邀請不是發給您的",
    [LocaleEnum.En]: "You are not the recipient of this invitation.",
    [LocaleEnum.Ja]: "この招待はあなた宛ではありません",
    [LocaleEnum.Ko]: "이 초대는 귀하를 위한 것이 아닙니다",
    [LocaleEnum.ZhCN]: "此邀请不是发给您的",
  },
  access_denied: {
    [LocaleEnum.ZhTW]: "已取消授權",
    [LocaleEnum.En]: "Authorization was cancelled.",
    [LocaleEnum.Ja]: "認証がキャンセルされました",
    [LocaleEnum.Ko]: "인증이 취소되었습니다",
    [LocaleEnum.ZhCN]: "已取消授权",
  },
  account_already_linked_to_different_user: {
    [LocaleEnum.ZhTW]: "此帳號已連結到其他使用者",
    [LocaleEnum.En]: "This account is already linked to another user.",
    [LocaleEnum.Ja]: "このアカウントは既に別のユーザーと連携されています",
    [LocaleEnum.Ko]: "이 계정은 이미 다른 사용자와 연결되어 있습니다",
    [LocaleEnum.ZhCN]: "此账号已关联到其他用户",
  },
  email_does_not_match: {
    [LocaleEnum.ZhTW]: "此帳號的信箱與目前帳號不同，無法連結",
    [LocaleEnum.En]:
      "This account's email doesn't match yours, so it can't be linked.",
    [LocaleEnum.Ja]:
      "このアカウントのメールアドレスが現在のアカウントと異なるため、連携できません",
    [LocaleEnum.Ko]: "이 계정의 이메일이 현재 계정과 달라 연결할 수 없습니다",
    [LocaleEnum.ZhCN]: "此账号的邮箱与当前账号不同，无法关联",
  },
  invalid_code: {
    [LocaleEnum.ZhTW]: "授權已逾時，請重新操作",
    [LocaleEnum.En]: "Authorization expired. Please try again.",
    [LocaleEnum.Ja]: "認証の有効期限が切れました。もう一度お試しください",
    [LocaleEnum.Ko]: "인증이 만료되었습니다. 다시 시도해 주세요",
    [LocaleEnum.ZhCN]: "授权已过期，请重新操作",
  },
  unable_to_get_user_info: {
    [LocaleEnum.ZhTW]: "無法取得帳號資料，請稍後再試",
    [LocaleEnum.En]:
      "Couldn't get your account details. Please try again later.",
    [LocaleEnum.Ja]:
      "アカウント情報を取得できませんでした。しばらくしてからもう一度お試しください",
    [LocaleEnum.Ko]:
      "계정 정보를 가져올 수 없습니다. 잠시 후 다시 시도해 주세요",
    [LocaleEnum.ZhCN]: "无法获取账号资料，请稍后再试",
  },
} satisfies ErrorTypes;

export const getErrorMessage = (code: string, locale: Locale) => {
  if (code in errorCodes)
    return errorCodes[code as keyof typeof errorCodes][locale];

  return "";
};
