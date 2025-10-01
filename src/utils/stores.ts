import type { LocaleCode } from "@/types/locale";
import type { Store, StoreName, StoreSlug } from "@/types/stores";

// export const stores: Store[] = [
//   {
//     id: "aerotropolis",
//     name: {
//       "zh-TW": "航空城店",
//       en: "Aerotropolis",
//       ja: "エアロトロポリス店",
//       ko: "에어로트로폴리스점",
//       "zh-CN": "航空城店",
//     },
//   },
//   {
//     id: "dayuan",
//     name: {
//       "zh-TW": "大園店",
//       en: "Dayuan",
//       ja: "大園店",
//       ko: "다위안점",
//       "zh-CN": "大园店",
//     },
//   },
// ] as const;

export const getStoreName = (
  stores: Store[],
  lang: LocaleCode,
  storeSlug: StoreSlug,
): StoreName => {
  const store = stores.find(({ slug }) => slug === storeSlug);
  if (!store) return storeSlug;

  return store.name[lang];
};
