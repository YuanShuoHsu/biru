"use client";

import CustomizedTabs from "@/components/CustomizedTabs";

import { useOrderSearchStore } from "@/stores/useOrderSearchStore";

const Order = () => {
  const { orderSearchText } = useOrderSearchStore();

  return <CustomizedTabs searchText={orderSearchText.trim().toLowerCase()} />;
};

export default Order;
