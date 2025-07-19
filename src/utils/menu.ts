import { I18nDict } from "@/context/i18n";
import type { CartItemChoices } from "@/stores/useCartStore";

import type { LocaleCode } from "@/types/locale";
import type { Category, MenuItem, Option } from "@/types/menu";

const findMenuItemById = (id: string): MenuItem | undefined =>
  menu.flatMap(({ items }) => items).find(({ id: itemId }) => itemId === id);

export const getItemName = (id: string, lang: LocaleCode): string =>
  findMenuItemById(id)?.name[lang] || "";

export const isItemInStock = (id: string): boolean => {
  const item = findMenuItemById(id);
  if (!item) return false;

  return item.stock === null || item.stock > 0;
};

const findChoiceLabel = (
  option: Option,
  value: string,
  lang: LocaleCode,
): string => {
  const match = option.choices.find(
    ({ value: choiceValue }) => choiceValue === value,
  );

  return match?.label[lang] || "";
};

export const getChoiceLabels = (
  id: string,
  choices: CartItemChoices,
  lang: LocaleCode,
  { common: { colon, delimiter } }: I18nDict,
  joinWith: string = "\n",
): string => {
  const item = findMenuItemById(id);
  if (!item) return "";

  return Object.entries(choices)
    .flatMap(([key, value]) => {
      if (!value) return [];

      const option = item.options.find(({ name }) => name === key);
      if (!option) return [];

      const values = Array.isArray(value) ? value : [value];
      const valueLabels = values
        .map((choiceValue) => findChoiceLabel(option, choiceValue, lang))
        .filter(Boolean)
        .join(delimiter);

      return valueLabels ? [`${option.label[lang]}${colon}${valueLabels}`] : [];
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
        createdAt: "2025-05-04T22:50:00",
        description: {
          "zh-TW": "濃醇的義式濃縮搭配綿密牛奶泡沫。",
          en: "Rich espresso with velvety milk foam.",
          ja: "濃厚なエスプレッソにふわふわのミルクフォーム。",
          ko: "진한 에스프레소와 부드러운 우유 거품.",
          "zh-CN": "浓郁的意式浓缩配绵密奶泡。",
        },
        imageUrl: "/images/IMG_4590.jpg",
        options: [
          {
            name: "size",
            label: {
              "zh-TW": "尺寸",
              en: "Size",
              ja: "サイズ",
              ko: "사이즈",
              "zh-CN": "尺寸",
            },
            choices: [
              {
                label: {
                  "zh-TW": "M",
                  en: "M",
                  ja: "M",
                  ko: "M",
                  "zh-CN": "M",
                },
                value: "m",
                extraCost: 0,
                available: false,
              },
              {
                label: {
                  "zh-TW": "L",
                  en: "L",
                  ja: "L",
                  ko: "L",
                  "zh-CN": "L",
                },
                value: "l",
                extraCost: 20,
                available: true,
              },
            ],
            multiple: false,
            required: true,
          },
          {
            name: "sweetness",
            label: {
              "zh-TW": "甜度",
              en: "Sweetness",
              ja: "甘さ",
              ko: "당도",
              "zh-CN": "甜度",
            },
            choices: [
              {
                label: {
                  "zh-TW": "正常",
                  en: "Regular",
                  ja: "通常",
                  ko: "기본",
                  "zh-CN": "正常",
                },
                value: "regular",
                extraCost: 0,
                available: true,
              },
              {
                label: {
                  "zh-TW": "少糖",
                  en: "Less Sugar",
                  ja: "少なめ",
                  ko: "적당히",
                  "zh-CN": "少糖",
                },
                value: "less",
                extraCost: 0,
                available: true,
              },
              {
                label: {
                  "zh-TW": "無糖",
                  en: "No Sugar",
                  ja: "無糖",
                  ko: "무가당",
                  "zh-CN": "无糖",
                },
                value: "none",
                extraCost: 0,
                available: true,
              },
            ],
            multiple: false,
            required: true,
          },
          {
            name: "ice",
            label: {
              "zh-TW": "冰塊",
              en: "Ice Level",
              ja: "氷の量",
              ko: "얼음량",
              "zh-CN": "冰块",
            },
            choices: [
              {
                label: {
                  "zh-TW": "正常",
                  en: "Regular Ice",
                  ja: "普通",
                  ko: "기본",
                  "zh-CN": "正常",
                },
                value: "regular",
                extraCost: 0,
                available: true,
              },
              {
                label: {
                  "zh-TW": "去冰",
                  en: "Less Ice",
                  ja: "氷なし",
                  ko: "얼음 없음",
                  "zh-CN": "去冰",
                },
                value: "less",
                extraCost: 0,
                available: true,
              },
              {
                label: {
                  "zh-TW": "熱飲",
                  en: "Hot",
                  ja: "ホット",
                  ko: "따뜻하게",
                  "zh-CN": "热饮",
                },
                value: "hot",
                extraCost: 0,
                available: true,
              },
            ],
            multiple: false,
            required: true,
          },
          {
            name: "topping",
            label: {
              "zh-TW": "加料",
              en: "Toppings",
              ja: "トッピング",
              ko: "토핑",
              "zh-CN": "加料",
            },
            choices: [
              {
                label: {
                  "zh-TW": "珍珠",
                  en: "Pearls",
                  ja: "タピオカ",
                  ko: "타피오카",
                  "zh-CN": "珍珠",
                },
                value: "pearls",
                extraCost: 10,
                available: false,
              },
              {
                label: {
                  "zh-TW": "布丁",
                  en: "Pudding",
                  ja: "プリン",
                  ko: "푸딩",
                  "zh-CN": "布丁",
                },
                value: "pudding",
                extraCost: 15,
                available: true,
              },
            ],
            multiple: true,
            required: false,
          },
        ],
        price: 120,
        sold: 1,
        stock: 22,
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
        options: [
          {
            name: "size",
            label: {
              "zh-TW": "尺寸",
              en: "Size",
              ja: "サイズ",
              ko: "사이즈",
              "zh-CN": "尺寸",
            },
            choices: [
              {
                label: {
                  "zh-TW": "M",
                  en: "M",
                  ja: "M",
                  ko: "M",
                  "zh-CN": "M",
                },
                value: "m",
                extraCost: 0,
                available: true,
              },
              {
                label: {
                  "zh-TW": "L",
                  en: "L",
                  ja: "L",
                  ko: "L",
                  "zh-CN": "L",
                },
                value: "l",
                extraCost: 20,
                available: true,
              },
            ],
            multiple: false,
            required: true,
          },
          {
            name: "sweetness",
            label: {
              "zh-TW": "甜度",
              en: "Sweetness",
              ja: "甘さ",
              ko: "당도",
              "zh-CN": "甜度",
            },
            choices: [
              {
                label: {
                  "zh-TW": "正常",
                  en: "Regular",
                  ja: "通常",
                  ko: "기본",
                  "zh-CN": "正常",
                },
                value: "regular",
                extraCost: 0,
                available: true,
              },
              {
                label: {
                  "zh-TW": "少糖",
                  en: "Less Sugar",
                  ja: "少なめ",
                  ko: "적당히",
                  "zh-CN": "少糖",
                },
                value: "less",
                extraCost: 0,
                available: true,
              },
              {
                label: {
                  "zh-TW": "無糖",
                  en: "No Sugar",
                  ja: "無糖",
                  ko: "무가당",
                  "zh-CN": "无糖",
                },
                value: "none",
                extraCost: 0,
                available: true,
              },
            ],
            multiple: false,
            required: true,
          },
        ],
        price: 130,
        sold: 5,
        stock: 0,
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
        options: [
          {
            name: "ice",
            label: {
              "zh-TW": "冰塊",
              en: "Ice Level",
              ja: "氷の量",
              ko: "얼음량",
              "zh-CN": "冰块",
            },
            choices: [
              {
                label: {
                  "zh-TW": "正常",
                  en: "Regular Ice",
                  ja: "普通",
                  ko: "기본",
                  "zh-CN": "正常",
                },
                value: "regular",
                extraCost: 0,
                available: true,
              },
              {
                label: {
                  "zh-TW": "去冰",
                  en: "Less Ice",
                  ja: "氷なし",
                  ko: "얼음 없음",
                  "zh-CN": "去冰",
                },
                value: "less",
                extraCost: 0,
                available: true,
              },
              {
                label: {
                  "zh-TW": "熱飲",
                  en: "Hot",
                  ja: "ホット",
                  ko: "따뜻하게",
                  "zh-CN": "热饮",
                },
                value: "hot",
                extraCost: 0,
                available: true,
              },
            ],
            multiple: false,
            required: true,
          },
        ],
        price: 80,
        sold: 9,
        stock: 20,
        // tags: ["lowCaffeine"],
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
        options: [
          {
            name: "size",
            label: {
              "zh-TW": "尺寸",
              en: "Size",
              ja: "サイズ",
              ko: "사이즈",
              "zh-CN": "尺寸",
            },
            choices: [
              {
                label: {
                  "zh-TW": "M",
                  en: "M",
                  ja: "M",
                  ko: "M",
                  "zh-CN": "M",
                },
                value: "m",
                extraCost: 0,
                available: true,
              },
              {
                label: {
                  "zh-TW": "L",
                  en: "L",
                  ja: "L",
                  ko: "L",
                  "zh-CN": "L",
                },
                value: "l",
                extraCost: 20,
                available: true,
              },
            ],
            multiple: false,
            required: true,
          },
          {
            name: "sweetness",
            label: {
              "zh-TW": "甜度",
              en: "Sweetness",
              ja: "甘さ",
              ko: "당도",
              "zh-CN": "甜度",
            },
            choices: [
              {
                label: {
                  "zh-TW": "正常",
                  en: "Regular",
                  ja: "通常",
                  ko: "기본",
                  "zh-CN": "正常",
                },
                value: "regular",
                extraCost: 0,
                available: true,
              },
              {
                label: {
                  "zh-TW": "少糖",
                  en: "Less Sugar",
                  ja: "少なめ",
                  ko: "적당히",
                  "zh-CN": "少糖",
                },
                value: "less",
                extraCost: 0,
                available: true,
              },
              {
                label: {
                  "zh-TW": "無糖",
                  en: "No Sugar",
                  ja: "無糖",
                  ko: "무가당",
                  "zh-CN": "无糖",
                },
                value: "none",
                extraCost: 0,
                available: true,
              },
            ],
            multiple: false,
            required: true,
          },
        ],
        price: 110,
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
        options: [
          {
            name: "topping",
            label: {
              "zh-TW": "加料",
              en: "Toppings",
              ja: "トッピング",
              ko: "토핑",
              "zh-CN": "加料",
            },
            choices: [
              {
                label: {
                  "zh-TW": "奇亞籽",
                  en: "Chia Seeds",
                  ja: "チアシード",
                  ko: "치아시드",
                  "zh-CN": "奇亚籽",
                },
                value: "chia_seeds",
                extraCost: 10,
                available: true,
              },
              {
                label: {
                  "zh-TW": "薄荷",
                  en: "Mint",
                  ja: "ミント",
                  ko: "민트",
                  "zh-CN": "薄荷",
                },
                value: "mint",
                extraCost: 0,
                available: true,
              },
            ],
            multiple: true,
            required: false,
          },
        ],
        price: 140,
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
        options: [
          {
            name: "size",
            label: {
              "zh-TW": "尺寸",
              en: "Size",
              ja: "サイズ",
              ko: "사이즈",
              "zh-CN": "尺寸",
            },
            choices: [
              {
                label: {
                  "zh-TW": "L",
                  en: "L",
                  ja: "L",
                  ko: "L",
                  "zh-CN": "L",
                },
                value: "l",
                extraCost: 0,
                available: true,
              },
            ],
            multiple: false,
            required: true,
          },
        ],
        price: 150,
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
        options: [],
        price: 60,
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
        options: [],
        price: 90,
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
        options: [
          {
            name: "topping",
            label: {
              "zh-TW": "加料",
              en: "Toppings",
              ja: "トッピング",
              ko: "추가재료",
              "zh-CN": "加料",
            },
            choices: [
              {
                label: {
                  "zh-TW": "番茄",
                  en: "Tomato",
                  ja: "トマト",
                  ko: "토마토",
                  "zh-CN": "番茄",
                },
                value: "tomato",
                extraCost: 5,
                available: true,
              },
              {
                label: {
                  "zh-TW": "生菜",
                  en: "Lettuce",
                  ja: "レタス",
                  ko: "상추",
                  "zh-CN": "生菜",
                },
                value: "lettuce",
                extraCost: 0,
                available: true,
              },
            ],
            multiple: true,
            required: false,
          },
        ],
        price: 150,
        sold: 8,
        stock: 30,
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
        options: [],
        price: 160,
        sold: 6,
        stock: 20,
      },
    ],
  },
];
