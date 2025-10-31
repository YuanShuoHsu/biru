import { locales } from "@/constants/locale";

export type LocaleCode = (typeof locales)[number];
export type LocalizedText = Record<LocaleCode, string>;
