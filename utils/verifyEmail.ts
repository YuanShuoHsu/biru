import type { Locale } from "@/app/[lang]/dictionaries";

import { COUNTDOWN_KEY } from "@/constants/verifyEmail";

import { getErrorMessage } from "@/utils/errors";
import { sendRequest } from "@/utils/fetcher";

export const verifyEmailToken = async (token: string, lang: Locale) => {
  try {
    await sendRequest<unknown, { token: string }>({
      headers: { "Accept-Language": lang },
    })("/api/mail/verify", {
      arg: { token },
    });

    return "";
  } catch (error) {
    return getErrorMessage(error);
  }
};

export const getCountdown = () => {
  const stored = localStorage.getItem(COUNTDOWN_KEY);
  if (!stored) return 0;

  const target = Number(stored);
  const remaining = Math.ceil((target - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
};

export const clearCountdown = () => {
  localStorage.removeItem(COUNTDOWN_KEY);
};

export const startCountdown = (seconds: number) => {
  const target = Date.now() + seconds * 1000;
  localStorage.setItem(COUNTDOWN_KEY, target.toString());
};
