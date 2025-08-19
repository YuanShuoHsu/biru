export type LocaleCode = "zh-TW" | "en" | "ja" | "ko" | "zh-CN";

export type LangParam = {
  lang: LocaleCode;
};

export type LangStoreParam = LangParam & {
  store: string;
};

export type LangTableNumberParam = LangParam & {
  tableNumber: string;
};

export type LangStoreTableNumberParam = LangParam & {
  store: string;
  tableNumber: string;
};
