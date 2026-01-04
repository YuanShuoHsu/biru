import { LocaleEnum } from "@/constants/locale";

export type LocaleCode = (typeof LocaleEnum)[keyof typeof LocaleEnum];

export type LocalizedText = Record<LocaleCode, string>;
