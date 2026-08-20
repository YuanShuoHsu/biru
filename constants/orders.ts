import type { ChipProps } from "@mui/material/Chip";

import type { OrderBoardStatus } from "@/types/orders";

export const STATUS_COLORS: Record<OrderBoardStatus, ChipProps["color"]> = {
  OrderPaymentDue: "error",
  OrderPickupAvailable: "info",
  OrderProcessing: "warning",
};
