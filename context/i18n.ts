"use client";

import { createContext, useContext } from "react";

import { dictionaries } from "@/app/[lang]/dictionaries";
import { LocaleEnum } from "@/constants/locale";

export type I18nDict = Awaited<
  ReturnType<(typeof dictionaries)[LocaleEnum.ZhTW]>
>;

const I18nContext = createContext<I18nDict | null>(null);

export const useI18n = () => useContext(I18nContext)!;

export default I18nContext;
