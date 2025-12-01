import type { CountryType } from "@/types/countries";

export const formatPhone = (phone?: CountryType["phone"]) =>
  phone ? `+${phone}` : "";
