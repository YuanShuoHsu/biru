"use client";

import CustomizedTabs from "@/components/CustomizedTabs";

import { useOrderSearchStore } from "@/stores/useOrderSearchStore";

const OrderTableNumber = () => {
  const { orderSearchText } = useOrderSearchStore();

  return <CustomizedTabs searchText={orderSearchText.trim().toLowerCase()} />;
};

export default OrderTableNumber;
