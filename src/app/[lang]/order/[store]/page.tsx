import { notFound } from "next/navigation";

import OrderSelect from "../OrderSelect";

import type { StoreValue } from "@/types/stores";

import { stores } from "@/utils/stores";

interface OrderStorePageProps {
  params: Promise<{ store: StoreValue }>;
}

const OrderStorePage = async ({ params }: OrderStorePageProps) => {
  const { store } = await params;

  const hasStore = stores.some(({ value }) => value === store);
  if (!hasStore) return notFound();

  return <OrderSelect showTable />;
};

export default OrderStorePage;
