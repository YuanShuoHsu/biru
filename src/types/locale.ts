import { Locale } from "@/constants/locale";

export type LocaleCode = (typeof Locale)[keyof typeof Locale];

export type LocalizedText = Record<LocaleCode, string>;
