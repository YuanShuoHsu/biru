import { useCartStore } from "@/stores/useCartStore";

import type { LocaleCode } from "@/types/locale";
import type { Category, Choice, MenuItem, Option } from "@/types/menu";

export const getItemKey = (
  itemId: string,
  choices: Record<string, string[]>,
): string => {
  if (!choices) return itemId;

  const parts = Object.entries(choices).flatMap(([optionId, selected]) =>
    selected.length > 0
      ? [...selected].sort().map((choiceId) => `${optionId}:${choiceId}`)
      : [],
  );

  return parts.length > 0 ? `${itemId}_${parts.join("_")}` : itemId;
};

const findItemById = (itemId: string): MenuItem | undefined =>
  menu.flatMap(({ items }) => items).find(({ id }) => id === itemId);

export const getItemName = (itemId: string, lang: LocaleCode): string => {
  const item = findItemById(itemId);
  if (!item) return "";

  return item.name[lang];
};

export const getItemStock = (itemId: string): number | null => {
  const item = findItemById(itemId);
  if (!item) return 0;

  return item.stock;
};

const findOptionChoiceById = (
  option: Option,
  choiceId: string,
): Choice | undefined => option.choices.find(({ id }) => id === choiceId);

const getOptionChoiceName = (
  option: Option,
  choiceId: string,
  lang: LocaleCode,
): string => {
  const choice = findOptionChoiceById(option, choiceId);

  return choice?.name[lang] || "";
};

const findItemOptionById = (
  item: MenuItem,
  optionId: string,
): Option | undefined => item.options.find(({ id }) => id === optionId);

type OptionLimitResult = { cap: number; names: string[] };

export const getLimitingChoicesCap = (
  id: string,
  choices: Record<string, string[]>,
  lang: LocaleCode,
): OptionLimitResult => {
  const { getChoiceAvailableQuantity } = useCartStore.getState();

  const item = findItemById(id);
  if (!item) return { cap: Infinity, names: [] };

  const { names, cap } = Object.entries(choices).reduce<OptionLimitResult>(
    (acc, [optionId, choiceIds]) => {
      if (!choiceIds.length) return acc;

      const option = findItemOptionById(item, optionId);
      if (!option) return acc;

      const optionCap = choiceIds.reduce((min, choiceId) => {
        const choice = findOptionChoiceById(option, choiceId);
        if (!choice) return min;

        const { stock: choiceStock, isShared, name } = choice;
        const available = getChoiceAvailableQuantity(
          choiceId,
          choiceStock,
          isShared,
          id,
        );

        const localizedName = name[lang];

        if (available < acc.cap) {
          acc.names = [localizedName];
          acc.cap = available;
        } else if (available === acc.cap && !acc.names.includes(localizedName))
          acc.names.push(localizedName);

        return Math.min(min, available);
      }, Infinity);

      acc.cap = Math.min(acc.cap, optionCap);
      return acc;
    },
    { cap: Infinity, names: [] },
  );

  return { names, cap };
};

interface CommonSeparators {
  colon: string;
  delimiter: string;
  joinWith?: string;
}

export const getChoiceNames = (
  itemId: string,
  choices: Record<string, string[]>,
  lang: LocaleCode,
  { colon, delimiter, joinWith = "\n" }: CommonSeparators,
): string => {
  const item = findItemById(itemId);
  if (!item) return "";

  return Object.entries(choices)
    .flatMap(([optionId, choiceIds]) => {
      if (!choiceIds.length) return [];

      const option = findItemOptionById(item, optionId);
      if (!option) return [];

      const choiceNames = choiceIds
        .map((choiceId) => getOptionChoiceName(option, choiceId, lang))
        .filter(Boolean)
        .join(delimiter);

      return choiceNames ? [`${option.name[lang]}${colon}${choiceNames}`] : [];
    })
    .join(joinWith);
};

