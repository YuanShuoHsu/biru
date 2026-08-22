import type { ChipProps } from "@mui/material/Chip";

import type { InvoiceStatus, OrderStatus } from "@/types/orders";

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, ChipProps["color"]> =
  {
    issued: "success",
    issuing: "info",
    pending: "warning",
    voided: "default",
  };

export const STATUS_COLORS: Record<OrderStatus, ChipProps["color"]> = {
  OrderCancelled: "default",
  OrderDelivered: "primary",
  OrderPaymentDue: "error",
  OrderPickupAvailable: "success",
  OrderProcessing: "warning",
  OrderProblem: "error",
  OrderReturned: "secondary",
};
