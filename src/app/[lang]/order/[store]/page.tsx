import { notFound } from "next/navigation";

import { stores } from "@/constants/stores";

import OrderSelect from "../OrderSelect";

interface OrderStorePageProps {
  params: Promise<{ store: string }>;
}

const OrderStorePage = async ({ params }: OrderStorePageProps) => {
  const { store } = await params;

  const hasStore = stores.some(({ value }) => value === store);
  if (!hasStore) return notFound();

  return <OrderSelect showTable />;
};

export default OrderStorePage;
