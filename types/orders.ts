import type { components } from "@/types/api";

export type CreateOrderDto = components["schemas"]["CreateOrderDto"];
export type CreateOrderPayment = CreateOrderDto["payment"];
export type OrderResponse = components["schemas"]["OrderResponseDto"];
export type OrderPaymentMethod = OrderResponse["paymentMethod"];
export type OrderStatus = OrderResponse["orderStatus"];
export type UserOrderListResponse =
  components["schemas"]["UserOrderListResponseDto"];
export type UserOrderResponse = components["schemas"]["UserOrderResponseDto"];
export type OrderItemResponse = components["schemas"]["OrderItemResponseDto"];
export type OrderInvoiceResponse = components["schemas"]["OrderInvoiceDto"];
export type InvoiceStatus = components["schemas"]["InvoiceStatus"];
export type OrderBoardItem = components["schemas"]["OrderBoardItemDto"];
