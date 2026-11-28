import * as z from "zod";

export const useStoresFormSchema = () =>
  z.object({
    organizationId: z.string(),
  });

export type StoresForm = z.infer<ReturnType<typeof useStoresFormSchema>>;
