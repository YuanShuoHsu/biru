import { type components, orderBoardStatusValues } from "@/types/api";

export type CreateOrderDto = components["schemas"]["CreateOrderDto"];
export type OrderResponse = components["schemas"]["OrderResponseDto"];
export type UserOrderListResponse =
  components["schemas"]["UserOrderListResponseDto"];
export type UserOrderResponse = components["schemas"]["UserOrderResponseDto"];
export type OrderItemResponse = components["schemas"]["OrderItemResponseDto"];
export type OrderBoardItem = components["schemas"]["OrderBoardItemDto"];
export type OrderBoardStatus = (typeof orderBoardStatusValues)[number];
