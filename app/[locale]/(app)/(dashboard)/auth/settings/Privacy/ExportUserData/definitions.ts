import { useTranslations } from "next-intl";
import * as z from "zod";

export const useExportUserDataFormSchema = (hasCredential: boolean) => {
  const tValidation = useTranslations("validation");

  return z.object({
    password: hasCredential
      ? z
          .string()
          .trim()
          .min(1, { error: tValidation("currentPassword.required") })
      : z.string(),
  });
};

export type ExportUserDataForm = z.infer<
  ReturnType<typeof useExportUserDataFormSchema>
>;
