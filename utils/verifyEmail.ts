import type { Locale } from "@/i18n/routing";

import { getErrorMessage } from "@/utils/errors";
import { sendRequest } from "@/utils/fetcher";

export const verifyEmailToken = async (locale: Locale, token: string) => {
  try {
    await sendRequest<void, { token: string }>({
      headers: { "Accept-Language": locale },
    })("/api/users/verify-email", {
      arg: { token },
    });

    return "";
  } catch (error) {
    return getErrorMessage(error);
  }
};
