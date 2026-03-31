import { useTranslations } from "next-intl";
import * as z from "zod";

export const useAcceptInvitationFormSchema = () => {
  const tValidation = useTranslations("validation");

  return z.object({
    email: z.email({ error: tValidation("email.invalid") }).trim(),
  });
};

export type AcceptInvitationForm = z.infer<
  ReturnType<typeof useAcceptInvitationFormSchema>
>;
