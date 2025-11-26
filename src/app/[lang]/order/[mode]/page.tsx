import { notFound } from "next/navigation";

import OrderModePickupStoreSlugSelect from "@/components/OrderModePickupStoreSlugSelect";

import { ORDER_MODE } from "@/constants/orderMode";

import type { LocaleCode } from "@/types/locale";
import type { OrderMode } from "@/types/orderMode";
import type { StoreSlug } from "@/types/stores";

interface OrderModePageProps {
  params: Promise<{ lang: LocaleCode; mode: OrderMode; storeSlug: StoreSlug }>;
}

const OrderModePage = async ({ params }: OrderModePageProps) => {
  const { lang, mode, storeSlug } = await params;
  if (mode !== ORDER_MODE.Pickup) return notFound();

  return (
    <OrderModePickupStoreSlugSelect
      lang={lang}
      mode={mode}
      storeSlug={storeSlug}
    />
  );
};

export default OrderModePage;
