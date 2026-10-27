import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import type { OrderStatus } from "@/types/orders";

import { alertUser, enableAlertSound } from "@/utils/alerts";

export const useOrderReadyAlert = (
  order: {
    orderId: string;
    orderNumber: string;
    orderStatus: OrderStatus;
  } | null,
) => {
  const tOrder = useTranslations("order");

  const orderId = order?.orderId;
  const orderNumber = order?.orderNumber;
  const orderStatus = order?.orderStatus;

  const previousStatusRef = useRef(orderStatus);

  useEffect(() => {
    if (!orderId) return;

    const handleFirstInteraction = () => {
      enableAlertSound();
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
    };
  }, [orderId]);

  useEffect(() => {
    const previousStatus = previousStatusRef.current;
    previousStatusRef.current = orderStatus;

    if (
      !orderId ||
      !orderNumber ||
      orderStatus !== "OrderPickupAvailable" ||
      !previousStatus ||
      previousStatus === orderStatus
    )
      return;

    alertUser({
      body: tOrder("ready.notify.body"),
      tag: orderId,
      title: tOrder("ready.notify.title", { orderNumber }),
    });
  }, [orderId, orderNumber, orderStatus, tOrder]);
};
