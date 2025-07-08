export type LocaleCode = "zh-TW" | "en" | "ja" | "ko" | "zh-CN";

export type LangParam = {
  lang: LocaleCode;
};

export type LangTableNumberParam = LangParam & {
  tableNumber: string;
};
