"use client";

import CustomizedTabs from "@/components/CustomizedTabs";
import OrderBottomBar from "@/components/OrderBottomBar";

import { useOrderSearchStore } from "@/stores/useOrderSearchStore";

const OrderTableNumber = () => {
  const { orderSearchText } = useOrderSearchStore();

  return (
    <>
      <CustomizedTabs searchText={orderSearchText.trim().toLowerCase()} />
      <OrderBottomBar />
    </>
  );
};

export default OrderTableNumber;
