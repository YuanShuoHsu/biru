import { LocaleCode } from "@/types/locale";

export const stores: {
  value: string;
  label: Record<LocaleCode, string>;
}[] = [
  {
    label: {
      "zh-TW": "航空城店",
      "zh-CN": "航空城店",
      en: "Aerotropolis",
      ja: "エアロトロポリス店",
      ko: "에어로트로폴리스점",
    },
    value: "aerotropolis",
  },
  {
    label: {
      "zh-TW": "大園店",
      "zh-CN": "大园店",
      en: "Dayuan",
      ja: "大園店",
      ko: "다위안점",
    },
    value: "dayuan",
  },
] as const;

export type StoreValue = (typeof stores)[number]["value"];

export const getStoreLabel = (lang: LocaleCode, store: StoreValue) => {
  const found = stores.find(({ value }) => value === store);
  if (!found) return;

  return found.label[lang];
};
