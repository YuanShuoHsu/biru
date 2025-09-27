import type { LocaleCode } from "@/types/locale";
import type { Store, StoreId, StoreName } from "@/types/stores";

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
  storeId: StoreId,
): StoreName => {
  const store = stores.find(({ id }) => id === storeId);
  if (!store) return storeId;

  return store.name[lang];
};
