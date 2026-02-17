import type { Locale } from "@/app/[lang]/dictionaries";

import { getErrorMessage } from "@/utils/errors";
import { sendRequest } from "@/utils/fetcher";

export const verifyEmailToken = async (lang: Locale, token: string) => {
  try {
    await sendRequest<void, { token: string }>({
      headers: { "Accept-Language": lang },
    })("/api/users/verify-email", {
      arg: { token },
    });

    return "";
  } catch (error) {
    return getErrorMessage(error);
  }
};
