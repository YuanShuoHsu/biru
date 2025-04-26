import type { Category } from "@/types/menu";

export const menu: Category[] = [
  {
    id: "coffee",
    name: "咖啡飲品",
    items: [
      {
        id: "coffee-1",
        name: "經典拿鐵",
        description: "濃醇的義式濃縮搭配綿密牛奶泡沫。",
        imageUrl: "/images/IMG_4590.jpg",
        sizes: [
          { label: "M", price: 120 },
          { label: "L", price: 140 },
        ],
        tags: ["popular"],
        options: [
          {
            name: "甜度",
            choices: [
              { label: "正常", extraCost: 0 },
              { label: "少糖", extraCost: 0 },
              { label: "無糖", extraCost: 0 },
            ],
          },
          {
            name: "冰塊",
            choices: [
              { label: "正常", extraCost: 0 },
              { label: "去冰", extraCost: 0 },
              { label: "熱飲", extraCost: 0 },
            ],
          },
          {
            name: "加料",
            choices: [
              { label: "珍珠", extraCost: 10 },
              { label: "布丁", extraCost: 15 },
            ],
          },
        ],
        inStock: true,
      },
      {
        id: "coffee-2",
        name: "焦糖瑪奇朵",
        description: "香甜焦糖與香醇濃縮完美結合。",
        imageUrl: "/images/IMG_4590.jpg",
        sizes: [
          { label: "M", price: 130 },
          { label: "L", price: 150 },
        ],
        tags: ["new"],
        options: [
          {
            name: "甜度",
            choices: [
              { label: "正常", extraCost: 0 },
              { label: "少糖", extraCost: 0 },
              { label: "無糖", extraCost: 0 },
            ],
          },
        ],
        inStock: true,
      },
    ],
  },
  {
    id: "tea",
    name: "茶飲",
    items: [
      {
        id: "tea-1",
        name: "茉香綠茶",
        description: "清新茉莉花香與綠茶完美融合。",
        imageUrl: "/images/IMG_4590.jpg",
        sizes: [{ label: "", price: 80 }],
        tags: ["lowCaffeine"],
        options: [
          {
            name: "冰塊",
            choices: [
              { label: "正常", extraCost: 0 },
              { label: "去冰", extraCost: 0 },
              { label: "熱飲", extraCost: 0 },
            ],
          },
        ],
        inStock: true,
      },
      {
        id: "tea-2",
        name: "伯爵鮮奶茶",
        description: "濃醇伯爵茶搭配鮮奶，口感滑順。",
        imageUrl: "/images/IMG_4590.jpg",
        sizes: [
          { label: "M", price: 110 },
          { label: "L", price: 130 },
        ],
        tags: ["popular"],
        options: [
          {
            name: "甜度",
            choices: [
              { label: "正常", extraCost: 0 },
              { label: "少糖", extraCost: 0 },
              { label: "無糖", extraCost: 0 },
            ],
          },
        ],
        inStock: true,
      },
    ],
  },
  {
    id: "signature",
    name: "招牌特調",
    items: [
      {
        id: "sig-1",
        name: "水果氣泡飲",
        description: "新鮮水果搭配氣泡水，清爽解膩。",
        imageUrl: "/images/IMG_4590.jpg",
        sizes: [{ label: "", price: 140 }],
        options: [
          {
            name: "加料",
            choices: [
              { label: "奇亞籽", extraCost: 10 },
              { label: "薄荷", extraCost: 0 },
            ],
          },
        ],
        inStock: true,
      },
      {
        id: "sig-2",
        name: "抹茶氣泡拿鐵",
        description: "抹茶與牛奶氣泡完美結合。",
        imageUrl: "/images/IMG_4590.jpg",
        sizes: [{ label: "L", price: 150 }],
        tags: ["new"],
        inStock: false,
      },
    ],
  },
  {
    id: "pastry",
    name: "甜點",
    items: [
      {
        id: "pastry-1",
        name: "經典可頌",
        description: "外酥內軟的法式可頌。",
        imageUrl: "/images/IMG_4590.jpg",
        sizes: [{ label: "", price: 60 }],
        inStock: true,
      },
      {
        id: "pastry-2",
        name: "巧克力蛋糕",
        description: "濃郁黑巧克力海綿蛋糕。",
        imageUrl: "/images/IMG_4590.jpg",
        sizes: [{ label: "", price: 90 }],
        tags: ["new"],
        inStock: true,
      },
    ],
  },
  {
    id: "snack",
    name: "輕食",
    items: [
      {
        id: "snack-1",
        name: "火腿起司三明治",
        description: "火腿、起司與生菜夾於法式軟包中。",
        imageUrl: "/images/IMG_4590.jpg",
        sizes: [{ label: "", price: 150 }],
        options: [
          {
            name: "加料",
            choices: [
              { label: "番茄", extraCost: 5 },
              { label: "生菜", extraCost: 0 },
            ],
          },
        ],
        inStock: true,
      },
      {
        id: "snack-2",
        name: "雞肉沙拉",
        description: "新鮮生菜搭配香煎雞肉。",
        imageUrl: "/images/IMG_4590.jpg",
        sizes: [{ label: "", price: 160 }],
        inStock: true,
      },
    ],
  },
];
