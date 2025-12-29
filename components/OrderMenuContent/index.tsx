"use client";

import CustomizedTabs from "@/components/CustomizedTabs";
import OrderBottomBar from "@/components/OrderBottomBar";

import { useMenuSocket } from "@/hooks/useMenuSocket";

interface OrderMenuContentProps {
  storeId: string;
}

const OrderMenuContent = ({ storeId }: OrderMenuContentProps) => {
  useMenuSocket(storeId);

  return (
    <>
      <CustomizedTabs />
      <OrderBottomBar />
    </>
  );
};

export default OrderMenuContent;
