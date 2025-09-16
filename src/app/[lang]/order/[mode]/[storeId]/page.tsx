import { notFound, redirect } from "next/navigation";

import type { LocaleCode } from "@/types/locale";
import { ORDER_MODE, type OrderMode } from "@/types/orderMode";
import type { StoreId } from "@/types/stores";

interface OrderModeStoreIdPageProps {
  params: Promise<{ lang: LocaleCode; mode: OrderMode; storeId: StoreId }>;
}

const OrderModeStoreIdPage = async ({ params }: OrderModeStoreIdPageProps) => {
  const { lang, mode, storeId } = await params;

  if (mode !== ORDER_MODE.Pickup) {
    return notFound();
  }

  redirect(`/${lang}/order/${mode}/${storeId}/0`);
};

export default OrderModeStoreIdPage;
