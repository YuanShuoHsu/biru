export const ORDER_MODE = {
  DineIn: "dine-in",
  Pickup: "pickup",
} as const;

export type OrderMode = (typeof ORDER_MODE)[keyof typeof ORDER_MODE];
