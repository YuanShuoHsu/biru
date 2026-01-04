import { notFound } from "next/navigation";

import type { Locale } from "@/app/[lang]/dictionaries";

import OrderModeDineInStoreSlugTableNumberSelect from "@/components/OrderModeDineInStoreSlugTableNumberSelect";

import { ORDER_MODE } from "@/constants/orderMode";

import type { OrderMode } from "@/types/orderMode";
import type { StoreSlug } from "@/types/stores";
import type { TableNumber } from "@/types/tableNumbers";

interface OrderModeStoreSlugTableNumberPageProps {
  params: Promise<{
    lang: Locale;
    mode: OrderMode;
    storeSlug: StoreSlug;
    tableNumber: TableNumber;
  }>;
}

const OrderModeStoreSlugTableNumberPage = async ({
  params,
}: OrderModeStoreSlugTableNumberPageProps) => {
  const { lang, mode, storeSlug, tableNumber } = await params;
  if (mode !== ORDER_MODE.DineIn) return notFound();

  return (
    <OrderModeDineInStoreSlugTableNumberSelect
      lang={lang}
      mode={mode}
      storeSlug={storeSlug}
      tableNumber={tableNumber}
    />
  );
};

export default OrderModeStoreSlugTableNumberPage;