export const menu: Category[] = [
  {
    id: "coffee",
    name: {
      "zh-TW": "咖啡",
      en: "Coffee",
      ja: "コーヒー",
      ko: "커피",
      "zh-CN": "咖啡",
    },
    items: [
      {
        id: "coffee-1",
        name: {
          "zh-TW": "經典拿鐵",
          en: "Classic Latte",
          ja: "クラシックラテ",
          ko: "클래식 라떼",
          "zh-CN": "经典拿铁",
        },
        createdAt: "2025-08-04T22:50:00",
        description: {
          "zh-TW": "濃醇的義式濃縮搭配綿密牛奶泡沫。",
          en: "Rich espresso with velvety milk foam.",
          ja: "濃厚なエスプレッソにふわふわのミルクフォーム。",
          ko: "진한 에스프레소와 부드러운 우유 거품.",
          "zh-CN": "浓郁的意式浓缩配绵密奶泡。",
        },
        imageUrl: "/images/IMG_4590.jpg",
        isActive: true,
        options: [
          {
            id: "size",
            name: {
              "zh-TW": "尺寸",
              en: "Size",
              ja: "サイズ",
              ko: "사이즈",
              "zh-CN": "尺寸",
            },
            choices: [
              {
                id: "m",
                name: {
                  "zh-TW": "M",
                  en: "M",
                  ja: "M",
                  ko: "M",
                  "zh-CN": "M",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [
                  {
                    id: "milk",
                    name: {
                      "zh-TW": "牛奶",
                      en: "Milk",
                      ja: "ミルク",
                      ko: "우유",
                      "zh-CN": "牛奶",
                    },
                    unit: {
                      "zh-TW": "毫升",
                      en: "ml",
                      ja: "ミリリットル",
                      ko: "밀리리터",
                      "zh-CN": "毫升",
                    },
                    usage: 30,
                  },
                ],
                sold: 2,
                stock: 2,
              },
              {
                id: "l",
                name: {
                  "zh-TW": "L",
                  en: "L",
                  ja: "L",
                  ko: "L",
                  "zh-CN": "L",
                },
                extraCost: 20,
                isActive: true,
                isShared: false,
                recipes: [
                  {
                    id: "milk",
                    name: {
                      "zh-TW": "牛奶",
                      en: "Milk",
                      ja: "ミルク",
                      ko: "우유",
                      "zh-CN": "牛奶",
                    },
                    unit: {
                      "zh-TW": "毫升",
                      en: "ml",
                      ja: "ミリリットル",
                      ko: "밀리리터",
                      "zh-CN": "毫升",
                    },
                    usage: 60,
                  },
                ],
                sold: 5,
                stock: null,
              },
            ],
            multiple: false,
            required: true,
          },
          {
            id: "sweetness",
            name: {
              "zh-TW": "甜度",
              en: "Sweetness",
              ja: "甘さ",
              ko: "당도",
              "zh-CN": "甜度",
            },
            choices: [
              {
                id: "none",
                name: {
                  "zh-TW": "無糖",
                  en: "No Sugar",
                  ja: "無糖",
                  ko: "무가당",
                  "zh-CN": "无糖",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [],
                sold: 10,
                stock: null,
              },
              {
                id: "less",
                name: {
                  "zh-TW": "少糖",
                  en: "Less Sugar",
                  ja: "少なめ",
                  ko: "적당히",
                  "zh-CN": "少糖",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [
                  {
                    id: "syrup",
                    name: {
                      "zh-TW": "糖漿",
                      en: "Syrup",
                      ja: "シロップ",
                      ko: "시럽",
                      "zh-CN": "糖浆",
                    },
                    unit: {
                      "zh-TW": "毫升",
                      en: "ml",
                      ja: "ミリリットル",
                      ko: "밀리리터",
                      "zh-CN": "毫升",
                    },
                    usage: 10,
                  },
                ],
                sold: 6,
                stock: 4,
              },
              {
                id: "regular",
                name: {
                  "zh-TW": "正常",
                  en: "Regular",
                  ja: "通常",
                  ko: "기본",
                  "zh-CN": "正常",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [
                  {
                    id: "syrup",
                    name: {
                      "zh-TW": "糖漿",
                      en: "Syrup",
                      ja: "シロップ",
                      ko: "시럽",
                      "zh-CN": "糖浆",
                    },
                    unit: {
                      "zh-TW": "毫升",
                      en: "ml",
                      ja: "ミリリットル",
                      ko: "밀리리터",
                      "zh-CN": "毫升",
                    },
                    usage: 20,
                  },
                ],
                sold: 5,
                stock: null,
              },
            ],
            multiple: false,
            required: true,
          },
          {
            id: "ice",
            name: {
              "zh-TW": "冰塊",
              en: "Ice Level",
              ja: "氷の量",
              ko: "얼음량",
              "zh-CN": "冰块",
            },
            choices: [
              {
                id: "regular",
                name: {
                  "zh-TW": "正常",
                  en: "Regular Ice",
                  ja: "普通",
                  ko: "기본",
                  "zh-CN": "正常",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [
                  {
                    id: "syrup",
                    name: {
                      "zh-TW": "糖漿",
                      en: "Syrup",
                      ja: "シロップ",
                      ko: "시럽",
                      "zh-CN": "糖浆",
                    },
                    unit: {
                      "zh-TW": "毫升",
                      en: "ml",
                      ja: "ミリリットル",
                      ko: "밀리리터",
                      "zh-CN": "毫升",
                    },
                    usage: 20,
                  },
                ],
                sold: 5,
                stock: null,
              },
              {
                id: "less",
                name: {
                  "zh-TW": "去冰",
                  en: "Less Ice",
                  ja: "氷なし",
                  ko: "얼음 없음",
                  "zh-CN": "去冰",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [],
                sold: 2,
                stock: 0,
              },
              {
                id: "hot",
                name: {
                  "zh-TW": "熱飲",
                  en: "Hot",
                  ja: "ホット",
                  ko: "따뜻하게",
                  "zh-CN": "热饮",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [],
                sold: 6,
                stock: null,
              },
            ],
            multiple: false,
            required: true,
          },
          {
            id: "topping",
            name: {
              "zh-TW": "加料",
              en: "Toppings",
              ja: "トッピング",
              ko: "토핑",
              "zh-CN": "加料",
            },
            choices: [
              {
                id: "pearls",
                name: {
                  "zh-TW": "珍珠",
                  en: "Pearls",
                  ja: "タピオカ",
                  ko: "타피오카",
                  "zh-CN": "珍珠",
                },
                extraCost: 10,
                isActive: true,
                isShared: true,
                recipes: [],
                sold: 8,
                stock: 0,
              },
              {
                id: "pudding",
                name: {
                  "zh-TW": "布丁",
                  en: "Pudding",
                  ja: "プリン",
                  ko: "푸딩",
                  "zh-CN": "布丁",
                },
                extraCost: 15,
                isActive: true,
                isShared: true,
                recipes: [],
                sold: 10,
                stock: 0,
              },
            ],
            multiple: true,
            required: false,
          },
        ],
        price: 120,
        recipes: [],
        sold: 4,
        stock: null,
      },
      {
        id: "coffee-2",
        name: {
          "zh-TW": "焦糖瑪奇朵",
          en: "Caramel Macchiato",
          ja: "キャラメルマキアート",
          ko: "카라멜 마키아토",
          "zh-CN": "焦糖玛奇朵",
        },
        createdAt: "2024-05-30T04:00:00",
        description: {
          "zh-TW": "香甜焦糖與香醇濃縮完美結合。",
          en: "Sweet caramel and rich espresso perfectly blended.",
          ja: "甘いキャラメルと濃厚なエスプレッソの完璧な組み合わせ。",
          ko: "달콤한 카라멜과 진한 에스프레소의 완벽한 조화.",
          "zh-CN": "香甜焦糖与浓郁浓缩完美结合。",
        },
        imageUrl: "/images/IMG_4590.jpg",
        isActive: true,
        options: [
          {
            id: "size",
            name: {
              "zh-TW": "尺寸",
              en: "Size",
              ja: "サイズ",
              ko: "사이즈",
              "zh-CN": "尺寸",
            },
            choices: [
              {
                id: "m",
                name: {
                  "zh-TW": "M",
                  en: "M",
                  ja: "M",
                  ko: "M",
                  "zh-CN": "M",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [],
                sold: 10,
                stock: null,
              },
              {
                id: "l",
                name: {
                  "zh-TW": "L",
                  en: "L",
                  ja: "L",
                  ko: "L",
                  "zh-CN": "L",
                },
                extraCost: 20,
                isActive: true,
                isShared: false,
                recipes: [],
                sold: 5,
                stock: null,
              },
            ],
            multiple: false,
            required: true,
          },
          {
            id: "sweetness",
            name: {
              "zh-TW": "甜度",
              en: "Sweetness",
              ja: "甘さ",
              ko: "당도",
              "zh-CN": "甜度",
            },
            choices: [
              {
                id: "none",
                name: {
                  "zh-TW": "無糖",
                  en: "No Sugar",
                  ja: "無糖",
                  ko: "무가당",
                  "zh-CN": "无糖",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [],
                sold: 6,
                stock: null,
              },
              {
                id: "less",
                name: {
                  "zh-TW": "少糖",
                  en: "Less Sugar",
                  ja: "少なめ",
                  ko: "적당히",
                  "zh-CN": "少糖",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [
                  {
                    id: "syrup",
                    name: {
                      "zh-TW": "糖漿",
                      en: "Syrup",
                      ja: "シロップ",
                      ko: "시럽",
                      "zh-CN": "糖浆",
                    },
                    unit: {
                      "zh-TW": "毫升",
                      en: "ml",
                      ja: "ミリリットル",
                      ko: "밀리리터",
                      "zh-CN": "毫升",
                    },
                    usage: 10,
                  },
                ],
                sold: 8,
                stock: null,
              },
              {
                id: "regular",
                name: {
                  "zh-TW": "正常",
                  en: "Regular",
                  ja: "通常",
                  ko: "기본",
                  "zh-CN": "正常",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [
                  {
                    id: "syrup",
                    name: {
                      "zh-TW": "糖漿",
                      en: "Syrup",
                      ja: "シロップ",
                      ko: "시럽",
                      "zh-CN": "糖浆",
                    },
                    unit: {
                      "zh-TW": "毫升",
                      en: "ml",
                      ja: "ミリリットル",
                      ko: "밀리리터",
                      "zh-CN": "毫升",
                    },
                    usage: 20,
                  },
                ],
                sold: 10,
                stock: null,
              },
            ],
            multiple: false,
            required: true,
          },
        ],
        price: 130,
        recipes: [],
        sold: 5,
        stock: 2,
      },
    ],
  },
  {
    id: "tea",
    name: {
      "zh-TW": "茶飲",
      en: "Tea",
      ja: "お茶",
      ko: "차",
      "zh-CN": "茶饮",
    },
    items: [
      {
        id: "tea-1",
        name: {
          "zh-TW": "茉香綠茶",
          en: "Jasmine Green Tea",
          ja: "ジャスミン緑茶",
          ko: "자스민 녹차",
          "zh-CN": "茉香绿茶",
        },
        createdAt: "2024-04-18T10:15:00",
        description: {
          "zh-TW": "清新茉莉花香與綠茶完美融合。",
          en: "A refreshing blend of jasmine aroma and green tea.",
          ja: "爽やかなジャスミンの香りと緑茶の絶妙な組み合わせ。",
          ko: "상쾌한 자스민 향과 녹차의 완벽한 조화.",
          "zh-CN": "清新茉莉花香与绿茶完美融合。",
        },
        imageUrl: "/images/IMG_4590.jpg",
        isActive: false,
        options: [
          {
            id: "ice",
            name: {
              "zh-TW": "冰塊",
              en: "Ice Level",
              ja: "氷の量",
              ko: "얼음량",
              "zh-CN": "冰块",
            },
            choices: [
              {
                id: "regular",
                name: {
                  "zh-TW": "正常",
                  en: "Regular Ice",
                  ja: "普通",
                  ko: "기본",
                  "zh-CN": "正常",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [
                  {
                    id: "syrup",
                    name: {
                      "zh-TW": "糖漿",
                      en: "Syrup",
                      ja: "シロップ",
                      ko: "시럽",
                      "zh-CN": "糖浆",
                    },
                    unit: {
                      "zh-TW": "毫升",
                      en: "ml",
                      ja: "ミリリットル",
                      ko: "밀리리터",
                      "zh-CN": "毫升",
                    },
                    usage: 20,
                  },
                ],
                sold: 4,
                stock: 0,
              },
              {
                id: "less",
                name: {
                  "zh-TW": "去冰",
                  en: "Less Ice",
                  ja: "氷なし",
                  ko: "얼음 없음",
                  "zh-CN": "去冰",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [],
                sold: 8,
                stock: 0,
              },
              {
                id: "hot",
                name: {
                  "zh-TW": "熱飲",
                  en: "Hot",
                  ja: "ホット",
                  ko: "따뜻하게",
                  "zh-CN": "热饮",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [],
                sold: 9,
                stock: null,
              },
            ],
            multiple: false,
            required: true,
          },
        ],
        price: 80,
        recipes: [],
        sold: 9,
        stock: 20,
      },
      {
        id: "tea-2",
        name: {
          "zh-TW": "伯爵鮮奶茶",
          en: "Earl Grey Milk Tea",
          ja: "アールグレイミルクティー",
          ko: "얼그레이 밀크티",
          "zh-CN": "伯爵鲜奶茶",
        },
        createdAt: "2024-05-10T16:30:00",
        description: {
          "zh-TW": "濃醇伯爵茶搭配鮮奶，口感滑順。",
          en: "Rich Earl Grey tea with fresh milk for a smooth taste.",
          ja: "濃厚なアールグレイとミルクの滑らかな口当たり。",
          ko: "진한 얼그레이와 신선한 우유의 부드러운 조화.",
          "zh-CN": "浓醇伯爵茶搭配鲜奶，口感顺滑。",
        },
        imageUrl: "/images/IMG_4590.jpg",
        isActive: true,
        options: [
          {
            id: "size",
            name: {
              "zh-TW": "尺寸",
              en: "Size",
              ja: "サイズ",
              ko: "사이즈",
              "zh-CN": "尺寸",
            },
            choices: [
              {
                id: "m",
                name: {
                  "zh-TW": "M",
                  en: "M",
                  ja: "M",
                  ko: "M",
                  "zh-CN": "M",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [],
                sold: 7,
                stock: null,
              },
              {
                id: "l",
                name: {
                  "zh-TW": "L",
                  en: "L",
                  ja: "L",
                  ko: "L",
                  "zh-CN": "L",
                },
                extraCost: 20,
                isActive: true,
                isShared: false,
                recipes: [],
                sold: 9,
                stock: null,
              },
            ],
            multiple: false,
            required: true,
          },
          {
            id: "sweetness",
            name: {
              "zh-TW": "甜度",
              en: "Sweetness",
              ja: "甘さ",
              ko: "당도",
              "zh-CN": "甜度",
            },
            choices: [
              {
                id: "none",
                name: {
                  "zh-TW": "無糖",
                  en: "No Sugar",
                  ja: "無糖",
                  ko: "무가당",
                  "zh-CN": "无糖",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [],
                sold: 8,
                stock: null,
              },
              {
                id: "less",
                name: {
                  "zh-TW": "少糖",
                  en: "Less Sugar",
                  ja: "少なめ",
                  ko: "적당히",
                  "zh-CN": "少糖",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [
                  {
                    id: "syrup",
                    name: {
                      "zh-TW": "糖漿",
                      en: "Syrup",
                      ja: "シロップ",
                      ko: "시럽",
                      "zh-CN": "糖浆",
                    },
                    unit: {
                      "zh-TW": "毫升",
                      en: "ml",
                      ja: "ミリリットル",
                      ko: "밀리리터",
                      "zh-CN": "毫升",
                    },
                    usage: 10,
                  },
                ],
                sold: 10,
                stock: null,
              },
              {
                id: "regular",
                name: {
                  "zh-TW": "正常",
                  en: "Regular",
                  ja: "通常",
                  ko: "기본",
                  "zh-CN": "正常",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [
                  {
                    id: "syrup",
                    name: {
                      "zh-TW": "糖漿",
                      en: "Syrup",
                      ja: "シロップ",
                      ko: "시럽",
                      "zh-CN": "糖浆",
                    },
                    unit: {
                      "zh-TW": "毫升",
                      en: "ml",
                      ja: "ミリリットル",
                      ko: "밀리리터",
                      "zh-CN": "毫升",
                    },
                    usage: 20,
                  },
                ],
                sold: 2,
                stock: null,
              },
            ],
            multiple: false,
            required: true,
          },
        ],
        price: 110,
        recipes: [],
        sold: 3,
        stock: 5,
      },
    ],
  },
  {
    id: "signature",
    name: {
      "zh-TW": "招牌特調",
      en: "Signature Drinks",
      ja: "シグネチャードリンク",
      ko: "시그니처 음료",
      "zh-CN": "招牌特调",
    },
    items: [
      {
        id: "sig-1",
        name: {
          "zh-TW": "水果氣泡飲",
          en: "Fruit Sparkling Drink",
          ja: "フルーツスパークリング",
          ko: "과일 스파클링 음료",
          "zh-CN": "水果气泡饮",
        },
        createdAt: "2024-06-01T09:00:00",
        description: {
          "zh-TW": "新鮮水果搭配氣泡水，清爽解膩。",
          en: "Fresh fruits with sparkling water for a refreshing taste.",
          ja: "新鮮なフルーツと炭酸水で爽やかな味わい。",
          ko: "신선한 과일과 탄산수의 상쾌한 조합.",
          "zh-CN": "新鲜水果搭配气泡水，清爽解腻。",
        },
        imageUrl: "/images/IMG_4590.jpg",
        isActive: true,
        options: [
          {
            id: "topping",
            name: {
              "zh-TW": "加料",
              en: "Toppings",
              ja: "トッピング",
              ko: "토핑",
              "zh-CN": "加料",
            },
            choices: [
              {
                id: "chia_seeds",
                name: {
                  "zh-TW": "奇亞籽",
                  en: "Chia Seeds",
                  ja: "チアシード",
                  ko: "치아시드",
                  "zh-CN": "奇亚籽",
                },
                extraCost: 10,
                isActive: true,
                isShared: true,
                recipes: [],
                sold: 10,
                stock: null,
              },
              {
                id: "mint",
                name: {
                  "zh-TW": "薄荷",
                  en: "Mint",
                  ja: "ミント",
                  ko: "민트",
                  "zh-CN": "薄荷",
                },
                extraCost: 0,
                isActive: true,
                isShared: true,
                recipes: [],
                sold: 6,
                stock: null,
              },
              {
                id: "pudding",
                name: {
                  "zh-TW": "布丁",
                  en: "Pudding",
                  ja: "プリン",
                  ko: "푸딩",
                  "zh-CN": "布丁",
                },
                extraCost: 15,
                isActive: true,
                isShared: true,
                recipes: [],
                sold: 10,
                stock: 0,
              },
            ],
            multiple: true,
            required: false,
          },
        ],
        price: 140,
        recipes: [],
        sold: 2,
        stock: 3,
      },
      {
        id: "sig-2",
        name: {
          "zh-TW": "抹茶氣泡拿鐵",
          en: "Matcha Sparkling Latte",
          ja: "抹茶スパークリングラテ",
          ko: "말차 스파클링 라떼",
          "zh-CN": "抹茶气泡拿铁",
        },
        createdAt: "2024-06-05T14:30:00",
        description: {
          "zh-TW": "抹茶與牛奶氣泡完美結合。",
          en: "A refreshing fusion of matcha, milk, and sparkling water.",
          ja: "抹茶とミルク、炭酸の爽やかな融合。",
          ko: "말차, 우유, 탄산의 상쾌한 조화.",
          "zh-CN": "抹茶与牛奶气泡完美结合。",
        },
        imageUrl: "/images/IMG_4590.jpg",
        isActive: true,
        options: [
          {
            id: "size",
            name: {
              "zh-TW": "尺寸",
              en: "Size",
              ja: "サイズ",
              ko: "사이즈",
              "zh-CN": "尺寸",
            },
            choices: [
              {
                id: "l",
                name: {
                  "zh-TW": "L",
                  en: "L",
                  ja: "L",
                  ko: "L",
                  "zh-CN": "L",
                },
                extraCost: 0,
                isActive: true,
                isShared: false,
                recipes: [],
                sold: 4,
                stock: null,
              },
            ],
            multiple: false,
            required: true,
          },
        ],
        price: 150,
        recipes: [],
        sold: 7,
        stock: 6,
      },
    ],
  },
  {
    id: "pastry",
    name: {
      "zh-TW": "甜點",
      en: "Pastries",
      ja: "ペストリー",
      ko: "디저트",
      "zh-CN": "甜点",
    },
    items: [
      {
        id: "pastry-1",
        name: {
          "zh-TW": "經典可頌",
          en: "Classic Croissant",
          ja: "クラシッククロワッサン",
          ko: "클래식 크루아상",
          "zh-CN": "经典可颂",
        },
        createdAt: "2024-04-28T08:10:00",
        description: {
          "zh-TW": "外酥內軟的法式可頌。",
          en: "Crispy outside and soft inside French croissant.",
          ja: "外はサクサク、中はふんわりのフランス風クロワッサン。",
          ko: "겉은 바삭하고 속은 부드러운 프랑스식 크루아상.",
          "zh-CN": "外酥内软的法式可颂。",
        },
        imageUrl: "/images/IMG_4590.jpg",
        isActive: true,
        options: [],
        price: 60,
        recipes: [],
        sold: 2,
        stock: 8,
      },
      {
        id: "pastry-2",
        name: {
          "zh-TW": "巧克力蛋糕",
          en: "Chocolate Cake",
          ja: "チョコレートケーキ",
          ko: "초콜릿 케이크",
          "zh-CN": "巧克力蛋糕",
        },
        createdAt: "2024-05-15T12:00:00",
        description: {
          "zh-TW": "濃郁黑巧克力海綿蛋糕。",
          en: "Rich dark chocolate sponge cake.",
          ja: "濃厚なダークチョコレートのスポンジケーキ。",
          ko: "진한 다크 초콜릿 스펀지 케이크.",
          "zh-CN": "浓郁黑巧克力海绵蛋糕。",
        },
        imageUrl: "/images/IMG_4590.jpg",
        isActive: true,
        options: [],
        price: 90,
        recipes: [],
        sold: 4,
        stock: 2,
      },
    ],
  },
  {
    id: "snack",
    name: {
      "zh-TW": "輕食",
      en: "Snacks",
      ja: "軽食",
      ko: "간편식",
      "zh-CN": "轻食",
    },
    items: [
      {
        id: "snack-1",
        name: {
          "zh-TW": "火腿起司三明治",
          en: "Ham & Cheese Sandwich",
          ja: "ハムチーズサンドイッチ",
          ko: "햄 치즈 샌드위치",
          "zh-CN": "火腿起司三明治",
        },
        createdAt: "2024-06-03T11:45:00",
        description: {
          "zh-TW": "火腿、起司與生菜夾於法式軟包中。",
          en: "Ham, cheese, and lettuce in a soft French bun.",
          ja: "ハム、チーズ、レタスをフレンチバンズに挟んだサンド。",
          ko: "햄, 치즈, 상추를 프렌치 번에 넣은 샌드위치.",
          "zh-CN": "火腿、起司与生菜夹于法式软包中。",
        },
        imageUrl: "/images/IMG_4590.jpg",
        isActive: true,
        options: [
          {
            id: "topping",
            name: {
              "zh-TW": "加料",
              en: "Toppings",
              ja: "トッピング",
              ko: "추가재료",
              "zh-CN": "加料",
            },
            choices: [
              {
                id: "tomato",
                name: {
                  "zh-TW": "番茄",
                  en: "Tomato",
                  ja: "トマト",
                  ko: "토마토",
                  "zh-CN": "番茄",
                },
                extraCost: 5,
                isActive: true,
                isShared: true,
                recipes: [],
                sold: 3,
                stock: 4,
              },
              {
                id: "lettuce",
                name: {
                  "zh-TW": "生菜",
                  en: "Lettuce",
                  ja: "レタス",
                  ko: "상추",
                  "zh-CN": "生菜",
                },
                extraCost: 0,
                isActive: true,
                isShared: true,
                recipes: [],
                sold: 7,
                stock: 5,
              },
            ],
            multiple: true,
            required: false,
          },
        ],
        price: 150,
        recipes: [],
        sold: 8,
        stock: 0,
      },
      {
        id: "snack-2",
        name: {
          "zh-TW": "雞肉沙拉",
          en: "Chicken Salad",
          ja: "チキンサラダ",
          ko: "치킨 샐러드",
          "zh-CN": "鸡肉沙拉",
        },
        createdAt: "2024-05-27T18:20:00",
        description: {
          "zh-TW": "新鮮生菜搭配香煎雞肉。",
          en: "Fresh lettuce with grilled chicken.",
          ja: "新鮮なレタスと香ばしいグリルチキンのサラダ。",
          ko: "신선한 채소와 구운 치킨이 어우러진 샐러드.",
          "zh-CN": "新鲜生菜搭配香煎鸡肉。",
        },
        imageUrl: "/images/IMG_4590.jpg",
        isActive: true,
        options: [
          {
            id: "topping",
            name: {
              "zh-TW": "加料",
              en: "Toppings",
              ja: "トッピング",
              ko: "추가재료",
              "zh-CN": "加料",
            },
            choices: [
              {
                id: "tomato",
                name: {
                  "zh-TW": "番茄",
                  en: "Tomato",
                  ja: "トマト",
                  ko: "토마토",
                  "zh-CN": "番茄",
                },
                extraCost: 5,
                isActive: true,
                isShared: true,
                recipes: [],
                sold: 3,
                stock: 5,
              },
              {
                id: "lettuce",
                name: {
                  "zh-TW": "生菜",
                  en: "Lettuce",
                  ja: "レタス",
                  ko: "상추",
                  "zh-CN": "生菜",
                },
                extraCost: 0,
                isActive: true,
                isShared: true,
                recipes: [],
                sold: 7,
                stock: 5,
              },
            ],
            multiple: true,
            required: false,
          },
        ],
        price: 160,
        recipes: [],
        sold: 5,
        stock: 8,
      },
    ],
  },
];
